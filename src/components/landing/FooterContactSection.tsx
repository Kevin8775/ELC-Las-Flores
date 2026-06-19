import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "50578421018";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola! Quiero inscribirme en ELC Las Flores.")}`;

export function FooterContactSection() {
  return (
    <section id="contacto" className="mx-auto max-w-6xl px-4 pt-20 pb-16">
      <div
        className="relative overflow-hidden rounded-[28px] bg-primary px-8 py-14 text-center shadow-2xl shadow-primary/20"
        data-aos="fade-up"
      >
        <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/4 translate-y-1/4 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-24 w-24 translate-x-1/4 -translate-y-1/4 rounded-full bg-white/5 blur-2xl" />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Contacto</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-white md:text-4xl">
            ¿Listo para empezar tu aprendizaje?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Contáctanos por WhatsApp y te guiaremos en el proceso de inscripción. Clases sabatinas para niños, jóvenes y adultos.
          </p>

          <div className="mx-auto mt-8 grid max-w-lg gap-4 text-left">
            <div className="flex items-center gap-3 text-white/80">
              <MapPin className="h-5 w-5 shrink-0 text-accent" />
              <span>Las Flores, Masaya, Nicaragua</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Phone className="h-5 w-5 shrink-0 text-accent" />
              <span>+505 7842 1018</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Mail className="h-5 w-5 shrink-0 text-accent" />
              <span>contacto@elclasflores.edu.ni</span>
            </div>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 font-semibold text-white shadow-lg shadow-whatsapp/20 transition hover:-translate-y-0.5 hover:bg-whatsapp-dark"
          >
            Inscribirme ahora <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
