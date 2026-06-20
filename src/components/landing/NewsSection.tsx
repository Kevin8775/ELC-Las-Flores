"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Send } from "lucide-react";

type NoticiaImagen = {
  id: string;
  url: string;
  alt: string | null;
};

type Noticia = {
  id: string;
  titulo: string;
  categoria: string;
  createdAt: string;
  imagenes: NoticiaImagen[];
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  Noticia: { bg: "bg-primary/10", text: "text-primary" },
  Evento: { bg: "bg-green-50", text: "text-green-700" },
  Comunicado: { bg: "bg-accent/15", text: "text-amber-700" },
  Logro: { bg: "bg-purple-50", text: "text-purple-700" },
};

export function NewsSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ noticias: Noticia[] }>("/noticias")
      .then((data) => setNoticias(data.noticias))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("es-NI", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo.trim() || !mensaje.trim()) return;
    setSending(true);
    setError("");

    try {
      await api("/comentarios", {
        method: "POST",
        body: JSON.stringify({ correo: correo.trim(), mensaje: mensaje.trim() }),
        skipAuth: true,
      });
      setSent(true);
      setCorreo("");
      setMensaje("");
    } catch {
      setError("Ocurrió un error al enviar tu comentario. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const items = noticias;

  return (
    <section id="noticias" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between" data-aos="fade-up">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">Noticias y anuncios</p>
            <h2 className="mt-3 font-serif text-3xl font-black text-primary md:text-4xl">Noticias y novedades</h2>
          </div>
          <p className="max-w-xl text-slate-500">Mantente al día con los comunicados, eventos y actividades de nuestra institución.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-20 rounded-full bg-slate-200" />
                    <div className="h-4 w-24 rounded bg-slate-200" />
                  </div>
                  <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                </div>
              ))
            : items.length === 0
            ? <p className="col-span-full py-8 text-center text-sm text-slate-400">Aún no hay noticias publicadas.</p>
            : items.slice(0, 6).map((item, i) => {
                const colors = categoryColors[item.categoria] ?? { bg: "bg-slate-100", text: "text-slate-700" };
                const firstImage = item.imagenes?.[0];
                return (
                  <article
                    key={item.id}
                    className="elc-card-pro overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay={i * 80}
                  >
                    {firstImage && (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={firstImage.url}
                          alt={firstImage.alt || item.titulo}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${colors.bg} ${colors.text}`}>
                          {item.categoria}
                        </span>
                        <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
                      </div>
                      <h3 className="mt-5 text-xl font-bold text-slate-900">{item.titulo}</h3>
                    </div>
                  </article>
                );
              })}
        </div>

        <div className="mx-auto mt-14 max-w-lg" data-aos="fade-up">
          <div className="elc-card-pro p-8">
            <h3 className="text-center font-serif text-xl font-bold text-primary">Déjanos tu comentario</h3>
            <p className="mt-2 text-center text-sm text-slate-500">¿Qué opinas de nuestras noticias? Te leemos.</p>

            {sent ? (
              <div className="mt-6 rounded-2xl bg-green-50 p-6 text-center">
                <p className="font-semibold text-green-800">Gracias por tu comentario.</p>
                <p className="mt-1 text-sm text-green-600">Será revisado por nuestros administradores.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="c-correo" className="sr-only">Tu correo electrónico</label>
                  <input
                    id="c-correo"
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label htmlFor="c-mensaje" className="sr-only">Tu comentario</label>
                  <textarea
                    id="c-mensaje"
                    placeholder="Escribe tu comentario..."
                    rows={4}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-light disabled:opacity-60"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {sending ? "Enviando..." : "Enviar comentario"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
