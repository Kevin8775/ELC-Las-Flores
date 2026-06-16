"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Quote, Send } from "lucide-react";

type Testimonial = {
  id: string;
  nombre: string;
  texto: string;
  rol?: string;
};

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    nombre: "María G.",
    texto: "Excelente centro de inglés. Mi hijo ha mejorado muchísimo su pronunciación y confianza al hablar. Los maestros son muy dedicados.",
    rol: "Madre de familia",
  },
  {
    id: "2",
    nombre: "Carlos M.",
    texto: "Tomé el curso para adultos y la metodología es muy práctica. Aprendí inglés conversacional rápido, ideal para mi trabajo.",
    rol: "Estudiante nivel adultos",
  },
  {
    id: "3",
    nombre: "Ana L.",
    texto: "El ambiente es muy acogedor y el horario sabatino es perfecto para quienes trabajamos entre semana. Altamente recomendado.",
    rol: "Estudiante nivel jóvenes",
  },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");
  const [rol, setRol] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ testimonios: Testimonial[] }>("/testimonios")
      .then((data) => setTestimonials(data.testimonios))
      .catch(() => setTestimonials(fallbackTestimonials))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !texto.trim()) return;
    setSending(true);
    setError("");

    try {
      await api("/testimonios", {
        method: "POST",
        body: JSON.stringify({ nombre: nombre.trim(), texto: texto.trim(), rol: rol.trim() || undefined }),
        skipAuth: true,
      });
      setSent(true);
      setNombre("");
      setTexto("");
      setRol("");
    } catch {
      setError("Ocurrió un error al enviar tu testimonio. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const items = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section id="testimonios" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Testimonios</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-[#1E3A5F] md:text-4xl">Lo que dicen nuestros estudiantes</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-slate-200" />
                    <div className="h-3 w-5/6 rounded bg-slate-200" />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                    <div className="h-3 w-24 rounded bg-slate-200" />
                  </div>
                </div>
              ))
            : items.map((item, i) => (
                <article
                  key={item.id}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <Quote className="h-8 w-8 text-[#1E3A5F]/20" />
                  <p className="mt-4 leading-7 text-slate-600">&ldquo;{item.texto}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-sm font-bold text-[#1E3A5F]">
                      {item.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.nombre}</p>
                      {item.rol && <p className="text-xs text-slate-500">{item.rol}</p>}
                    </div>
                  </div>
                </article>
              ))}
        </div>

        <div className="mx-auto mt-14 max-w-lg" data-aos="fade-up">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-center font-serif text-xl font-bold text-[#1E3A5F]">Comparte tu experiencia</h3>
            <p className="mt-2 text-center text-sm text-slate-500">Tu opinión ayuda a otros a conocer nuestra institución.</p>

            {sent ? (
              <div className="mt-6 rounded-2xl bg-green-50 p-6 text-center">
                <p className="font-semibold text-green-800">Gracias por compartir tu experiencia.</p>
                <p className="mt-1 text-sm text-green-600">Será revisada por nuestros administradores antes de publicarse.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10"
                />
                <textarea
                  placeholder="Escribe tu experiencia..."
                  rows={4}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10"
                />
                <input
                  type="text"
                  placeholder="Tu rol (ej: Madre de familia, Estudiante) — opcional"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2E5587] disabled:opacity-60"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {sending ? "Enviando..." : "Enviar testimonio"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
