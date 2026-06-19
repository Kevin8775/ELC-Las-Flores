import { ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "50578421018";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola! Quiero inscribirme en ELC Las Flores.")}`;

const stats = [
  { value: "Sábado", label: "modalidad principal" },
  { value: "A1 - B2", label: "niveles del MCER" },
  { value: "Gratis", label: "examen de ubicación" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(22,48,82,1),rgba(30,58,95,0.95),rgba(46,85,135,0.9))]" />
      <div className="absolute inset-0 elc-dots-pattern" />
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-56 w-56 translate-x-1/4 translate-y-1/4 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-24 text-white lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em] text-accent/80"
            data-aos="fade-up"
            data-aos-delay="50"
          >
            The English Language Center
          </p>
          <h1
            className="mt-5 font-serif text-[2.5rem] font-black leading-[1.1] tracking-tight text-white md:text-7xl"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Tu futuro no tiene fronteras.{" "}
            <span className="elc-gradient-text">Aprende inglés en ELC Las Flores.</span>
          </h1>
          <p
            className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/65 md:text-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Aprende inglés en ELC Las Flores y construye las herramientas que necesitas para comunicarte con el mundo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="300">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-4 text-sm font-bold text-primary shadow-xl shadow-accent/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent/30"
            >
              Inscribirme ahora <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#sobre"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/12"
            >
              Conocer más
            </a>
          </div>
          <div className="mx-auto mt-14 grid max-w-lg gap-4 sm:grid-cols-3" data-aos="fade-up" data-aos-delay="400">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur-md"
              >
                <p className="text-2xl font-black text-white">{item.value}</p>
                <p className="mt-1 text-xs text-white/55">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
