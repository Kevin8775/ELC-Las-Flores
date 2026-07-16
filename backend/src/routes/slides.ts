import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const slidesRouter = Router();

slidesRouter.get("/", async (_req, res) => {
  const slides = await prisma.slide.findMany({ orderBy: { orden: "asc" } });
  res.json({ slides });
});

slidesRouter.post("/", requireAuth, async (req, res) => {
  try {
    const { src, alt } = req.body;
    if (!src) return res.status(400).json({ error: "src requerido" });
    const maxOrden = await prisma.slide.aggregate({ _max: { orden: true } });
    const slide = await prisma.slide.create({
      data: {
        src,
        alt: alt || null,
        orden: (maxOrden._max.orden ?? -1) + 1,
      },
    });
    res.status(201).json({ slide });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear slide" });
  }
});

slidesRouter.put("/:id", requireAuth, async (req, res) => {
  const { alt, orden } = req.body;
  const id = req.params.id as string;
  const slide = await prisma.slide.update({
    where: { id },
    data: { ...(alt !== undefined && { alt }), ...(orden !== undefined && { orden }) },
  });
  res.json({ slide });
});

slidesRouter.delete("/:id", requireAuth, async (req, res) => {
  const id = req.params.id as string;
  await prisma.slide.delete({ where: { id } });
  res.json({ success: true });
});
