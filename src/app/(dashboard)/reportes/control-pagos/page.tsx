"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { api } from "@/lib/api";
import { BIMESTRES, getBimesterRange, getSaturdaysInRange, groupSaturdaysByMonth, formatDateLong, MESES } from "@/lib/saturdays";
import { ControlPagosSabatinoPDF } from "@/components/pdf/ControlPagosSabatino";

interface Estudiante {
  id: string;
  nombre: string;
  numeroMatricula: string;
  nivel: string;
  turno: string;
}

interface Pago {
  id: string;
  mes: number | null;
  anio: number | null;
  concepto: string;
  montoPagado: string;
  saldo: string;
  estadoPago: string;
  tipoPago: string;
}

type MonthData = {
  monthIndex: number;
  rows: Array<{
    date: string;
    concepto: string;
    monto: string;
    saldo: string;
  }>;
};

const NIVELES = ["", "BASICO", "INTERMEDIO", "AVANZADO"] as const;
const WEEKLY_AMOUNT = 125;
const TURNOS = [
  { value: "", label: "Todos los turnos" },
  { value: "MATUTINO", label: "Sabatino - Mañana" },
  { value: "VESPERTINO", label: "Sabatino - Tarde" },
] as const;

function buildMonthsData(estudianteId: string, bimesterId: string, year: number, pagos: Pago[]): MonthData[] {
  const { start, end } = getBimesterRange(bimesterId, year);
  const saturdays = getSaturdaysInRange(start, end);
  const grouped = groupSaturdaysByMonth(saturdays);
  const monthsData: MonthData[] = [];

  for (const [monthIndex, dates] of grouped) {
    const mesNum = monthIndex + 1;
    const pagosDelMes = pagos.filter((p) => p.mes === mesNum && p.anio === year);

    const pagoMensual = pagosDelMes.find((p) => p.tipoPago === "MENSUAL" && p.estadoPago !== "PENDIENTE");
    const pagosSemanales = pagosDelMes.filter((p) => p.tipoPago === "SEMANAL" && p.estadoPago !== "PENDIENTE");
    const totalMensual = dates.length * WEEKLY_AMOUNT;

    const rows = dates.map((d, i) => {
      const dateStr = formatDateLong(d);
      const sabadoNum = d.getDate();
      const concepto = `Sabado ${sabadoNum} de ${MESES[monthIndex]} ${year}`;

      if (pagoMensual) {
        return {
          date: dateStr,
          concepto,
          monto: `C$${totalMensual}`,
          saldo: i === 0 ? `C$${pagoMensual.saldo}` : "",
        };
      }

      const pagoSemanal = pagosSemanales.find((p) => {
        if (p.concepto.includes(String(sabadoNum))) return true;
        return false;
      });

      if (pagoSemanal) {
        return {
          date: dateStr,
          concepto,
          monto: `C$${WEEKLY_AMOUNT}`,
          saldo: `C$${pagoSemanal.saldo}`,
        };
      }

      return { date: dateStr, concepto, monto: "", saldo: "" };
    });

    monthsData.push({ monthIndex, rows });
  }

  return monthsData;
}

