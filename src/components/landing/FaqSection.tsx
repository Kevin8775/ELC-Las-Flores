"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, MapPin } from "lucide-react";

const MAPS_URL = "https://maps.app.goo.gl/Hq9XxSydeXZN1dAz6";

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
    respuesta: "Manejamos los niveles A1, A2, B1 y B2 del Marco Común Europeo (MCER), organizados por grupos según la edad y nivel del estudiante.",
  },
  {
    pregunta: "¿Ofrecen examen de ubicación?",
    respuesta: "Sí, ofrecemos un examen de ubicación completamente gratis y presencial. Con él evaluamos tu nivel actual de inglés para colocarte en el grupo adecuado.",
  },
  {
    pregunta: "¿Cómo puedo realizar el pago de matrícula o mensualidad?",
    respuesta: "Los pagos se realizan únicamente en nuestras instalaciones en Las Flores, Masaya. Puedes consultar tus recibos y dar seguimiento a través de WhatsApp.",
  },
  {
    pregunta: "¿Ofrecen clases en línea o solo presenciales?",
    respuesta: "Actualmente nuestra modalidad es presencial sabatina. Sin embargo, complementamos la enseñanza con recursos digitales y comunicación constante a través de WhatsApp.",
  },
  {
    pregunta: "¿Dónde están ubicados?",
    respuesta: "Estamos ubicados en Las Flores, Masaya, Nicaragua. Puedes visitarnos durante los sábados en horario de clases o contactarnos para agendar una cita.",
  },
];

const LOCATION_INDEX = faqs.length - 1;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="elc-section-alt mx-auto max-w-6xl px-4 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.pregunta,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.respuesta,
              },
            })),
          }),
        }}
      />
      <div className="text-center" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">Preguntas frecuentes</p>
        <h2 className="mt-3 font-serif text-3xl font-black text-primary md:text-4xl">Resolvemos tus dudas</h2>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-3" data-aos="fade-up" data-aos-delay="100">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`elc-card-pro overflow-hidden transition-shadow ${isOpen ? "shadow-lg" : ""}`}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-900 md:text-base">{faq.pregunta}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-sm leading-7 text-slate-600">{faq.respuesta}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {openIndex === LOCATION_INDEX && (
        <div className="mx-auto mt-8 max-w-3xl space-y-4" data-aos="fade-up">
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-100">
            <iframe
              src="https://maps.google.com/maps?q=11.9911762,-86.0314609&z=17&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de ELC Las Flores"
            />
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-light"
          >
            <MapPin className="h-4 w-4" />
            Abrir en Google Maps
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </section>
  );
}
