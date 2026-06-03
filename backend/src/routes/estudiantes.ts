import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

export const estudiantesRouter = Router();

estudiantesRouter.use(requireAuth);

const nivelAbr: Record<string, string> = {
  BASICO: "BAS",
  INTERMEDIO: "INT",
  AVANZADO: "AVA",
};

async function generarMatricula(nivel: string): Promise<string> {
  const year = new Date().getFullYear();
  const abr = nivelAbr[nivel] ?? "GEN";
  const prefix = `ELC-${year}-${abr}-`;
  const last = await prisma.estudiante.findFirst({
    where: { numeroMatricula: { startsWith: prefix } },
    orderBy: { numeroMatricula: "desc" },
    select: { numeroMatricula: true },
  });
  const seq = last ? String(Number(last.numeroMatricula.split("-").pop()) + 1).padStart(4, "0") : "0001";
  return `${prefix}${seq}`;
}

const createEstudianteSchema = z.object({
  nombre: z.string().min(1),
  fechaNacimiento: z.string().min(1),
  genero: z.enum(["M", "F"]),
  correoElectronico: z.string().email().optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
  direccion: z.string().min(1),
  nivel: z.enum(["BASICO", "INTERMEDIO", "AVANZADO"]),
  turno: z.enum(["MATUTINO", "VESPERTINO", "SABATINO"]).optional().default("SABATINO"),
  tutorNombre: z.string().min(1),
  tutorParentesco: z.string().min(1),
  tutorCorreo: z.string().email().optional().or(z.literal("")),
  tutorTelefono: z.string().min(1),
  tutorDireccion: z.string().optional().or(z.literal("")),
  docenteAsignadoId: z.string().optional().or(z.literal("")),
});

estudiantesRouter.post("/", async (req, res) => {
  const parsed = createEstudianteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos invalidos", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const grupo = await prisma.grupo.findUnique({
    where: {
      nivel_turno: {
        nivel: data.nivel,
        turno: data.turno,
      },
    },
    select: {
      id: true,
      docenteId: true,
    },
  });

  if (!grupo) {
    return res.status(400).json({ error: "No existe un grupo disponible para ese nivel y turno" });
  }

  const numeroMatricula = await generarMatricula(data.nivel);
  const estudiante = await prisma.estudiante.create({
    data: {
      numeroMatricula,
      nombre: data.nombre,
      fechaNacimiento: new Date(data.fechaNacimiento),
      genero: data.genero,
      correoElectronico: data.correoElectronico || undefined,
      telefono: data.telefono || undefined,
      direccion: data.direccion,
      nivel: data.nivel,
      turno: data.turno,
      grupoId: grupo.id,
      tutorNombre: data.tutorNombre,
      tutorParentesco: data.tutorParentesco,
      tutorCorreo: data.tutorCorreo || undefined,
      tutorTelefono: data.tutorTelefono,
      tutorDireccion: data.tutorDireccion || undefined,
      docenteAsignadoId: grupo.docenteId ?? data.docenteAsignadoId ?? undefined,
    },
  });
  res.status(201).json({ estudiante, grupo });
});

estudiantesRouter.get("/", async (_req, res) => {
  const estudiantes = await prisma.estudiante.findMany({
    include: { user: true, docenteAsignado: { include: { user: true } }, pagos: true, notas: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ estudiantes });
});

estudiantesRouter.get("/:id", async (req, res) => {
  const estudiante = await prisma.estudiante.findUnique({
    where: { id: req.params.id },
    include: { user: true, docenteAsignado: { include: { user: true } }, pagos: true, notas: true },
  });
  if (!estudiante) return res.status(404).json({ error: "Estudiante no encontrado" });
  res.json({ estudiante });
});

estudiantesRouter.put("/:id", async (req, res) => {
  const parsed = createEstudianteSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos invalidos", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const estudiante = await prisma.estudiante.update({
    where: { id: req.params.id },
    data: {
      ...(data.nombre && { nombre: data.nombre }),
      ...(data.fechaNacimiento && { fechaNacimiento: new Date(data.fechaNacimiento) }),
      ...(data.genero && { genero: data.genero }),
      ...(data.correoElectronico !== undefined && { correoElectronico: data.correoElectronico || null }),
      ...(data.telefono !== undefined && { telefono: data.telefono || null }),
      ...(data.direccion && { direccion: data.direccion }),
      ...(data.nivel && { nivel: data.nivel }),
      ...(data.turno && { turno: data.turno }),
      ...(data.tutorNombre && { tutorNombre: data.tutorNombre }),
      ...(data.tutorParentesco && { tutorParentesco: data.tutorParentesco }),
      ...(data.tutorCorreo !== undefined && { tutorCorreo: data.tutorCorreo || null }),
      ...(data.tutorTelefono && { tutorTelefono: data.tutorTelefono }),
      ...(data.tutorDireccion !== undefined && { tutorDireccion: data.tutorDireccion || null }),
      ...(data.docenteAsignadoId !== undefined && { docenteAsignadoId: data.docenteAsignadoId || null }),
    },
  });
  res.json({ estudiante });
});

estudiantesRouter.delete("/:id", async (req, res) => {
  const estudiante = await prisma.estudiante.findUnique({
    where: { id: req.params.id },
    select: { userId: true },
  });

  if (!estudiante) {
    return res.status(404).json({ error: "Estudiante no encontrado" });
  }

  await prisma.$transaction(async (tx) => {
    if (estudiante.userId) {
      await tx.user.delete({ where: { id: estudiante.userId } });
    }
    await tx.estudiante.delete({ where: { id: req.params.id } });
  });

  res.status(204).end();
});
