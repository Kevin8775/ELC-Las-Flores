export const BIMESTRES = [
  { id: "ene-feb", label: "Enero–Febrero", mesInicio: 1, mesFin: 2 },
  { id: "mar-abr", label: "Marzo–Abril", mesInicio: 3, mesFin: 4 },
  { id: "may-jun", label: "Mayo–Junio", mesInicio: 5, mesFin: 6 },
  { id: "jul-ago", label: "Julio–Agosto", mesInicio: 7, mesFin: 8 },
  { id: "sep-oct", label: "Septiembre–Octubre", mesInicio: 9, mesFin: 10 },
  { id: "nov-dic", label: "Noviembre–Diciembre", mesInicio: 11, mesFin: 12 },
] as const;

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function getBimesterRange(bimesterId: string, year: number) {
  const b = BIMESTRES.find((b) => b.id === bimesterId);
  if (!b) throw new Error(`Bimestre invalido: ${bimesterId}`);
  return {
    start: new Date(year, b.mesInicio - 1, 1),
    end: new Date(year, b.mesFin, 0, 23, 59, 59),
    label: `${MESES[b.mesInicio - 1]}–${MESES[b.mesFin - 1]} ${year}`,
  };
}

export function getSaturdaysInRange(start: Date, end: Date): Date[] {
  const saturdays: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    if (current.getDay() === 6) {
      saturdays.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return saturdays;
}

export function groupSaturdaysByMonth(saturdays: Date[]): Map<number, Date[]> {
  const groups = new Map<number, Date[]>();
  for (const sat of saturdays) {
    const key = sat.getMonth();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(sat);
  }
  return groups;
}

export function formatDateLong(d: Date): string {
  const dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  return `${dias[d.getDay()]} ${d.getDate()}`;
}

export function toUTCString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
