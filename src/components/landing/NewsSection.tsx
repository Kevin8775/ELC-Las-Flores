"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Noticia = {
  id: string;
  titulo: string;
  categoria: string;
  createdAt: string;
};

const fallbackNoticias: Noticia[] = [
  { id: "f1", titulo: "Inicio de clases sabatinas", categoria: "Noticia", createdAt: "2026-05-10" },
  { id: "f2", titulo: "Concurso de spelling bee", categoria: "Evento", createdAt: "2026-06-07" },
  { id: "f3", titulo: "Comunicado de matrículas 2026", categoria: "Comunicado", createdAt: "2026-05-01" },
];

export function NewsSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ noticias: Noticia[] }>("/noticias")
      .then((data) => setNoticias(data.noticias))
      .catch(() => setNoticias(fallbackNoticias))
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

  const items = noticias.length > 0 ? noticias : fallbackNoticias;

  return (
    <section id="noticias" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between" data-aos="fade-up">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Noticias y anuncios</p>
            <h2 className="mt-3 font-serif text-3xl font-black text-[#1E3A5F] md:text-4xl">Contenido reciente y relevante.</h2>
          </div>
          <p className="max-w-xl text-slate-600">Mantente al día con los comunicados, eventos y actividades de nuestra institución.</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-20 rounded-full bg-slate-200" />
                    <div className="h-4 w-24 rounded bg-slate-200" />
                  </div>
                  <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                </div>
              ))
            : items.slice(0, 6).map((item, i) => (
                <article
                  key={item.id}
                  className="elc-card overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-xl"
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E5587]">
                      {item.categoria}
                    </span>
                    <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{item.titulo}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Información institucional, eventos y comunicados para mantener a la comunidad al día.
                  </p>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
