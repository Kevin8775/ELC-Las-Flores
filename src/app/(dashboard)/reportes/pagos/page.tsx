"use client";

export default function ReportePagosPage() {
  return (
    <main className="space-y-4">
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Estado de cuenta y pagos</h1>
      <p>Filtra por estudiante y rango de fechas para generar PDF.</p>
      <button onClick={() => window.print()} className="rounded-md bg-[#1E3A5F] px-4 py-2 text-white">
        Imprimir
      </button>
    </main>
  );
}
