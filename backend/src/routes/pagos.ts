import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

export const pagosRouter = Router();

pagosRouter.use(requireAuth);

const createPagoSchema = z.object({
  estudianteId: z.string().min(1),
  tipoPago: z.enum(["MENSUAL", "SEMANAL"]),
  concepto: z.string().min(1),
  mes: z.number().int().min(1).max(12).optional().nullable(),
  anio: z.number().int().optional().nullable(),
  numeroSemana: z.number().int().optional().nullable(),
  fechaInicio: z.string().optional().nullable(),
  fechaFin: z.string().optional().nullable(),
  monto: z.number().positive(),
  montoPagado: z.number().min(0),
  saldo: z.number().min(0),
  estadoPago: z.enum(["PAGADO", "PENDIENTE", "PARCIAL", "VENCIDO"]),
  metodoPago: z.enum(["EFECTIVO", "TRANSFERENCIA", "OTRO"]),
  fechaPago: z.string().optional().nullable(),
  fechaVencimiento: z.string().min(1),
  observaciones: z.string().optional().nullable(),
});

const WEEKLY_AMOUNT = 125;

function getSaturdaysInMonth(mes: number, anio: number): number {
  const start = new Date(anio, mes - 1, 1);
  const end = new Date(anio, mes, 0, 23, 59, 59);
  let count = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 6) count += 1;
  }
  return count;
}

async function generarRecibo(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `REC-${year}-${month}-`;
  const last = await prisma.pago.findFirst({
    where: { recibo: { startsWith: prefix } },
    orderBy: { recibo: "desc" },
    select: { recibo: true },
  });
  const seq = last ? String(Number(last.recibo.split("-").pop()) + 1).padStart(4, "0") : "0001";
  return `${prefix}${seq}`;
}

