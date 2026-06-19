import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "50578421018";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola! Quiero inscribirme en ELC Las Flores.")}`;

export function FooterContactSection() {
  return (
    <section id="contacto" className="mx-auto max-w-6xl px-4 pt-20 pb-16">
      <div
        className="relative overflow-hidden rounded-[28px] bg-primary shadow-2xl shadow-primary/20"
        data-aos="fade-up"
      >
        <div className="absolute inset-0 elc-dots-pattern opacity-50" />
        <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-accent/12 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/8 blur-2xl" />

        <div className="relative grid items-center gap-10 px-8 py-14 md:grid-cols-2 md:px-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/50">Contacto</p>
            <h2 className="mt-3 font-serif text-3xl font-black text-white leading-tight md:text-4xl">
              ¿Listo para empezar tu aprendizaje?
            </h2>
            <p className="mt-4 max-w-md text-white/60">
              Contáctanos por WhatsApp y te guiaremos en el proceso de inscripción. Clases sabatinas para niños, jóvenes y adultos.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-whatsapp px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-whatsapp/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:bg-whatsapp-dark"
            >
              Inscribirme ahora <MessageCircle className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl bg-white/8 px-5 py-4 backdrop-blur-sm">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-white">Ubicación</p>
                <p className="mt-0.5 text-sm text-white/60">Las Flores, Masaya, Nicaragua</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl bg-white/8 px-5 py-4 backdrop-blur-sm">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-white">Teléfono</p>
                <p className="mt-0.5 text-sm text-white/60">+505 7842 1018</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl bg-white/8 px-5 py-4 backdrop-blur-sm">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-white">Correo</p>
                <p className="mt-0.5 text-sm text-white/60">contacto@elclasflores.edu.ni</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
