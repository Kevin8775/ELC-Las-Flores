"use client";

export default function AsistenciaPage() {
  return (
    <main className="space-y-4">
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Lista de estudiantes por docente</h1>
      <p>Version imprimible con casillas para asistencia sabatina.</p>
      <button onClick={() => window.print()} className="rounded-md bg-[#1E3A5F] px-4 py-2 text-white">
        Imprimir lista
      </button>
    </main>
  );
}
