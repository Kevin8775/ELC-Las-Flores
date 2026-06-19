import Image from "next/image";
import { BookOpen, GraduationCap, Users } from "lucide-react";

const stats = [
  { icon: GraduationCap, value: "2026", label: "Fundación", color: "text-primary" },
  { icon: Users, value: "A1-B2", label: "Niveles MCER", color: "text-primary-light" },
  { icon: BookOpen, value: "Sabatino", label: "Modalidad", color: "text-accent" },
];

export function AboutSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16" id="sobre">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start" data-aos="fade-up">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">Sobre nosotros</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-primary md:text-4xl">
            Una presencia institucional más clara y directa.
          </h2>
          <div className="mt-8 grid grid-cols-3 gap-4">
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
        </div>
        <div className="relative overflow-hidden rounded-[28px]" data-aos="fade-left" data-aos-delay="100">
          <div className="aspect-[4/3] w-full">
            <Image
              src="/Image2.webp"
              alt="Actividad académica en ELC Las Flores"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 500px"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-wrap gap-2">
              {["Práctico", "Disciplinado"].map((tag) => (
                <span key={tag} className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
