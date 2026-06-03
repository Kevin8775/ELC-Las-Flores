import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const noticiasRouter = Router();

noticiasRouter.get("/", async (_req, res) => {
  const noticias = await prisma.noticia.findMany({
    include: { autor: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ noticias });
});

noticiasRouter.get("/:id", async (req, res) => {
  const noticia = await prisma.noticia.findUnique({
    where: { id: req.params.id },
    include: { autor: true },
  });
  if (!noticia) return res.status(404).json({ error: "Noticia no encontrada" });
  res.json({ noticia });
});

noticiasRouter.post("/", requireAuth, async (req, res) => {
  const admin = await prisma.admin.findUnique({ where: { userId: req.user!.id } });
  if (!admin) return res.status(403).json({ error: "Solo los administradores pueden crear noticias" });

  const noticia = await prisma.noticia.create({
    data: {
      titulo: req.body.titulo,
      contenido: req.body.contenido,
      categoria: req.body.categoria ?? "NOTICIA",
      imagen: req.body.imagen,
      fechaPublicacion: new Date(),
      autorId: admin.id,
    },
  });
  res.status(201).json({ noticia });
});
