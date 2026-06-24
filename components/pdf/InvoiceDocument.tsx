import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Tipos básicos para los datos
interface InvoiceProps {
  booking: any;
  customer: any;
  settings: Record<string, string>;
}

// Estilos
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#333" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 20 },
  headerLeft: { flexDirection: "column" },
  headerRight: { flexDirection: "column", alignItems: "flex-end" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e3a8a", marginBottom: 4 },
  companyName: { fontSize: 12, fontWeight: "bold", marginBottom: 2 },
  text: { fontSize: 10, color: "#4b5563", marginBottom: 2 },
  invoiceBox: { backgroundColor: "#f3f4f6", padding: 10, borderRadius: 4, marginTop: 10 },
  invoiceTitle: { fontSize: 10, fontWeight: "bold", color: "#1e3a8a" },
  invoiceValue: { fontSize: 12, fontWeight: "bold" },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 4, marginBottom: 8, fontWeight: "bold" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 8, marginBottom: 8 },
  col1: { width: "60%" },
  col2: { width: "20%", textAlign: "right" },
  col3: { width: "20%", textAlign: "right" },
  totalSection: { marginTop: 20, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", width: "40%", marginBottom: 4 },
  totalValue: { fontWeight: "bold", fontSize: 14, color: "#1e3a8a" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, textAlign: "center", fontSize: 9, color: "#9ca3af", borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10 }
});

export const InvoiceDocument = ({ booking, customer, settings }: InvoiceProps) => {
  const companyName = settings["COMPANY_NAME"] || "MeTransfers SL";
  const vatNumber = settings["COMPANY_VAT"] || "B-12345678";
  const supportEmail = settings["SUPPORT_EMAIL"] || "info@metransfers.com";
  
  const issueDate = new Date().toLocaleDateString("es-ES");
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>FACTURA</Text>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.text}>NIF: {vatNumber}</Text>
            <Text style={styles.text}>{supportEmail}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.invoiceBox}>
              <Text style={styles.invoiceTitle}>CÓDIGO DE RESERVA</Text>
              <Text style={styles.invoiceValue}>#{booking.publicCode.slice(0, 8).toUpperCase()}</Text>
            </View>
            <Text style={{ marginTop: 8, fontSize: 10 }}>Fecha de Emisión: {issueDate}</Text>
            <Text style={{ fontSize: 10 }}>Fecha de Servicio: {new Date(booking.serviceDate).toLocaleDateString("es-ES")}</Text>
          </View>
        </View>

        {/* CLIENTE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FACTURADO A:</Text>
          <Text style={{ fontWeight: "bold", fontSize: 11, marginBottom: 2 }}>{customer.fullName}</Text>
          <Text style={styles.text}>{customer.email}</Text>
          <Text style={styles.text}>{customer.phone || "Sin teléfono registrado"}</Text>
        </View>

        {/* DETALLE DEL TRAYECTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLE DEL SERVICIO</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Descripción del Trayecto</Text>
            <Text style={styles.col2}>Tipo</Text>
            <Text style={styles.col3}>Importe</Text>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.col1}>
              <Text style={{ fontWeight: "bold", marginBottom: 2 }}>Traslado Privado</Text>
              <Text style={styles.text}>Origen: {booking.originAddress}</Text>
              <Text style={styles.text}>Destino: {booking.destinationAddress}</Text>
              <Text style={styles.text}>Pasajeros: {booking.passengers} | Equipaje: {booking.luggage}</Text>
              {booking.flightNumber && <Text style={styles.text}>Vuelo: {booking.flightNumber}</Text>}
            </View>
            <Text style={styles.col2}>{booking.tripType}</Text>
            <Text style={styles.col3}>{Number(booking.basePrice).toFixed(2)} €</Text>
          </View>

          {/* DESCUENTOS Y RECARGOS SI APLICA */}
          {Number(booking.discountAmount) > 0 && (
            <View style={[styles.tableRow, { borderBottomWidth: 0, paddingBottom: 0, paddingTop: 4 }]}>
              <Text style={styles.col1}>Descuento aplicado</Text>
              <Text style={styles.col2}>-</Text>
              <Text style={[styles.col3, { color: "#ef4444" }]}>-{Number(booking.discountAmount).toFixed(2)} €</Text>
            </View>
          )}

          {Number(booking.surchargeAmount) > 0 && (
            <View style={[styles.tableRow, { borderBottomWidth: 0, paddingBottom: 0, paddingTop: 4 }]}>
              <Text style={styles.col1}>Recargos (Nocturnidad / Festivos)</Text>
              <Text style={styles.col2}>-</Text>
              <Text style={styles.col3}>+{Number(booking.surchargeAmount).toFixed(2)} €</Text>
            </View>
          )}
        </View>

        {/* TOTALES */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: "bold" }}>Base Imponible:</Text>
            <Text>{(Number(booking.finalPrice) / 1.10).toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: "bold" }}>IVA (10%):</Text>
            <Text>{(Number(booking.finalPrice) - (Number(booking.finalPrice) / 1.10)).toFixed(2)} €</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 10, borderTopWidth: 1, borderTopColor: "#000", paddingTop: 4 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>TOTAL FACTURA:</Text>
            <Text style={styles.totalValue}>{Number(booking.finalPrice).toFixed(2)} €</Text>
          </View>

          <View style={{ marginTop: 20, padding: 8, backgroundColor: "#dcfce7", borderRadius: 4, width: "40%", alignItems: "center" }}>
            <Text style={{ color: "#166534", fontWeight: "bold", fontSize: 12 }}>ESTADO: PAGADO</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>Gracias por confiar en {companyName}. Este documento es una factura electrónica válida.</Text>
          <Text>Generado el {new Date().toLocaleString("es-ES")}</Text>
        </View>

      </Page>
    </Document>
  );
};
