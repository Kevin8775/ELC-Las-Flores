"use client";

export default function ReporteNotasPage() {
  return (
    <main className="space-y-4">
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Informe de calificaciones</h1>
      <p>Genera el PDF por estudiante, periodo y unidad.</p>
      <button onClick={() => window.print()} className="rounded-md bg-[#1E3A5F] px-4 py-2 text-white">
        Imprimir
      </button>
    </main>
  );
}
