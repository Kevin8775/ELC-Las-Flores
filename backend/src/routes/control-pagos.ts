import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const controlPagosRouter = Router();

controlPagosRouter.use(requireAuth);

controlPagosRouter.get("/estudiantes", async (req, res) => {
  try {
    const { nivel, turno } = req.query;
    const where: Record<string, unknown> = { estado: "ACTIVO" };
    if (typeof nivel === "string" && nivel) where.nivel = nivel;
    if (typeof turno === "string" && turno) where.turno = turno;

    const estudiantes = await prisma.estudiante.findMany({
      where,
      orderBy: { nombre: "asc" },
    });
    res.json({ estudiantes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener estudiantes" });
  }
});

controlPagosRouter.get("/pagos", async (req, res) => {
  try {
    const { estudianteId, anio, mesInicio, mesFin } = req.query;

    if (!estudianteId || !anio || !mesInicio || !mesFin) {
      return res.status(400).json({ error: "Faltan parametros: estudianteId, anio, mesInicio, mesFin" });
    }

    const pagos = await prisma.pago.findMany({
      where: {
        estudianteId: estudianteId as string,
        anio: parseInt(anio as string),
        mes: {
          gte: parseInt(mesInicio as string),
          lte: parseInt(mesFin as string),
        },
      },
      orderBy: [{ mes: "asc" }, { fechaPago: "asc" }],
    });

    res.json({ pagos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener pagos" });
  }
});

controlPagosRouter.post("/generar", async (req, res) => {
  try {
    const { estudianteId, mesInicio, mesFin, anio } = req.body;

    if (!estudianteId || !mesInicio || !mesFin || !anio) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const admin = await prisma.admin.findUnique({ where: { userId: req.user!.id } });
    if (!admin) return res.status(403).json({ error: "Solo administradores pueden generar controles" });

    const control = await prisma.controlPagos.create({
      data: {
        estudianteId,
        mesInicio,
        mesFin,
        anio,
        modo: "GENERADO",
        generadoPorId: admin.id,
      },
    });

    res.json({ control });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar control de pagos" });
  }
});
