import { Router } from "express";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { config } from "../config";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos invalidos", details: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.activo) {
    return res.status(401).json({ error: "Credenciales invalidas" });
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Credenciales invalidas" });
  }

  const secret = new TextEncoder().encode(config.jwtSecret);
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    nombre: user.nombre,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  res.json({
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    },
  });
});

authRouter.get("/me", async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const secret = new TextEncoder().encode(config.jwtSecret);
  try {
    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(header.slice(7), secret);
    const data = payload as unknown as { id: string; email: string; role: string; nombre: string };

    const user = await prisma.user.findUnique({
      where: { id: data.id },
      select: { id: true, nombre: true, email: true, role: true, activo: true },
    });

    if (!user || !user.activo) {
      return res.status(401).json({ error: "Usuario no encontrado o inactivo" });
    }

    res.json({ user });
  } catch {
    return res.status(401).json({ error: "Token invalido o expirado" });
  }
});
