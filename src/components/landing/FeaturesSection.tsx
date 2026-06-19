import { Globe2, ShieldCheck, Users2 } from "lucide-react";

const features = [
  { icon: Users2, title: "Acompañamiento humano", text: "Seguimiento cercano para estudiantes y tutores en cada etapa del aprendizaje." },
  { icon: Globe2, title: "Inglés práctico", text: "Enfoque real en conversación, comprensión y uso del idioma en contextos cotidianos." },
  { icon: ShieldCheck, title: "Examen de ubicación", text: "Evaluamos tu nivel de inglés sin costo para colocarte en el grupo adecuado." },
];

export function FeaturesSection() {
  return (
    <section className="elc-section-alt mx-auto max-w-6xl px-4 py-16">
      <div className="text-center" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">¿Por qué ELC?</p>
        <h2 className="mt-3 font-serif text-3xl font-black text-primary md:text-4xl">Lo que nos hace diferentes</h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {features.map((item, i) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="elc-card elc-card-hover overflow-hidden p-6"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white shadow-lg shadow-primary/15">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
