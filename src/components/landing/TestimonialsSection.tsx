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

const borderColors = [
  "from-primary to-primary-light",
  "from-accent to-amber-500",
  "from-[#25d366] to-[#20bd5a]",
];

const avatarColors = [
  "from-primary to-primary-light",
  "from-accent to-amber-500",
  "from-[#25d366] to-[#20bd5a]",
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
      .catch(() => {})
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

  const items = testimonials;

  return (
    <section id="testimonios" className="relative bg-white py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8fbff_0%,#f0f6ff_50%,#f8fbff_100%)]" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">Testimonios</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-primary md:text-4xl">Lo que dicen de nosotros</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
            : items.length === 0
            ? <p className="col-span-full py-8 text-center text-sm text-slate-400">Aún no hay testimonios publicados.</p>
            : items.map((item, i) => (
                <article
                  key={item.id}
                  className="elc-card-pro relative overflow-hidden p-7"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-gradient-to-b ${borderColors[i % borderColors.length]}`} />
                  <Quote className="h-8 w-8 text-primary/10" />
                  <p className="mt-4 leading-7 text-slate-600">&ldquo;{item.texto}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-sm font-bold text-white shadow-md`}>
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
          <div className="elc-card-pro p-8">
            <h3 className="text-center font-serif text-xl font-bold text-primary">Comparte tu experiencia</h3>
            <p className="mt-2 text-center text-sm text-slate-500">Tu opinión ayuda a otros a conocer nuestra institución.</p>

            {sent ? (
              <div className="mt-6 rounded-2xl bg-green-50 p-6 text-center">
                <p className="font-semibold text-green-800">Gracias por compartir tu experiencia.</p>
                <p className="mt-1 text-sm text-green-600">Será revisada por nuestros administradores antes de publicarse.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="t-nombre" className="sr-only">Tu nombre</label>
                  <input
                    id="t-nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label htmlFor="t-texto" className="sr-only">Tu experiencia</label>
                  <textarea
                    id="t-texto"
                    placeholder="Escribe tu experiencia..."
                    rows={4}
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label htmlFor="t-rol" className="sr-only">Tu rol</label>
                  <input
                    id="t-rol"
                    type="text"
                    placeholder="Tu rol (ej: Madre de familia, Estudiante) — opcional"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-light disabled:opacity-60"
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
