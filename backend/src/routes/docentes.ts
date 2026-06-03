import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";
import { hash } from "bcryptjs";

export const docentesRouter = Router();

docentesRouter.use(requireAuth);

const createDocenteSchema = z.object({
  nombre: z.string().min(1),
  correoElectronico: z.string().email(),
  telefono: z.string().optional().or(z.literal("")),
  fechaNacimiento: z.string().optional().or(z.literal("")),
  genero: z.enum(["M", "F"]).optional(),
  direccion: z.string().optional().or(z.literal("")),
  especialidad: z.string().optional().or(z.literal("")),
  fechaIngreso: z.string().optional().or(z.literal("")),
});

docentesRouter.post("/", async (req, res) => {
  const parsed = createDocenteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos invalidos", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const passwordHash = await hash("Docente123*", 12);

  const docente = await prisma.docente.create({
    data: {
      nombre: data.nombre,
      correoElectronico: data.correoElectronico,
      telefono: data.telefono || undefined,
      fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
      genero: data.genero || undefined,
      direccion: data.direccion || undefined,
      especialidad: data.especialidad || undefined,
      fechaIngreso: data.fechaIngreso ? new Date(data.fechaIngreso) : undefined,
      user: {
        create: {
          nombre: data.nombre,
          email: data.correoElectronico,
          passwordHash,
          role: "DOCENTE",
        },
      },
    },
    include: { user: true },
  });
  res.status(201).json({ docente });
});

docentesRouter.get("/", async (_req, res) => {
  const docentes = await prisma.docente.findMany({
    include: { user: true, estudiantes: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ docentes });
});

docentesRouter.get("/:id", async (req, res) => {
  const docente = await prisma.docente.findUnique({
    where: { id: req.params.id },
    include: { user: true, estudiantes: { include: { user: true } } },
  });
  if (!docente) return res.status(404).json({ error: "Docente no encontrado" });
  res.json({ docente });
});

docentesRouter.put("/:id", async (req, res) => {
  const parsed = createDocenteSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos invalidos", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const docente = await prisma.docente.update({
    where: { id: req.params.id },
    data: {
      ...(data.nombre && { nombre: data.nombre }),
      ...(data.correoElectronico && { correoElectronico: data.correoElectronico }),
      ...(data.telefono !== undefined && { telefono: data.telefono || null }),
      ...(data.fechaNacimiento !== undefined && { fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null }),
      ...(data.genero !== undefined && { genero: data.genero ?? null }),
      ...(data.direccion !== undefined && { direccion: data.direccion || null }),
      ...(data.especialidad !== undefined && { especialidad: data.especialidad || null }),
      ...(data.fechaIngreso !== undefined && { fechaIngreso: data.fechaIngreso ? new Date(data.fechaIngreso) : null }),
    },
  });
  res.json({ docente });
});

docentesRouter.delete("/:id", async (req, res) => {
  const docente = await prisma.docente.findUnique({ where: { id: req.params.id }, select: { userId: true } });
  if (docente?.userId) {
    await prisma.user.delete({ where: { id: docente.userId } });
  }
  await prisma.docente.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
