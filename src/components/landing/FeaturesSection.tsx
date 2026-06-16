import { Globe2, ShieldCheck, Users2 } from "lucide-react";

const features = [
  { icon: Users2, title: "Acompañamiento humano", text: "Seguimiento cercano para estudiantes y tutores en cada etapa del aprendizaje." },
  { icon: Globe2, title: "Inglés práctico", text: "Enfoque real en conversación, comprensión y uso del idioma en contextos cotidianos." },
  { icon: ShieldCheck, title: "Gestión confiable", text: "Organización clara para matrículas, pagos, reportes y comunicación institucional." },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {features.map((item, i) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="elc-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E3A5F]/10 text-[#1E3A5F]">
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
