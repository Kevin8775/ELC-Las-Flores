import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11 },
  title: { fontSize: 16, marginBottom: 8, color: "#1E3A5F" },
  row: { marginBottom: 6 },
});

type ReciboPagoProps = {
  recibo: string;
  estudiante: string;
  concepto: string;
  monto: string;
};

export function ReciboPagoPDF({ recibo, estudiante, concepto, monto }: ReciboPagoProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>RECIBO DE PAGO OFICIAL - ELC Las Flores</Text>
        <View style={styles.row}>
          <Text>No. Recibo: {recibo}</Text>
        </View>
        <View style={styles.row}>
          <Text>Recibi de: {estudiante}</Text>
        </View>
        <View style={styles.row}>
          <Text>Concepto: {concepto}</Text>
        </View>
        <View style={styles.row}>
          <Text>Monto: C$ {monto}</Text>
        </View>
      </Page>
    </Document>
  );
}
