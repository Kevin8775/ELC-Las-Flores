import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const configuracionRouter = Router();

configuracionRouter.get("/", async (_req, res) => {
  const config = await prisma.configuracionGeneral.findFirst();
  res.json({ config });
});

configuracionRouter.put("/", requireAuth, async (req, res) => {
  const existing = await prisma.configuracionGeneral.findFirst();
  if (!existing) {
    const config = await prisma.configuracionGeneral.create({ data: req.body });
    return res.json({ config });
  }
  const config = await prisma.configuracionGeneral.update({
    where: { id: existing.id },
    data: req.body,
  });
  res.json({ config });
});
