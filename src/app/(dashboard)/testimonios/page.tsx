"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Check, Loader2, Trash2, X } from "lucide-react";

type Testimonio = {
  id: string;
  nombre: string;
  texto: string;
  rol: string | null;
  aprobado: boolean;
  createdAt: string;
};

export default function TestimoniosAdminPage() {
  const [items, setItems] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api<{ testimonios: Testimonio[] }>("/testimonios/todos")
      .then((data) => setItems(data.testimonios))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleAprobar = async (id: string, aprobado: boolean) => {
    await api(`/testimonios/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ aprobado: !aprobado }),
    });
    load();
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este testimonio?")) return;
    await api(`/testimonios/${id}`, { method: "DELETE" });
    load();
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("es-NI", { year: "numeric", month: "short", day: "numeric" });
    } catch { return d; }
  };

  const pendientes = items.filter((t) => !t.aprobado);
  const publicados = items.filter((t) => t.aprobado);

  return (
    <main>
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Testimonios</h1>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#1E3A5F]" />
        </div>
      ) : (
        <>
          <Section title={`Pendientes (${pendientes.length})`} color="yellow">
            {pendientes.length === 0 && <p className="py-4 text-sm text-slate-500">No hay testimonios pendientes.</p>}
            {pendientes.map((t) => (
              <Row key={t.id} item={t} formatDate={formatDate} toggleAprobar={toggleAprobar} eliminar={eliminar} />
            ))}
          </Section>

          <div className="mt-8">
            <Section title={`Publicados (${publicados.length})`} color="green">
              {publicados.length === 0 && <p className="py-4 text-sm text-slate-500">No hay testimonios publicados.</p>}
              {publicados.map((t) => (
                <Row key={t.id} item={t} formatDate={formatDate} toggleAprobar={toggleAprobar} eliminar={eliminar} />
              ))}
            </Section>
          </div>
        </>
      )}
    </main>
  );
}

function Section({ title, color, children }: { title: string; color: "yellow" | "green"; children: React.ReactNode }) {
  const dot = color === "yellow" ? "bg-yellow-400" : "bg-green-400";
  return (
    <div className="elc-card mt-6 p-5">
      <h2 className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em]`}>
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        {title}
      </h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Row({ item, formatDate, toggleAprobar, eliminar }: {
  item: Testimonio;
  formatDate: (d: string) => string;
  toggleAprobar: (id: string, aprobado: boolean) => void;
  eliminar: (id: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1E3A5F]">{item.nombre}</span>
          {item.rol && <span className="text-xs text-slate-400">({item.rol})</span>}
          <span className="ml-auto text-xs text-slate-400">{formatDate(item.createdAt)}</span>
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">{item.texto}</p>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => toggleAprobar(item.id, item.aprobado)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${item.aprobado ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
          title={item.aprobado ? "Despublicar" : "Aprobar"}
        >
          {item.aprobado ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => eliminar(item.id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700 transition hover:bg-red-200"
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
