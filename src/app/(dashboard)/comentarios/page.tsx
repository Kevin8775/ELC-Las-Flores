"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Check, Loader2, Mail, MailOpen, Trash2 } from "lucide-react";

type Comentario = {
  id: string;
  correo: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;
};

export default function ComentariosAdminPage() {
  const [items, setItems] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api<{ comentarios: Comentario[] }>("/comentarios")
      .then((data) => setItems(data.comentarios))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const marcarLeido = async (id: string) => {
    await api(`/comentarios/${id}/leido`, { method: "PATCH" });
    load();
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este comentario?")) return;
    await api(`/comentarios/${id}`, { method: "DELETE" });
    load();
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("es-NI", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return d; }
  };

  const noLeidos = items.filter((c) => !c.leido);
  const leidos = items.filter((c) => c.leido);

  return (
    <main>
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Comentarios</h1>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#1E3A5F]" />
        </div>
      ) : (
        <>
          <div className="elc-card mt-6 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              No leídos ({noLeidos.length})
            </h2>
            <div className="mt-4 space-y-3">
              {noLeidos.length === 0 && <p className="py-4 text-sm text-slate-500">No hay comentarios nuevos.</p>}
              {noLeidos.map((c) => (
                <Row key={c.id} item={c} formatDate={formatDate} marcarLeido={marcarLeido} eliminar={eliminar} />
              ))}
            </div>
          </div>

          <div className="elc-card mt-6 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              Leídos ({leidos.length})
            </h2>
            <div className="mt-4 space-y-3">
              {leidos.length === 0 && <p className="py-4 text-sm text-slate-500">No hay comentarios leídos.</p>}
              {leidos.map((c) => (
                <Row key={c.id} item={c} formatDate={formatDate} marcarLeido={marcarLeido} eliminar={eliminar} />
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function Row({ item, formatDate, marcarLeido, eliminar }: {
  item: Comentario;
  formatDate: (d: string) => string;
  marcarLeido: (id: string) => void;
  eliminar: (id: string) => void;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${item.leido ? "border-slate-100 bg-white" : "border-amber-100 bg-amber-50/40"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {item.leido ? <MailOpen className="h-4 w-4 text-slate-400" /> : <Mail className="h-4 w-4 text-amber-600" />}
            <span className="font-semibold text-slate-900">{item.correo}</span>
            <span className="ml-auto text-xs text-slate-400">{formatDate(item.createdAt)}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.mensaje}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {!item.leido && (
            <button
              type="button"
              onClick={() => marcarLeido(item.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 transition hover:bg-blue-200"
              title="Marcar como leído"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
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
    </div>
  );
}
