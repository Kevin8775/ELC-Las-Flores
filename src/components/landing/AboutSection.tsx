import { BookOpen, GraduationCap, Users } from "lucide-react";

const stats = [
  { icon: GraduationCap, value: "2026", label: "Fundación", color: "text-primary" },
  { icon: Users, value: "A1-B2", label: "Niveles MCER", color: "text-primary-light" },
  { icon: BookOpen, value: "Sabatino", label: "Modalidad", color: "text-accent" },
];

export function AboutSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16" id="sobre">
      <div className="mx-auto max-w-3xl" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">Sobre nosotros</p>
        <h2 className="mt-3 font-serif text-3xl font-black text-primary md:text-4xl">
          Una presencia institucional más clara y directa.
        </h2>
        <div className="mt-8 grid grid-cols-3 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <Icon className={`mx-auto h-6 w-6 ${item.color}`} />
                <p className="mt-2 text-lg font-black text-primary">{item.value}</p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            );
          })}
        </div>
        <div className="elc-card relative mt-12 overflow-hidden p-10 shadow-sm" data-aos="fade-up" data-aos-delay="100">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
          <p className="relative max-w-3xl text-lg leading-8 text-slate-700">
            ELC Las Flores impulsa el aprendizaje del idioma inglés con enfoque práctico, disciplina académica y acompañamiento a estudiantes y tutores.
          </p>
          <div className="relative mt-6 flex flex-wrap gap-2">
            {["Práctico", "Disciplinado"].map((tag) => (
              <span key={tag} className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
