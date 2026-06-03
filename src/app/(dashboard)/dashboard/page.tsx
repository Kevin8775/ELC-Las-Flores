"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarClock, CreditCard, GraduationCap, MessageSquareWarning, ShieldCheck, Users2 } from "lucide-react";
import { api } from "@/lib/api";

type SummaryResponse = {
  stats: {
    estudiantesActivos: number;
    docentesActivos: number;
    gruposActivos: number;
    pagosPendientes: number;
    ingresosMes: number;
  };
  ultimosPagos: Array<{
    id: string;
    concepto: string;
    montoPagado: number;
    estadoPago: string;
    estudiante: { nombre: string; numeroMatricula: string };
    createdAt: string;
  }>;
  ultimasNoticias: Array<{
    id: string;
    titulo: string;
    categoria: string;
    autor: string;
    createdAt: string;
  }>;
};

const shortcuts = ["Registrar estudiante", "Crear pago", "Publicar noticia", "Generar reporte"];

export default function DashboardPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<{ estudiantes: Array<{ id: string }> }>("/estudiantes"),
      api<{ docentes: Array<{ id: string }> }>("/docentes"),
      api<{ grupos: Array<{ id: string }> }>("/grupos"),
      api<{ pagos: Array<{ id: string; estadoPago: string; montoPagado: string; concepto: string; createdAt: string; estudiante: { nombre: string; numeroMatricula: string } }> }>("/pagos"),
      api<{ noticias: Array<{ id: string; titulo: string; categoria: string; createdAt: string }> }>("/noticias"),
    ])
      .then(([estudiantesRes, docentesRes, gruposRes, pagosRes, noticiasRes]) => {
        const pagosPendientes = pagosRes.pagos.filter((pago) => pago.estadoPago === "PENDIENTE").length;
        const ingresosMes = pagosRes.pagos.reduce((sum, pago) => sum + Number(pago.montoPagado), 0);

        setData({
          stats: {
            estudiantesActivos: estudiantesRes.estudiantes.length,
            docentesActivos: docentesRes.docentes.length,
            gruposActivos: gruposRes.grupos.length,
            pagosPendientes,
            ingresosMes,
          },
          ultimosPagos: pagosRes.pagos.slice(0, 4),
          ultimasNoticias: noticiasRes.noticias.slice(0, 3),
        });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Estudiantes activos", value: String(data?.stats.estudiantesActivos ?? 0), icon: Users2 },
    { label: "Docentes activos", value: String(data?.stats.docentesActivos ?? 0), icon: GraduationCap },
    { label: "Ingresos del mes", value: `C$ ${(data?.stats.ingresosMes ?? 0).toLocaleString("es-NI")}`, icon: CreditCard },
    { label: "Pagos pendientes", value: String(data?.stats.pagosPendientes ?? 0), icon: MessageSquareWarning },
  ];

  return (
    <main className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Dashboard administrativo</p>
            <h1 className="mt-3 font-serif text-3xl font-black text-slate-900 md:text-5xl">Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Actualizado</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{loading ? "Cargando..." : "Ahora"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Estado</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{loading ? "..." : "Operativo"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="elc-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{item.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E3A5F]/10 text-[#1E3A5F]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="elc-card p-6 shadow-sm md:p-7">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Últimos pagos</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Actividad real</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{data?.ultimosPagos.length ?? 0} items</span>
          </div>

          <div className="mt-5 space-y-3">
            {(data?.ultimosPagos ?? []).map((pago) => (
              <div key={pago.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{pago.estudiante.nombre}</p>
                  <p className="mt-1 text-sm text-slate-500 truncate">{pago.concepto}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">C$ {pago.montoPagado.toLocaleString("es-NI")}</p>
                  <p className="text-xs text-slate-500">{pago.estadoPago}</p>
                </div>
              </div>
            ))}
            {!loading && (data?.ultimosPagos.length ?? 0) === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">Sin pagos recientes</div>
            )}
          </div>
        </article>

        <article className="elc-card p-6 shadow-sm md:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Accesos rápidos</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {shortcuts.map((item) => (
              <button key={item} className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#2E5587] hover:shadow-sm">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Acción</span>
                <span className="text-sm font-semibold text-slate-800">{item}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#1E3A5F]" />
              <p className="font-semibold text-slate-900">Sistema protegido</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Noticias recientes</p>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-3">
              {(data?.ultimasNoticias ?? []).map((noticia) => (
                <div key={noticia.id} className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{noticia.categoria}</p>
                  <p className="mt-2 font-semibold text-slate-900">{noticia.titulo}</p>
                </div>
              ))}
              {!loading && (data?.ultimasNoticias.length ?? 0) === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">Sin noticias recientes</div>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="elc-card grid gap-6 p-6 shadow-sm lg:grid-cols-2 md:p-7">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Próximo calendario</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Resumen operativo</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <CalendarClock className="h-5 w-5 text-[#1E3A5F]" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Clases sabatinas</p>
            <p className="text-sm text-slate-500">Programación activa</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <CreditCard className="h-5 w-5 text-[#1E3A5F]" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Pagos del mes</p>
            <p className="text-sm text-slate-500">Seguimiento y control</p>
          </div>
        </div>
      </section>
    </main>
  );
}
