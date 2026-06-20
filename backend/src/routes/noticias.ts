import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { upload, uploadToImageKit } from "../lib/upload";

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

noticiasRouter.post("/", requireAuth, upload.array("imagenes", 10), async (req, res) => {
  const admin = await prisma.admin.findUnique({ where: { userId: req.user!.id } });
  if (!admin) return res.status(403).json({ error: "Solo los administradores pueden crear noticias" });

  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const imagenesUrls: { url: string; alt?: string; orden: number }[] = [];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToImageKit(files[i], "elc/noticias");
        imagenesUrls.push({ url, alt: req.body[`alt_${i}`] || null, orden: i });
      }
    }

    const noticia = await prisma.noticia.create({
      data: {
        titulo: req.body.titulo,
        contenido: req.body.contenido,
        categoria: req.body.categoria ?? "NOTICIA",
        fechaPublicacion: new Date(),
        autorId: admin.id,
        imagenes: imagenesUrls.length > 0 ? { create: imagenesUrls } : undefined,
      },
      include: { imagenes: true },
    });
    res.status(201).json({ noticia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear noticia" });
  }
});

noticiasRouter.put("/:id", requireAuth, upload.array("imagenes", 10), async (req, res) => {
  try {
    const id = req.params.id as string;
    const { titulo, contenido, categoria } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    const data: Record<string, unknown> = {};
    if (titulo) data.titulo = titulo;
    if (contenido) data.contenido = contenido;
    if (categoria) data.categoria = categoria;

    if (files && files.length > 0) {
      const existingCount = await prisma.noticiaImagen.count({ where: { noticiaId: id } });
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToImageKit(files[i], "elc/noticias");
        await prisma.noticiaImagen.create({
          data: {
            url,
            alt: req.body[`alt_${i}`] || null,
            orden: existingCount + i,
            noticiaId: id,
          },
        });
      }
    }

    const noticia = await prisma.noticia.update({
      where: { id },
      data,
      include: { imagenes: { orderBy: { orden: "asc" } } },
    });
    res.json({ noticia });
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
