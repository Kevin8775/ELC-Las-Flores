import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const noticiasRouter = Router();

noticiasRouter.get("/", async (_req, res) => {
  const noticias = await prisma.noticia.findMany({
    include: { autor: true, imagenes: { orderBy: { orden: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ noticias });
});

noticiasRouter.get("/:id", async (req, res) => {
  const id = req.params.id as string;
  const noticia = await prisma.noticia.findUnique({
    where: { id },
    include: { autor: true, imagenes: { orderBy: { orden: "asc" } } },
  });
  if (!noticia) return res.status(404).json({ error: "Noticia no encontrada" });
  res.json({ noticia });
});

noticiasRouter.post("/", requireAuth, async (req, res) => {
  const admin = await prisma.admin.findUnique({ where: { userId: req.user!.id } });
  if (!admin) return res.status(403).json({ error: "Solo los administradores pueden crear noticias" });

  try {
    const { titulo, contenido, categoria, imagenes } = req.body;
    const imagenesData = Array.isArray(imagenes) ? imagenes : [];

    const noticia = await prisma.noticia.create({
      data: {
        titulo,
        contenido,
        categoria: categoria ?? "NOTICIA",
        fechaPublicacion: new Date(),
        autorId: admin.id,
        imagenes: imagenesData.length > 0
          ? { create: imagenesData.map((img: { url: string; alt?: string; orden: number }, i: number) => ({ url: img.url, alt: img.alt || null, orden: img.orden ?? i })) }
          : undefined,
      },
      include: { imagenes: true },
    });
    res.status(201).json({ noticia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear noticia" });
  }
});

noticiasRouter.put("/:id", requireAuth, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { titulo, contenido, categoria, imagenes } = req.body;

    const data: Record<string, unknown> = {};
    if (titulo) data.titulo = titulo;
    if (contenido) data.contenido = contenido;
    if (categoria) data.categoria = categoria;

    const noticia = await prisma.noticia.update({
      where: { id },
      data,
      include: { imagenes: { orderBy: { orden: "asc" } } },
    });

    if (Array.isArray(imagenes) && imagenes.length > 0) {
      const existingCount = await prisma.noticiaImagen.count({ where: { noticiaId: id } });
      for (let i = 0; i < imagenes.length; i++) {
        const img = imagenes[i];
        if (!img.url) continue;
        await prisma.noticiaImagen.create({
          data: {
            url: img.url,
            alt: img.alt || null,
            orden: existingCount + i,
            noticiaId: id,
          },
        });
      }
    }

    const updated = await prisma.noticia.findUnique({
      where: { id },
      include: { imagenes: { orderBy: { orden: "asc" } } },
    });
    res.json({ noticia: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar noticia" });
  }
});

noticiasRouter.delete("/:id", requireAuth, async (req, res) => {
  const id = req.params.id as string;
  await prisma.noticia.delete({ where: { id } });
  res.json({ success: true });
});
