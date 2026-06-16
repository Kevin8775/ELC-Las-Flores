import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { sendNewTestimonialNotification } from "../lib/email";

export const testimoniosRouter = Router();

testimoniosRouter.get("/", async (_req, res) => {
  const testimonios = await prisma.testimonio.findMany({
    where: { aprobado: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ testimonios });
});

testimoniosRouter.post("/", async (req, res) => {
  const { nombre, texto, rol } = req.body;

  if (!nombre?.trim() || !texto?.trim()) {
    return res.status(400).json({ error: "Nombre y texto son requeridos" });
  }

  const testimonio = await prisma.testimonio.create({
    data: { nombre: nombre.trim(), texto: texto.trim(), rol: rol?.trim() || null },
  });

  sendNewTestimonialNotification(nombre).catch(() => {});

  res.status(201).json({ testimonio });
});

testimoniosRouter.get("/todos", requireAuth, async (_req, res) => {
  const testimonios = await prisma.testimonio.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ testimonios });
});

testimoniosRouter.patch("/:id", requireAuth, async (req, res) => {
  const { aprobado } = req.body;

  if (typeof aprobado !== "boolean") {
    return res.status(400).json({ error: "aprobado debe ser booleano" });
  }

  const testimonio = await prisma.testimonio.update({
    where: { id: req.params.id as string },
    data: { aprobado },
  });

  res.json({ testimonio });
});

testimoniosRouter.delete("/:id", requireAuth, async (req, res) => {
  await prisma.testimonio.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
});
