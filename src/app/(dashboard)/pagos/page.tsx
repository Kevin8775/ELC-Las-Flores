"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getSaturdaysInRange, MESES } from "@/lib/saturdays";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Estudiante {
  id: string;
  nombre: string;
  numeroMatricula: string;
}

interface Pago {
  id: string;
  recibo: string;
  estudianteId: string;
  estudiante: { id: string; nombre: string; numeroMatricula: string };
  tipoPago: string;
  concepto: string;
  mes: number | null;
  anio: number | null;
  monto: string;
  montoPagado: string;
  saldo: string;
  estadoPago: string;
  metodoPago: string;
  fechaInicio?: string | null;
  fechaPago: string | null;
  fechaVencimiento: string;
  observaciones: string | null;
  registradoPor: { nombre: string } | null;
  createdAt: string;
}

interface VerificacionPago {
  pagosExistentes: Pago[];
  totalPagadoSemanal: number;
  tieneMensual: boolean;
  tieneSemanal: boolean;
  montoSugerido: number | null;
  advertencia: string | null;
}

const defaultForm = {
  estudianteId: "",
  tipoPago: "MENSUAL",
  concepto: "",
  mes: new Date().getMonth() + 1,
  anio: new Date().getFullYear(),
  monto: "",
  montoPagado: "",
  saldo: "0",
  estadoPago: "PENDIENTE",
  metodoPago: "EFECTIVO",
  fechaPago: new Date().toISOString().slice(0, 10),
  fechaVencimiento: "",
  observaciones: "",
};

const WEEKLY_AMOUNT = 125;

type FormData = typeof defaultForm;

function getSaturdaysOfMonth(mes: number, anio: number): Date[] {
  const start = new Date(anio, mes - 1, 1);
  const end = new Date(anio, mes, 0, 23, 59, 59);
  return getSaturdaysInRange(start, end);
}

