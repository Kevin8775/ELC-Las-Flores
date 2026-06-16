"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Quote } from "lucide-react";

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

  useEffect(() => {
    api<{ testimonios: Testimonial[] }>("/testimonios")
      .then((data) => setTestimonials(data.testimonios))
      .catch(() => setTestimonials(fallbackTestimonials))
      .finally(() => setLoading(false));
  }, []);

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
      </div>
    </section>
  );
}
