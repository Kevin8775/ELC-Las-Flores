import { ArrowRight, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "50578421018";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola! Quiero inscribirme en ELC Las Flores.")}`;

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-20 pb-16">
      <div
        className="relative overflow-hidden rounded-[28px] bg-[#1E3A5F] px-8 py-14 text-center shadow-2xl shadow-[#1E3A5F]/20"
        data-aos="fade-up"
      >
        <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-[#F4C430]/15 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Comienza hoy</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-white md:text-4xl">
            ¿Listo para empezar tu aprendizaje?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Contáctanos por WhatsApp y te guiaremos en el proceso de inscripción. Clases sabatinas para niños, jóvenes y adultos.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#25D366]/20 transition hover:-translate-y-0.5 hover:bg-[#20bd5a]"
          >
            Inscribirme ahora <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
