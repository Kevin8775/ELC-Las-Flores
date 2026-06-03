import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import { config } from "../config";

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
  nombre: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = header.slice(7);
  const secret = new TextEncoder().encode(config.jwtSecret);

  try {
    const { payload } = await jwtVerify(token, secret);
    req.user = payload as unknown as AuthPayload;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalido o expirado" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No tienes permiso para esta accion" });
    }
    next();
  };
}
