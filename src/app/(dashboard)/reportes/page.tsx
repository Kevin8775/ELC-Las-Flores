import Link from "next/link";

const reportes = [
  { href: "/reportes/notas", nombre: "Informe de calificaciones" },
  { href: "/reportes/pagos", nombre: "Estado de cuenta y reporte general de pagos" },
  { href: "/reportes/control-pagos", nombre: "Control de Pagos Sabatino" },
  { href: "/reportes/constancia", nombre: "Constancia de matricula" },
  { href: "/reportes/asistencia", nombre: "Lista de estudiantes por docente" },
];

export default function ReportesPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Reportes PDF e impresion</h1>
      <div className="mt-6 grid gap-3">
        {reportes.map((r) => (
          <Link key={r.href} href={r.href} className="elc-card p-4 hover:border-[#2E5587]">
            {r.nombre}
          </Link>
        ))}
      </div>
    </main>
  );
}
