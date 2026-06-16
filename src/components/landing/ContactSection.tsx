import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "50578421018";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola! Me gustaría recibir más información sobre ELC Las Flores.")}`;

export function ContactSection() {
  return (
    <section id="contacto" className="pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center"
          data-aos="fade-up"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Contacto</p>
            <h2 className="mt-3 font-serif text-3xl font-black text-[#1E3A5F]">Hablemos con tu comunidad.</h2>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="h-5 w-5 shrink-0 text-[#1E3A5F]" />
                <span>Las Flores, Masaya, Nicaragua</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="h-5 w-5 shrink-0 text-[#1E3A5F]" />
                <span>+505 7842 1018</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="h-5 w-5 shrink-0 text-[#1E3A5F]" />
                <span>contacto@elclasflores.edu.ni</span>
              </div>
            </div>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#25D366]/20 transition hover:-translate-y-0.5 hover:bg-[#20bd5a]"
          >
            Escribir por WhatsApp <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