pagosRouter.get("/verificar", async (req, res) => {
  try {
    const { estudianteId, mes, anio, tipoPago } = req.query;

    if (!estudianteId || !mes || !anio) {
      return res.status(400).json({ error: "Faltan parametros: estudianteId, mes, anio" });
    }

    const mesNum = parseInt(mes as string);
    const anioNum = parseInt(anio as string);

    const pagosExistentes = await prisma.pago.findMany({
      where: {
        estudianteId: estudianteId as string,
        mes: mesNum,
        anio: anioNum,
      },
      orderBy: { createdAt: "asc" },
    });

    const pagosMensuales = pagosExistentes.filter((p) => p.tipoPago === "MENSUAL" && p.estadoPago !== "PENDIENTE");
    const pagosSemanales = pagosExistentes.filter((p) => p.tipoPago === "SEMANAL" && p.estadoPago !== "PENDIENTE");

    const totalPagadoSemanal = pagosSemanales.reduce((sum, p) => sum + Number(p.montoPagado), 0);
    const tieneMensual = pagosMensuales.length > 0;
    const tieneSemanal = pagosSemanales.length > 0;

    const result: Record<string, unknown> = {
      pagosExistentes,
      totalPagadoSemanal,
      tieneMensual,
      tieneSemanal,
      montoSugerido: null,
      advertencia: null,
    };

    if (tipoPago === "MENSUAL" && tieneSemanal) {
      result.montoSugerido = totalPagadoSemanal;
      result.advertencia = `El estudiante ya tiene C$${totalPagadoSemanal.toFixed(2)} pagado en ${pagosSemanales.length} pago(s) semanal(es) este mes. Al crear la mensualidad, ese monto se aplicará como abono.`;
    }

    if (tipoPago === "SEMANAL" && tieneMensual) {
      result.advertencia = "El estudiante ya tiene un pago mensual registrado este mes. No es necesario registrar pagos semanales adicionales.";
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al verificar pagos" });
  }
});

pagosRouter.get("/", async (_req, res) => {
  try {
    const pagos = await prisma.pago.findMany({
      include: { estudiante: true, registradoPor: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ pagos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener pagos" });
  }
});

pagosRouter.get("/:id", async (req, res) => {
  try {
    const pago = await prisma.pago.findUnique({
      where: { id: req.params.id },
      include: { estudiante: true, registradoPor: true },
    });
    if (!pago) return res.status(404).json({ error: "Pago no encontrado" });
    res.json({ pago });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener pago" });
  }
});

pagosRouter.post("/", async (req, res) => {
  try {
    const parsed = createPagoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Datos invalidos", details: parsed.error.flatten() });
    }

    const data = parsed.data;
    const tipoPagoEfectivo = data.estadoPago === "PARCIAL" ? "SEMANAL" : data.tipoPago;

    if (data.mes && data.anio) {
      const pagosExistentes = await prisma.pago.findMany({
        where: {
          estudianteId: data.estudianteId,
          mes: data.mes,
          anio: data.anio,
          estadoPago: { not: "PENDIENTE" },
        },
      });

      if (tipoPagoEfectivo === "MENSUAL") {
        const saturdayCount = getSaturdaysInMonth(data.mes, data.anio);
        const montoMensual = saturdayCount * WEEKLY_AMOUNT;
        const pagosSemanales = pagosExistentes.filter((p) => p.tipoPago === "SEMANAL");
        if (pagosSemanales.length > 0) {
          data.monto = montoMensual;
          data.montoPagado = montoMensual;
          data.saldo = 0;
          if (data.saldo === 0) {
            data.estadoPago = "PAGADO";
          }
          data.concepto = `Mensualidad ${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][data.mes - 1]} ${data.anio}`;
        } else {
          data.monto = montoMensual;
          data.montoPagado = montoMensual;
          data.saldo = 0;
          data.estadoPago = "PAGADO";
          data.concepto = `Mensualidad ${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][data.mes - 1]} ${data.anio}`;
        }
      }

      if (tipoPagoEfectivo === "SEMANAL") {
        const tieneMensual = pagosExistentes.some((p) => p.tipoPago === "MENSUAL");
        if (tieneMensual) {
          return res.status(400).json({
            error: "El estudiante ya tiene un pago mensual registrado este mes. No puede registrar pagos semanales adicionales.",
          });
        }
        data.tipoPago = "SEMANAL";
        data.monto = WEEKLY_AMOUNT;
        data.montoPagado = WEEKLY_AMOUNT;
        data.saldo = 0;
      }
    }

    const recibo = await generarRecibo();

    const pago = await prisma.pago.create({
      data: {
        estudianteId: data.estudianteId,
        tipoPago: data.tipoPago,
        concepto: data.concepto,
        mes: data.mes ?? null,
        anio: data.anio ?? null,
        numeroSemana: data.numeroSemana ?? null,
        fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : null,
        fechaFin: data.fechaFin ? new Date(data.fechaFin) : null,
        monto: data.monto,
        montoPagado: data.montoPagado,
        saldo: data.saldo,
        estadoPago: data.estadoPago,
        metodoPago: data.metodoPago,
        fechaPago: data.fechaPago ? new Date(data.fechaPago) : null,
        fechaVencimiento: new Date(data.fechaVencimiento),
        observaciones: data.observaciones ?? null,
        recibo,
        registradoPorId: req.user!.id,
      },
    });

    res.status(201).json({ pago });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear pago" });
  }
});

const batchPagoSchema = z.object({
  pagos: z.array(createPagoSchema).min(1).max(20),
});

pagosRouter.post("/batch", async (req, res) => {
  try {
    const parsed = batchPagoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Datos invalidos", details: parsed.error.flatten() });
    }

    const results = [];
    for (const data of parsed.data.pagos) {
      const recibo = await generarRecibo();
      const pago = await prisma.pago.create({
        data: {
          estudianteId: data.estudianteId,
          tipoPago: data.tipoPago,
          concepto: data.concepto,
          mes: data.mes ?? null,
          anio: data.anio ?? null,
          numeroSemana: data.numeroSemana ?? null,
          fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : null,
          fechaFin: data.fechaFin ? new Date(data.fechaFin) : null,
          monto: WEEKLY_AMOUNT,
          montoPagado: WEEKLY_AMOUNT,
          saldo: 0,
          estadoPago: data.estadoPago,
          metodoPago: data.metodoPago,
          fechaPago: data.fechaPago ? new Date(data.fechaPago) : null,
          fechaVencimiento: new Date(data.fechaVencimiento),
          observaciones: data.observaciones ?? null,
          recibo,
          registradoPorId: req.user!.id,
        },
      });
      results.push(pago);
    }

    res.status(201).json({ pagos: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear pagos en lote" });
  }
});

pagosRouter.put("/:id", async (req, res) => {
  try {
    const existing = await prisma.pago.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Pago no encontrado" });

    const parsed = createPagoSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Datos invalidos", details: parsed.error.flatten() });
    }

    const data = parsed.data;
    const pago = await prisma.pago.update({
      where: { id: req.params.id },
      data: {
        ...(data.estudianteId !== undefined && { estudianteId: data.estudianteId }),
        ...(data.tipoPago !== undefined && { tipoPago: data.tipoPago }),
        ...(data.concepto !== undefined && { concepto: data.concepto }),
        ...(data.mes !== undefined && { mes: data.mes }),
        ...(data.anio !== undefined && { anio: data.anio }),
        ...(data.numeroSemana !== undefined && { numeroSemana: data.numeroSemana }),
        ...(data.fechaInicio !== undefined && { fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : null }),
        ...(data.fechaFin !== undefined && { fechaFin: data.fechaFin ? new Date(data.fechaFin) : null }),
        ...(data.monto !== undefined && { monto: data.monto }),
        ...(data.montoPagado !== undefined && { montoPagado: data.montoPagado }),
        ...(data.saldo !== undefined && { saldo: data.saldo }),
        ...(data.estadoPago !== undefined && { estadoPago: data.estadoPago }),
        ...(data.metodoPago !== undefined && { metodoPago: data.metodoPago }),
        ...(data.fechaPago !== undefined && { fechaPago: data.fechaPago ? new Date(data.fechaPago) : null }),
        ...(data.fechaVencimiento !== undefined && { fechaVencimiento: new Date(data.fechaVencimiento) }),
        ...(data.observaciones !== undefined && { observaciones: data.observaciones ?? null }),
      },
    });

    res.json({ pago });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar pago" });
  }
});

pagosRouter.delete("/:id", async (req, res) => {
  try {
    const existing = await prisma.pago.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Pago no encontrado" });

    await prisma.pago.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar pago" });
  }
});
