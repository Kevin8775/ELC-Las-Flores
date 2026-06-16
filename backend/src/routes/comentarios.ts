import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { sendNewCommentNotification } from "../lib/email";

export const comentariosRouter = Router();

comentariosRouter.post("/", async (req, res) => {
  const { correo, mensaje } = req.body;

  if (!correo?.trim() || !mensaje?.trim()) {
    return res.status(400).json({ error: "Correo y mensaje son requeridos" });
  }

  const comentario = await prisma.comentario.create({
    data: { correo: correo.trim(), mensaje: mensaje.trim() },
  });

  sendNewCommentNotification(correo).catch(() => {});

  res.status(201).json({ comentario });
});

comentariosRouter.get("/", requireAuth, async (_req, res) => {
  const comentarios = await prisma.comentario.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ comentarios });
});

comentariosRouter.patch("/:id/leido", requireAuth, async (req, res) => {
  const comentario = await prisma.comentario.update({
    where: { id: req.params.id as string },
    data: { leido: true },
  });
  res.json({ comentario });
});

comentariosRouter.delete("/:id", requireAuth, async (req, res) => {
  await prisma.comentario.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
});
