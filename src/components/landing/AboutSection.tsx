import { BookOpen, GraduationCap, Users } from "lucide-react";

const stats = [
  { icon: GraduationCap, value: "2026", label: "Fundación", color: "text-primary", accent: "from-primary to-primary-light" },
  { icon: Users, value: "A1-B2", label: "Niveles MCER", color: "text-primary-light", accent: "from-primary-light to-[#3d6ea0]" },
  { icon: BookOpen, value: "Sabatino", label: "Modalidad", color: "text-accent", accent: "from-accent to-amber-500" },
];

export function AboutSection() {
  return (
    <section className="elc-section-alt py-20" id="sobre">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2" data-aos="fade-up">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">Sobre nosotros</p>
            <h2 className="mt-3 font-serif text-3xl font-black leading-tight text-primary md:text-4xl">
              Una presencia institucional más clara y directa.
            </h2>
            <p className="mt-6 text-base leading-7 text-slate-600">
              ELC Las Flores impulsa el aprendizaje del idioma inglés con enfoque práctico, disciplina académica y acompañamiento a estudiantes y tutores.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Práctico", "Disciplinado", "Cercano"].map((tag) => (
                <span key={tag} className="rounded-full bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl shadow-primary/8 ring-1 ring-slate-100">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/15 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-primary/8 blur-xl" />
              <div className="relative grid grid-cols-3 gap-3">
                {stats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="text-center">
                      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-lg font-black text-primary">{item.value}</p>
                      <p className="text-[11px] text-slate-500">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
