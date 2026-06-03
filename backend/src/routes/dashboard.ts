import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get("/summary", async (_req, res) => {
  try {
    const [estudiantesActivos, docentesActivos, gruposActivos, pagosPendientes, ingresosAgg, ultimosPagos, ultimasNoticias] = await Promise.all([
      prisma.estudiante.count({ where: { estado: "ACTIVO" } }),
      prisma.docente.count({ where: { estado: "ACTIVO" } }),
      prisma.grupo.count({ where: { estado: "ACTIVO" } }),
      prisma.pago.count({ where: { estadoPago: "PENDIENTE" } }),
      prisma.pago.aggregate({ _sum: { montoPagado: true }, where: { estadoPago: { in: ["PAGADO", "PARCIAL"] } } }),
      prisma.pago.findMany({
        include: { estudiante: { select: { nombre: true, numeroMatricula: true } } },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.noticia.findMany({
        include: { autor: { select: { nombre: true } } },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    res.json({
      stats: {
        estudiantesActivos,
        docentesActivos,
        gruposActivos,
        pagosPendientes,
        ingresosMes: Number(ingresosAgg._sum.montoPagado ?? 0),
      },
      ultimosPagos: ultimosPagos.map((pago) => ({
        id: pago.id,
        concepto: pago.concepto,
        montoPagado: Number(pago.montoPagado),
        estadoPago: pago.estadoPago,
        estudiante: pago.estudiante,
        createdAt: pago.createdAt,
      })),
      ultimasNoticias: ultimasNoticias.map((noticia) => ({
        id: noticia.id,
        titulo: noticia.titulo,
        categoria: noticia.categoria,
        autor: noticia.autor.nombre,
        createdAt: noticia.createdAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener resumen del dashboard" });
  }
});
