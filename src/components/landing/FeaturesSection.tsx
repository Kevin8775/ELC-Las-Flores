import { Globe2, ShieldCheck, Users2 } from "lucide-react";

const features = [
  {
    icon: Users2,
    title: "Acompañamiento humano",
    text: "Seguimiento cercano para estudiantes y tutores en cada etapa del aprendizaje.",
    border: "border-t-primary",
    iconBg: "from-primary to-primary-light",
    iconShadow: "shadow-primary/20",
  },
  {
    icon: Globe2,
    title: "Inglés práctico",
    text: "Enfoque real en conversación, comprensión y uso del idioma en contextos cotidianos.",
    border: "border-t-accent",
    iconBg: "from-accent to-amber-500",
    iconShadow: "shadow-accent/20",
  },
  {
    icon: ShieldCheck,
    title: "Examen de ubicación",
    text: "Evaluamos tu nivel de inglés sin costo para colocarte en el grupo adecuado.",
    border: "border-t-[#25d366]",
    iconBg: "from-[#25d366] to-[#20bd5a]",
    iconShadow: "shadow-[#25d366]/20",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative bg-white py-20">
      <div className="absolute inset-0 elc-grid-pattern" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">¿Por qué ELC?</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-primary md:text-4xl">Lo que nos hace diferentes</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className={`elc-card-pro overflow-hidden border-t-4 ${item.border} p-7`}
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.iconBg} text-white shadow-lg ${item.iconShadow}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
