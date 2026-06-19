import { ArrowRight, CalendarDays, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = "50578421018";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola! Quiero inscribirme en ELC Las Flores.")}`;

const stats = [
  { value: "Sábado", label: "modalidad principal" },
  { value: "3 niveles", label: "niños, jóvenes y adultos" },
  { value: "1 sistema", label: "para gestión escolar" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(30,58,95,0.98),rgba(46,85,135,0.92))]" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-48 w-48 translate-x-1/4 translate-y-1/4 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute left-0 top-1/2 h-32 w-32 -translate-x-1/4 -translate-y-1/4 rounded-full bg-white/5 blur-2xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 text-white lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur"
            data-aos="fade-up"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            Turno sabatino con visión moderna
          </div>
          <h1
            className="elc-gradient-text max-w-3xl font-serif text-4xl font-black leading-tight md:text-6xl"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Inglés con una experiencia escolar más clara, moderna y confiable.
          </h1>
          <p
            className="mt-6 max-w-2xl text-base leading-7 text-slate-200 md:text-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            ELC Las Flores combina formación académica, comunicación institucional y gestión escolar en una plataforma pensada para estudiantes, familias y docentes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="300">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-primary shadow-xl shadow-accent/20 transition hover:-translate-y-0.5"
            >
              Inscribirse ahora <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#sobre"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Conocer más
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3" data-aos="fade-up" data-aos-delay="400">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">{item.value}</p>
                <p className="mt-1 text-sm text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-[28px] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <div className="rounded-[24px] bg-white p-6 text-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">Agenda destacada</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Próxima actividad</p>
                <p className="mt-2 text-lg font-bold">Inicio de clases sabatinas</p>
                <p className="mt-1 text-sm text-slate-600">Organización de horarios, grupos y acompañamiento al estudiante.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Sábados</p>
                  <p className="text-sm text-slate-600">Modalidad principal</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Procesos claros</p>
                  <p className="text-sm text-slate-600">Pagos, reportes y noticias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
