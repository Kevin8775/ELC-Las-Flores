import { Document, Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer";
import { MESES } from "@/lib/saturdays";

type SaturdayRow = {
  date: string;
  concepto: string;
  monto: string;
  saldo: string;
};

type MonthTable = {
  monthIndex: number;
  rows: SaturdayRow[];
};

type Props = {
  studentName: string;
  studentCode: string;
  periodLabel: string;
  months: MonthTable[];
  logoUrl?: string;
  watermarkUrl?: string;
  academyName: string;
  emissionDate: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
  },
  watermark: {
    position: "absolute",
    top: "32%",
    left: "18%",
    width: "64%",
    opacity: 0.08,
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: "center",
    marginBottom: 8,
  },
  academyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A5F",
    textAlign: "center",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E3A5F",
    textAlign: "center",
    marginTop: 6,
    textTransform: "uppercase",
  },
  studentLine: {
    fontSize: 11,
    marginTop: 10,
    marginBottom: 14,
    color: "#1E3A5F",
  },
  monthTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginTop: 12,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  table: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1E3A5F",
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 9,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#F4C430",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
  },
  tableCell: {
    padding: 5,
    fontSize: 9,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#CBD5E1",
  },
  tableCellLast: {
    padding: 5,
    fontSize: 9,
    textAlign: "center",
  },
  firmaCell: {
    padding: 5,
    fontSize: 9,
    textAlign: "center",
    color: "#94A3B8",
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 8,
    color: "#64748B",
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
    paddingTop: 6,
  },
});

const colWidths = ["18%", "27%", "18%", "18%", "19%"];

function Table({ monthLabel, rows }: { monthLabel: string; rows: SaturdayRow[] }) {
  return (
    <View wrap={false}>
      <Text style={styles.monthTitle}>{monthLabel}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: colWidths[0] }]}>Fecha</Text>
          <Text style={[styles.tableHeaderCell, { width: colWidths[1] }]}>Concepto</Text>
          <Text style={[styles.tableHeaderCell, { width: colWidths[2] }]}>Monto</Text>
          <Text style={[styles.tableHeaderCell, { width: colWidths[3] }]}>Saldo</Text>
          <Text style={[styles.tableHeaderCell, { width: colWidths[4], borderRightWidth: 0 }]}>Firma / Sello</Text>
        </View>
        {rows.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: colWidths[0] }]}>{row.date}</Text>
            <Text style={[styles.tableCell, { width: colWidths[1] }]}>{row.concepto}</Text>
            <Text style={[styles.tableCell, { width: colWidths[2] }]}>{row.monto}</Text>
            <Text style={[styles.tableCell, { width: colWidths[3] }]}>{row.saldo}</Text>
            <Text style={[styles.tableCellLast, { width: colWidths[4] }]}>________________</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ControlPagosSabatinoPDF({ studentName, studentCode, periodLabel, months, logoUrl, watermarkUrl, academyName, emissionDate }: Props) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {watermarkUrl && <Image style={styles.watermark} src={watermarkUrl} />}
        {logoUrl && <Image style={styles.logo} src={logoUrl} />}
        <View style={styles.header}>
          <Text style={styles.academyName}>
            {academyName || "THE ENGLISH LANGUAGE CENTER LAS FLORES MASAYA"}
          </Text>
          <Text style={styles.title}>CONTROL DE PAGOS: {periodLabel}</Text>
        </View>

        <Text style={styles.studentLine}>Nombre del Estudiante: {studentName} | Codigo: {studentCode}</Text>

        {months.map((m) => (
          <Table key={m.monthIndex} monthLabel={MESES[m.monthIndex]} rows={m.rows} />
        ))}

        <View style={styles.footer}>
          <Text>
            {academyName || "THE ENGLISH LANGUAGE CENTER LAS FLORES MASAYA"} — Emitido: {emissionDate}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
