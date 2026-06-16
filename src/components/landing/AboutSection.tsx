export function AboutSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16" id="sobre">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start" data-aos="fade-up">
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
    </section>
  );
}
