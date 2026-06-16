"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    pregunta: "¿Cómo puedo inscribir a mi hijo en ELC Las Flores?",
    respuesta: "Puedes contactarnos a través de nuestro formulario en línea, por WhatsApp o visitarnos directamente en nuestras instalaciones en Las Flores, Masaya. Te guiaremos en todo el proceso de matrícula.",
  },
  {
    pregunta: "¿Cuáles son los horarios de clases?",
    respuesta: "Nuestra modalidad principal es sabatina. Las clases se llevan a cabo todos los sábados, con horarios específicos según el nivel y la edad del estudiante.",
  },
  {
    pregunta: "¿Qué niveles de inglés ofrecen?",
    respuesta: "Ofrecemos 3 niveles principales: niños, jóvenes y adultos. Cada nivel está adaptado a las necesidades y ritmo de aprendizaje de cada grupo etario.",
  },
  {
    pregunta: "¿Cómo puedo realizar el pago de matrícula o mensualidad?",
    respuesta: "Puedes realizar tus pagos en nuestras instalaciones o a través de transferencia bancaria. Todo el proceso está respaldado por nuestro sistema de gestión escolar que te permite dar seguimiento a tus pagos.",
  },
  {
    pregunta: "¿Dónde están ubicados?",
    respuesta: "Estamos ubicados en Las Flores, Masaya, Nicaragua. Puedes visitarnos durante los sábados en horario de clases o contactarnos para agendar una cita.",
  },
  {
    pregunta: "¿Ofrecen clases en línea o solo presenciales?",
    respuesta: "Actualmente nuestra modalidad es presencial sabatina. Sin embargo, complementamos la enseñanza con recursos digitales y comunicación constante a través de nuestra plataforma.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Preguntas frecuentes</p>
        <h2 className="mt-3 font-serif text-3xl font-black text-[#1E3A5F] md:text-4xl">Resolvemos tus dudas</h2>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-3" data-aos="fade-up" data-aos-delay="100">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border border-slate-200 bg-white transition-shadow ${isOpen ? "shadow-md" : "shadow-sm"}`}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-900 md:text-base">{faq.pregunta}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-7 text-slate-600">{faq.respuesta}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