export default function ControlPagosSabatinoPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedBimester, setSelectedBimester] = useState("may-jun");
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [generatingAll, setGeneratingAll] = useState(false);

  const [filtroNivel, setFiltroNivel] = useState("");
  const [filtroTurno, setFiltroTurno] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filtroNivel) params.set("nivel", filtroNivel);
    if (filtroTurno) params.set("turno", filtroTurno);
    const qs = params.toString();
    api<{ estudiantes: Estudiante[] }>(`/control-pagos/estudiantes${qs ? `?${qs}` : ""}`)
      .then((data) => {
        setEstudiantes(data.estudiantes);
        if (!data.estudiantes.find((e) => e.id === selectedStudentId)) {
          setSelectedStudentId("");
        }
      })
      .catch(() => {});
  }, [filtroNivel, filtroTurno, selectedStudentId]);

  useEffect(() => {
    if (!selectedStudentId) return;
    const b = BIMESTRES.find((b) => b.id === selectedBimester);
    if (!b) return;
    let cancelled = false;
    api<{ pagos: Pago[] }>(
      `/control-pagos/pagos?estudianteId=${selectedStudentId}&anio=${selectedYear}&mesInicio=${b.mesInicio}&mesFin=${b.mesFin}`
    ).then((data) => {
      if (!cancelled) setPagos(data.pagos);
    }).catch(() => {
      if (!cancelled) setPagos([]);
    });
    return () => { cancelled = true; };
  }, [selectedStudentId, selectedYear, selectedBimester]);

  const studentName = estudiantes.find((e) => e.id === selectedStudentId)?.nombre ?? "";
  const studentCode = estudiantes.find((e) => e.id === selectedStudentId)?.numeroMatricula ?? "";
  const bimesterInfo = BIMESTRES.find((b) => b.id === selectedBimester);
  const periodLabel = bimesterInfo ? `${MESES[bimesterInfo.mesInicio - 1]}–${MESES[bimesterInfo.mesFin - 1]} ${selectedYear}` : "";
  const monthsData = selectedStudentId ? buildMonthsData(selectedStudentId, selectedBimester, selectedYear, pagos) : [];

  function hasMonthlyWarning(): boolean {
    if (!selectedStudentId || !bimesterInfo) return false;
    const startMonth = bimesterInfo.mesInicio;
    const endMonth = bimesterInfo.mesFin;
    for (let m = startMonth; m <= endMonth; m++) {
      const tieneMensual = pagos.some((p) => p.mes === m && p.tipoPago === "MENSUAL" && p.estadoPago !== "PENDIENTE");
      const tieneSemanal = pagos.some((p) => p.mes === m && p.tipoPago === "SEMANAL" && p.estadoPago !== "PENDIENTE");
      if (tieneMensual && tieneSemanal) return true;
    }
    return false;
  }

  const monthlyWarning = hasMonthlyWarning();

  async function handlePrint() {
    if (!selectedStudentId || monthsData.length === 0) return;
    const blob = await pdf(
      <ControlPagosSabatinoPDF
        studentName={studentName}
        studentCode={studentCode}
        periodLabel={periodLabel}
        months={monthsData}
        watermarkUrl="/MarcadeAgua.png"
        academyName="THE ENGLISH LANGUAGE CENTER LAS FLORES MASAYA"
        emissionDate={new Date().toLocaleDateString("es-ES")}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  async function handleGenerateAll() {
    setGeneratingAll(true);
    try {
      const data = await api<{ estudiantes: Estudiante[] }>("/control-pagos/estudiantes");
      const allStudents = data.estudiantes;

      for (const est of allStudents) {
        const b = BIMESTRES.find((b) => b.id === selectedBimester);
        if (!b) continue;
        const pData = await api<{ pagos: Pago[] }>(
          `/control-pagos/pagos?estudianteId=${est.id}&anio=${selectedYear}&mesInicio=${b.mesInicio}&mesFin=${b.mesFin}`
        );
        const mData = buildMonthsData(est.id, selectedBimester, selectedYear, pData.pagos);
        const label = b ? `${MESES[b.mesInicio - 1]}–${MESES[b.mesFin - 1]} ${selectedYear}` : "";

        const blob = await pdf(
          <ControlPagosSabatinoPDF
            studentName={est.nombre}
            studentCode={est.numeroMatricula}
            periodLabel={label}
            months={mData}
            watermarkUrl="/MarcadeAgua.png"
            academyName="THE ENGLISH LANGUAGE CENTER LAS FLORES MASAYA"
            emissionDate={new Date().toLocaleDateString("es-ES")}
          />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Control-Pagos-${est.nombre.replace(/\s+/g, "_")}-${label.replace(/\s+/g, "_")}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAll(false);
    }
  }

  return (
    <main className="space-y-6">
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Control de Pagos</h1>

      <div className="elc-card grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block text-sm">
          Nivel
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            className="mt-1 w-full rounded border p-2 text-sm"
          >
            <option value="">Todos los niveles</option>
            {NIVELES.filter(Boolean).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          Turno
          <select
            value={filtroTurno}
            onChange={(e) => setFiltroTurno(e.target.value)}
            className="mt-1 w-full rounded border p-2 text-sm"
          >
            {TURNOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          Estudiante
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="mt-1 w-full rounded border p-2 text-sm"
          >
            <option value="">Seleccionar estudiante</option>
            {estudiantes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} ({e.numeroMatricula})
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          Bimestre
          <select
            value={selectedBimester}
            onChange={(e) => setSelectedBimester(e.target.value)}
            className="mt-1 w-full rounded border p-2 text-sm"
          >
            {BIMESTRES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          Año
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="mt-1 w-full rounded border p-2 text-sm"
          >
            {[2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      {monthlyWarning && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Este estudiante tiene pagos mensuales y tambien pagos semanales registrados en el mismo periodo.
          Verifique que los datos sean correctos.
        </div>
      )}

      {selectedStudentId && (
        <div className="elc-card p-6">
          <h2 className="mb-4 font-serif text-xl font-bold text-[#1E3A5F]">Acciones</h2>
          <div className="flex flex-wrap gap-3">
            <PDFDownloadLink
              document={
                <ControlPagosSabatinoPDF
                  studentName={studentName}
                  studentCode={studentCode}
                  periodLabel={periodLabel}
                  months={monthsData}
                  watermarkUrl="/MarcadeAgua.png"
                  academyName="THE ENGLISH LANGUAGE CENTER LAS FLORES MASAYA"
                  emissionDate={new Date().toLocaleDateString("es-ES")}
                />
              }
              fileName={`Control-Pagos-${studentName.replace(/\s+/g, "_")}-${periodLabel.replace(/\s+/g, "_")}.pdf`}
              className="rounded-md bg-[#1E3A5F] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2E5587]"
            >
              {({ loading: dlLoading }) => (dlLoading ? "Generando PDF..." : "Descargar PDF")}
            </PDFDownloadLink>

          <button
            onClick={handlePrint}
            disabled={monthsData.length === 0}
              className="rounded-md bg-[#F4C430] px-5 py-2 text-sm font-semibold text-[#1E3A5F] hover:bg-[#dbaa20] disabled:opacity-50"
            >
              Imprimir
            </button>

            <button
              onClick={handleGenerateAll}
              disabled={generatingAll}
              className="rounded-md bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
            >
              {generatingAll ? "Generando..." : "Generar para todos los activos"}
            </button>
          </div>

          {monthsData.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold text-[#1E3A5F]">Vista previa del período</h3>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="p-2 text-[#1E3A5F]">Mes</th>
                    <th className="p-2 text-[#1E3A5F]">Sábados</th>
                    <th className="p-2 text-[#1E3A5F]">Pagos registrados</th>
                  </tr>
                </thead>
                <tbody>
                  {monthsData.map((m) => {
                    const pagosDelMes = pagos.filter((p) => p.mes === m.monthIndex + 1);
                    return (
                      <tr key={m.monthIndex} className="border-t border-slate-200">
                        <td className="p-2 font-medium">{MESES[m.monthIndex]}</td>
                        <td className="p-2">{m.rows.length} sábados</td>
                        <td className="p-2">
                          {pagosDelMes.length > 0
                            ? pagosDelMes.map((p) => `${p.concepto} (${p.tipoPago === "MENSUAL" ? "Mensual" : "Semanal"} C$${p.montoPagado})`).join(", ")
                            : "Sin pagos registrados"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!selectedStudentId && (
        <div className="elc-card p-6 text-center text-slate-400">
          Selecciona un estudiante y un período para generar el Control de Pagos
        </div>
      )}
    </main>
  );
}
