"use client";

export default function ConstanciaPage() {
  return (
    <main className="space-y-4">
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Constancia de matricula</h1>
      <p>Documento oficial para estudiante y tutor.</p>
      <button onClick={() => window.print()} className="rounded-md bg-[#1E3A5F] px-4 py-2 text-white">
        Imprimir constancia
      </button>
    </main>
  );
}
