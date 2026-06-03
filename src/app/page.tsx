import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, CheckCircle2, Globe2, ShieldCheck, Sparkles, Users2 } from "lucide-react";
import { LandingCarousel } from "@/components/home/LandingCarousel";

export default function Home() {
  const noticias = [
    { id: 1, titulo: "Inicio de clases sabatinas", categoria: "Noticia", fecha: "2026-05-10" },
    { id: 2, titulo: "Concurso de spelling bee", categoria: "Evento", fecha: "2026-06-07" },
    { id: 3, titulo: "Comunicado de matrículas 2026", categoria: "Comunicado", fecha: "2026-05-01" },
  ];

  const features = [
    { icon: Users2, title: "Acompañamiento humano", text: "Seguimiento cercano para estudiantes y tutores en cada etapa del aprendizaje." },
    { icon: Globe2, title: "Inglés práctico", text: "Enfoque real en conversación, comprensión y uso del idioma en contextos cotidianos." },
    { icon: ShieldCheck, title: "Gestión confiable", text: "Organización clara para matrículas, pagos, reportes y comunicación institucional." },
  ];

  const stats = [
    { value: "Sábado", label: "modalidad principal" },
    { value: "3 niveles", label: "niños, jóvenes y adultos" },
    { value: "1 sistema", label: "para gestión escolar" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,196,48,0.18),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#eef4fb_100%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/10">
              <Image src="/LogoELCLF.png" alt="ELC Las Flores" width={56} height={56} className="h-full w-full object-contain p-0.5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">The English Language Center</p>
              <p className="text-sm font-semibold text-[#1E3A5F]">Las Flores - Masaya</p>
            </div>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a className="transition hover:text-[#1E3A5F]" href="#noticias">Noticias</a>
            <a className="transition hover:text-[#1E3A5F]" href="#sobre">Sobre nosotros</a>
            <a className="transition hover:text-[#1E3A5F]" href="#horarios">Horarios</a>
            <a className="transition hover:text-[#1E3A5F]" href="#contacto">Contacto</a>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-[#1E3A5F] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#1E3A5F]/20 transition hover:-translate-y-0.5 hover:bg-[#17314f]"
          >
            Iniciar sesión <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(30,58,95,0.98),rgba(46,85,135,0.92))]" />
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#F4C430]/25 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 text-white lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur">
                <Sparkles className="h-4 w-4 text-[#F4C430]" />
                Turno sabatino con visión moderna
              </div>
              <h1 className="max-w-3xl font-serif text-4xl font-black leading-tight md:text-6xl">
                Inglés con una experiencia escolar más clara, moderna y confiable.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
                ELC Las Flores combina formación académica, comunicación institucional y gestión escolar en una plataforma pensada para estudiantes, familias y docentes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contacto" className="inline-flex items-center gap-2 rounded-full bg-[#F4C430] px-6 py-3.5 font-semibold text-[#1E3A5F] shadow-xl shadow-[#F4C430]/20 transition hover:-translate-y-0.5">
                  Inscribirse ahora <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/14">
                  Acceder al sistema
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                    <p className="text-2xl font-black text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-200">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="rounded-[24px] bg-white p-6 text-slate-900">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Agenda destacada</p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">Próxima actividad</p>
                    <p className="mt-2 text-lg font-bold">Inicio de clases sabatinas</p>
                    <p className="mt-1 text-sm text-slate-600">Organización de horarios, grupos y acompañamiento al estudiante.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <CalendarDays className="h-5 w-5 text-[#1E3A5F]" />
                      <p className="mt-3 text-sm font-semibold text-slate-900">Sábados</p>
                      <p className="text-sm text-slate-600">Modalidad principal</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <CheckCircle2 className="h-5 w-5 text-[#1E3A5F]" />
                      <p className="mt-3 text-sm font-semibold text-slate-900">Procesos claros</p>
                      <p className="text-sm text-slate-600">Pagos, reportes y noticias</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LandingCarousel />

        <section className="mx-auto max-w-6xl px-4 py-16" id="sobre">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Sobre nosotros</p>
              <h2 className="mt-3 font-serif text-3xl font-black text-[#1E3A5F] md:text-4xl">
                Una presencia institucional más limpia y actual.
              </h2>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="max-w-3xl text-lg leading-8 text-slate-700">
                ELC Las Flores impulsa el aprendizaje del idioma inglés con enfoque práctico, disciplina académica y acompañamiento a estudiantes y tutores, ahora con una experiencia visual más moderna y ordenada.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="elc-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
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

        <section id="noticias" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Noticias y anuncios</p>
                <h2 className="mt-3 font-serif text-3xl font-black text-[#1E3A5F] md:text-4xl">Contenido reciente y relevante.</h2>
              </div>
              <p className="max-w-xl text-slate-600">Bloques más limpios, mejor jerarquía visual y un estilo más alineado con una plataforma actual.</p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {noticias.map((item) => (
                <article key={item.id} className="elc-card overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between gap-3">
                    <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E5587]">{item.categoria}</p>
                    <p className="text-xs text-slate-500">{item.fecha}</p>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{item.titulo}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Información institucional, eventos y comunicados para mantener a la comunidad al día.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="horarios" className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-[28px] bg-[#1E3A5F] px-8 py-10 text-white shadow-2xl shadow-[#1E3A5F]/15">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Horarios</p>
                <h2 className="mt-3 font-serif text-3xl font-black md:text-4xl">Modalidad exclusiva sabatina.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-white/70">Disponibilidad</p>
                  <p className="mt-2 text-lg font-semibold">Todos los sábados</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-white/70">Enfoque</p>
                  <p className="mt-2 text-lg font-semibold">Aprendizaje continuo y práctico</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="pb-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2E5587]">Contacto</p>
                <h2 className="mt-3 font-serif text-3xl font-black text-[#1E3A5F]">Hablemos con tu comunidad.</h2>
                <p className="mt-3 max-w-2xl text-slate-600">Las Flores, Masaya, Nicaragua | +505 0000-0000 | contacto@elclasflores.edu.ni</p>
              </div>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1E3A5F] px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#17314f]">
                Acceder al sistema <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p className="font-semibold text-[#1E3A5F]">The English Language Center - Las Flores - Masaya</p>
        <p className="mt-1">{new Date().getFullYear()} ELC Las Flores</p>
      </footer>
    </div>
  );
}