function formatDateShort(d: Date): string {
  const dias = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vier", "Sab"];
  return `${dias[d.getDay()]} ${d.getDate()}`;
}

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [verificacion, setVerificacion] = useState<VerificacionPago | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [busquedaEstudiante, setBusquedaEstudiante] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSaturdays, setSelectedSaturdays] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const estudiantesFiltrados = estudiantes.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busquedaEstudiante.toLowerCase()) ||
      e.numeroMatricula.toLowerCase().includes(busquedaEstudiante.toLowerCase())
  );

  const pagosSemanalesDelMes = verificacion?.pagosExistentes.filter((p) => p.tipoPago === "SEMANAL" && p.estadoPago !== "PENDIENTE") ?? [];

  function getPaidSaturdayKey(pago: Pago): string | null {
    if (pago.fechaInicio) return new Date(pago.fechaInicio).toISOString().slice(0, 10);
    const match = pago.concepto.match(/Sabado\s+(\d+)\s+de\s+.+\s+(\d{4})/i);
    if (!match || !form.mes) return null;
    const day = Number(match[1]);
    const monthIndex = form.mes - 1;
    return new Date(Number(match[2]), monthIndex, day).toISOString().slice(0, 10);
  }

  const paidSaturdayKeys = new Set(
    pagosSemanalesDelMes
      .map(getPaidSaturdayKey)
      .filter((value): value is string => Boolean(value))
  );

  const saturdays = form.mes && form.anio ? getSaturdaysOfMonth(form.mes, form.anio) : [];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.tipoPago === "MENSUAL" && form.mes && form.anio) {
        const total = saturdays.length * WEEKLY_AMOUNT;
        setForm((prev) => ({
          ...prev,
          monto: String(total),
          montoPagado: String(total),
          saldo: "0",
          estadoPago: "PAGADO",
        }));
      }

      if (form.tipoPago === "SEMANAL") {
        setForm((prev) => ({
          ...prev,
          monto: String(WEEKLY_AMOUNT),
          montoPagado: String(WEEKLY_AMOUNT),
          saldo: "0",
        }));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [form.tipoPago, form.mes, form.anio, saturdays.length]);

  useEffect(() => {
    Promise.all([
      api<{ pagos: Pago[] }>("/pagos"),
      api<{ estudiantes: Estudiante[] }>("/estudiantes"),
    ])
      .then(([pagosData, estudiantesData]) => {
        setPagos(pagosData.pagos);
        setEstudiantes(estudiantesData.estudiantes);
      })
      .catch(() => toast.error("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!form.estudianteId || !form.mes || !form.anio || editingId) {
        setVerificacion(null);
        return;
      }
      let cancelled = false;
      setVerificando(true);
      api<VerificacionPago>(
        `/pagos/verificar?estudianteId=${form.estudianteId}&mes=${form.mes}&anio=${form.anio}&tipoPago=${form.tipoPago}`
      ).then((data) => {
        if (!cancelled) {
          setVerificacion(data);
          if (form.tipoPago === "MENSUAL" && data.montoSugerido && data.montoSugerido > 0) {
            setForm((prev) => ({ ...prev, montoPagado: String(data.montoSugerido) }));
          }
        }
      }).catch(() => {
        if (!cancelled) setVerificacion(null);
      }).finally(() => {
        if (!cancelled) setVerificando(false);
      });
      return () => { cancelled = true; };
    }, 0);

    return () => clearTimeout(timer);
  }, [form.estudianteId, form.mes, form.anio, form.tipoPago, editingId]);

  const montoPorSabado = parseFloat(form.monto) || 0;
  const satsSeleccionados = selectedSaturdays.size;
  const totalCalculado = satsSeleccionados * montoPorSabado;

  function toggleSaturday(sabadoIndex: number) {
    setSelectedSaturdays((prev) => {
      const next = new Set(prev);
      if (next.has(sabadoIndex)) {
        next.delete(sabadoIndex);
      } else {
        next.add(sabadoIndex);
      }
      return next;
    });
  }

  function resetForm() {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
    setVerificacion(null);
    setBusquedaEstudiante("");
    setSelectedSaturdays(new Set());
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (form.tipoPago === "SEMANAL" && saturdays.length > 0) {
        if (selectedSaturdays.size === 0) {
          toast.warning("Selecciona al menos un sábado para registrar el pago.");
          setSubmitting(false);
          return;
        }

        const montoIndividual = WEEKLY_AMOUNT;

        const pagosData = Array.from(selectedSaturdays).map((sabadoIndex) => {
          const saturday = saturdays[sabadoIndex];
          const dayNum = saturday.getDate();
          return {
            estudianteId: form.estudianteId,
            tipoPago: "SEMANAL" as const,
            concepto: `Sabado ${dayNum} de ${MESES[form.mes - 1]} ${form.anio}`,
            mes: form.mes,
            anio: form.anio,
            monto: montoIndividual,
            montoPagado: montoIndividual,
            saldo: 0,
            estadoPago: form.estadoPago,
            metodoPago: form.metodoPago,
            fechaPago: form.fechaPago || null,
            fechaVencimiento: form.fechaVencimiento,
            observaciones: form.observaciones || null,
            numeroSemana: null,
            fechaInicio: saturday.toISOString().slice(0, 10),
            fechaFin: saturday.toISOString().slice(0, 10),
          };
        });

        if (editingId) {
          toast.warning("No se puede editar un pago semanal multiple. Use la opcion de pago unico.");
          setSubmitting(false);
          return;
        }

        const data = await api<{ pagos: Pago[] }>("/pagos/batch", {
          method: "POST",
          body: JSON.stringify({ pagos: pagosData }),
        });
        setPagos((prev) => [...data.pagos, ...prev]);
        resetForm();
        toast.success(editingId ? "Pago actualizado" : "Pagos registrados");
      } else {
        const monto = form.tipoPago === "MENSUAL" ? saturdays.length * WEEKLY_AMOUNT : WEEKLY_AMOUNT;
        const montoPagado = form.tipoPago === "MENSUAL" ? saturdays.length * WEEKLY_AMOUNT : WEEKLY_AMOUNT;
        const saldo = monto - montoPagado;

        const body = {
          estudianteId: form.estudianteId,
          tipoPago: form.tipoPago,
          concepto: form.concepto,
          mes: form.mes,
          anio: form.anio,
          monto,
          montoPagado,
          saldo: saldo >= 0 ? saldo : 0,
          estadoPago: form.estadoPago,
          metodoPago: form.metodoPago,
          fechaPago: form.fechaPago || null,
          fechaVencimiento: form.fechaVencimiento,
          observaciones: form.observaciones || null,
        };

        if (editingId) {
          const data = await api<{ pago: Pago }>(`/pagos/${editingId}`, {
            method: "PUT",
            body: JSON.stringify(body),
          });
          setPagos((prev) => prev.map((p) => (p.id === editingId ? data.pago : p)));
        } else {
          const data = await api<{ pago: Pago }>("/pagos", {
            method: "POST",
            body: JSON.stringify(body),
          });
          setPagos((prev) => [data.pago, ...prev]);
        }
        resetForm();
        toast.success(editingId ? "Pago actualizado" : "Pago registrado");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar pago");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(p: Pago) {
    setForm({
      estudianteId: p.estudianteId,
      tipoPago: p.tipoPago,
      concepto: p.concepto,
      mes: p.mes ?? new Date().getMonth() + 1,
      anio: p.anio ?? new Date().getFullYear(),
      monto: p.monto,
      montoPagado: p.montoPagado,
      saldo: p.saldo,
      estadoPago: p.estadoPago as FormData["estadoPago"],
      metodoPago: p.metodoPago as FormData["metodoPago"],
      fechaPago: p.fechaPago ? p.fechaPago.slice(0, 10) : "",
      fechaVencimiento: p.fechaVencimiento.slice(0, 10),
      observaciones: p.observaciones ?? "",
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar este pago?")) return;
    try {
      await api(`/pagos/${id}`, { method: "DELETE" });
      setPagos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Pago eliminado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar pago");
    }
  }

  const estadoColors: Record<string, string> = {
    PAGADO: "bg-green-100 text-green-800",
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    PARCIAL: "bg-blue-100 text-blue-800",
    VENCIDO: "bg-red-100 text-red-800",
  };

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Gestion de pagos</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm); setVerificacion(null); setBusquedaEstudiante(""); setSelectedSaturdays(new Set()); }}
          className="rounded-md bg-[#F4C430] px-4 py-2 text-sm font-semibold text-[#1E3A5F]"
        >
          Registrar pago
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={resetForm}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#1E3A5F]">
                {editingId ? "Editar pago" : "Registrar pago"}
              </h2>
              <button onClick={resetForm} className="rounded-md bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">&times;</button>
            </div>

            {verificacion?.advertencia && !editingId && (
              <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                {verificacion.advertencia}
                {verificacion.pagosExistentes.length > 0 && (
                  <ul className="mt-2 list-disc pl-4">
                    {verificacion.pagosExistentes.filter((p) => p.estadoPago !== "PENDIENTE").map((p) => (
                      <li key={p.id}>{p.concepto} — C${p.montoPagado} ({p.tipoPago === "MENSUAL" ? "Mensual" : "Semanal"})</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {verificando && (
              <div className="mb-4 text-sm text-slate-500">Verificando pagos existentes...</div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <Label label="Estudiante">
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={busquedaEstudiante}
                    onChange={(e) => {
                      setBusquedaEstudiante(e.target.value);
                      setShowDropdown(true);
                      if (form.estudianteId) setForm({ ...form, estudianteId: "" });
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="w-full rounded border p-2 text-sm"
                    placeholder="Buscar por nombre o matricula..."
                    required={!form.estudianteId}
                  />
                  {form.estudianteId && !busquedaEstudiante && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-green-700">
                      {estudiantes.find((e) => e.id === form.estudianteId)?.nombre}
                    </span>
                  )}
                  {showDropdown && busquedaEstudiante && (
                    <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border bg-white shadow-lg">
                      {estudiantesFiltrados.length === 0 ? (
                        <div className="p-2 text-sm text-slate-400">Sin resultados</div>
                      ) : (
                        estudiantesFiltrados.map((e) => (
                          <button
                            key={e.id}
                            type="button"
                            onMouseDown={() => {
                              setForm({ ...form, estudianteId: e.id });
                              setBusquedaEstudiante(`${e.nombre} (${e.numeroMatricula})`);
                              setShowDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 ${form.estudianteId === e.id ? "bg-slate-100 font-semibold" : ""}`}
                          >
                            {e.nombre} <span className="font-mono text-xs text-slate-400">{e.numeroMatricula}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </Label>

              <Label label="Tipo de pago">
                <select
                  value={form.tipoPago}
                  onChange={(e) => {
                    setForm({ ...form, tipoPago: e.target.value });
                    setSelectedSaturdays(new Set());
                  }}
                  className="mt-1 w-full rounded border p-2 text-sm"
                >
                  <option value="MENSUAL">Mensual</option>
                  <option value="SEMANAL">Semanal</option>
                </select>
              </Label>

              <Label label="Concepto">
                <input
                  value={form.concepto}
                  onChange={(e) => setForm({ ...form, concepto: e.target.value })}
                  className="mt-1 w-full rounded border p-2 text-sm"
                  placeholder="Ej: Mensualidad Mayo 2026"
                  required
                />
              </Label>

              <Label label="Mes">
                <select
                  value={form.mes}
                  onChange={(e) => {
                    setForm({ ...form, mes: parseInt(e.target.value) });
                    setSelectedSaturdays(new Set());
                  }}
                  className="mt-1 w-full rounded border p-2 text-sm"
                >
                  {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                  ].map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </Label>

              <Label label="Año">
                <input
                  type="number"
                  value={form.anio}
                  onChange={(e) => {
                    setForm({ ...form, anio: parseInt(e.target.value) });
                    setSelectedSaturdays(new Set());
                  }}
                  className="mt-1 w-full rounded border p-2 text-sm"
                  min={2020}
                  max={2030}
                  required
                />
              </Label>

              {form.tipoPago === "SEMANAL" && saturdays.length > 0 && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Selecciona los sábados a pagar ({MESES[form.mes - 1]} {form.anio})
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {saturdays.map((sat, i) => {
                      const saturdayKey = sat.toISOString().slice(0, 10);
                      const yaPagado = paidSaturdayKeys.has(saturdayKey);
                      return (
                        <label
                          key={i}
                          className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm ${
                            selectedSaturdays.has(i)
                              ? "border-green-500 bg-green-50"
                              : yaPagado
                                ? "border-slate-200 bg-slate-100 text-slate-400"
                                : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSaturdays.has(i)}
                            disabled={!!yaPagado}
                            onChange={() => toggleSaturday(i)}
                            className="accent-green-700"
                          />
                          {formatDateShort(sat)}
                          {yaPagado && <span className="ml-auto text-xs text-green-600">Pagado</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <Label label={form.tipoPago === "SEMANAL" ? "Monto por sábado (C$)" : "Monto total (C$)"}>
                <input
                  type="number"
                  step="0.01"
                  value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                  className="mt-1 w-full rounded border p-2 text-sm"
                  placeholder="0.00"
                  required
                  readOnly={form.tipoPago === "MENSUAL"}
                />
              </Label>

              <Label label={form.tipoPago === "SEMANAL" ? "Total a pagar (C$)" : "Monto pagado (C$)"}>
                <input
                  type="number"
                  step="0.01"
                  value={form.tipoPago === "SEMANAL" ? (totalCalculado || "").toString() : form.montoPagado}
                  onChange={(e) => {
                    if (form.tipoPago !== "SEMANAL") setForm({ ...form, montoPagado: e.target.value });
                  }}
                  className={`mt-1 w-full rounded border p-2 text-sm ${form.tipoPago === "SEMANAL" ? "bg-slate-50 text-slate-500" : ""}`}
                  placeholder="0.00"
                  readOnly={form.tipoPago === "SEMANAL"}
                  required
                />
              </Label>

              <Label label="Saldo (C$)">
                <input
                  type="number"
                  step="0.01"
                  value={form.tipoPago === "SEMANAL" ? "0.00" : (form.montoPagado && form.monto ? Math.max(0, parseFloat(form.monto) - parseFloat(form.montoPagado)).toFixed(2) : "0.00")}
                  className="mt-1 w-full rounded border bg-slate-50 p-2 text-sm text-slate-500"
                  readOnly
                />
              </Label>

              <Label label="Estado">
                <select
                  value={form.estadoPago}
                  onChange={(e) => setForm({ ...form, estadoPago: e.target.value as FormData["estadoPago"] })}
                  className="mt-1 w-full rounded border p-2 text-sm"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="PAGADO">Pagado</option>
                  <option value="PARCIAL">Parcial</option>
                  <option value="VENCIDO">Vencido</option>
                </select>
              </Label>

              <Label label="Metodo de pago">
                <select
                  value={form.metodoPago}
                  onChange={(e) => setForm({ ...form, metodoPago: e.target.value as FormData["metodoPago"] })}
                  className="mt-1 w-full rounded border p-2 text-sm"
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="OTRO">Otro</option>
                </select>
              </Label>

              <Label label="Fecha de pago">
                <input
                  type="date"
                  value={form.fechaPago}
                  onChange={(e) => setForm({ ...form, fechaPago: e.target.value })}
                  className="mt-1 w-full rounded border p-2 text-sm"
                />
              </Label>

              <Label label="Fecha de vencimiento">
                <input
                  type="date"
                  value={form.fechaVencimiento}
                  onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })}
                  className="mt-1 w-full rounded border p-2 text-sm"
                  required
                />
              </Label>

              <Label label="Observaciones" className="sm:col-span-2">
                <textarea
                  value={form.observaciones}
                  onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                  className="mt-1 w-full rounded border p-2 text-sm"
                  rows={2}
                />
              </Label>

              <div className="flex gap-2 sm:col-span-2 sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md bg-slate-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : editingId ? "Actualizar pago" : "Guardar pago"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#1E3A5F]" />
        </div>
      ) : (
      <div className="elc-card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Recibo</th>
              <th className="p-3">Estudiante</th>
              <th className="p-3">Concepto</th>
              <th className="p-3">Monto</th>
              <th className="p-3">Pagado</th>
              <th className="p-3">Saldo</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Metodo</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id} className="border-t border-slate-200">
                <td className="p-3 font-mono text-xs">{p.recibo}</td>
                <td className="p-3">{p.estudiante?.nombre ?? "—"}</td>
                <td className="p-3">{p.concepto}</td>
                <td className="p-3">C${p.monto}</td>
                <td className="p-3">C${p.montoPagado}</td>
                <td className="p-3">C${p.saldo}</td>
                <td className="p-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${estadoColors[p.estadoPago] ?? "bg-slate-100 text-slate-800"}`}>
                    {p.estadoPago}
                  </span>
                </td>
                <td className="p-3 text-xs">{p.metodoPago}</td>
                <td className="p-3 text-xs">{p.fechaPago ? new Date(p.fechaPago).toLocaleDateString("es-ES") : "—"}</td>
                <td className="flex gap-2 p-3">
                  <button onClick={() => handleEdit(p)} className="text-sm text-blue-700 underline">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="text-sm text-red-700 underline">Eliminar</button>
                </td>
              </tr>
            ))}
            {pagos.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-slate-400">No hay pagos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </main>
  );
}

function Label({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      {label}
      {children}
    </label>
  );
}
