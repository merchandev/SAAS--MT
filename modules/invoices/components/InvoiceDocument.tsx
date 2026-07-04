import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Opcional: Registrar fuentes personalizadas para el PDF
// Font.register({
//   family: 'Inter',
//   src: 'URL_TO_INTER_TTF_O_WOFF'
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  logoContainer: {
    width: 150,
  },
  logoText: {
    fontSize: 24,
    color: "#0B0C10",
    fontWeight: "bold",
  },
  logoSub: {
    fontSize: 10,
    color: "#D4AF37", // Dorado
    marginTop: 2,
  },
  companyDetails: {
    alignItems: "flex-end",
    fontSize: 10,
    color: "#555555",
    lineHeight: 1.5,
  },
  companyName: {
    fontWeight: "bold",
    color: "#0B0C10",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    paddingBottom: 10,
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 28,
    color: "#0B0C10",
    fontWeight: "bold",
  },
  invoiceMeta: {
    alignItems: "flex-end",
    fontSize: 10,
    color: "#555",
  },
  metaValue: {
    fontWeight: "bold",
    color: "#0B0C10",
  },
  customerContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0B0C10",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  customerDetails: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#333",
  },
  tripContainer: {
    marginBottom: 30,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 4,
  },
  tripRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  tripLabel: {
    width: 100,
    fontSize: 10,
    color: "#666",
  },
  tripValue: {
    flex: 1,
    fontSize: 10,
    color: "#0B0C10",
    fontWeight: "bold",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "75%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#eeeeee",
    backgroundColor: "#0B0C10",
    padding: 8,
  },
  tableColHeaderRight: {
    width: "25%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#eeeeee",
    backgroundColor: "#0B0C10",
    padding: 8,
    alignItems: "flex-end",
  },
  tableCol: {
    width: "75%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#eeeeee",
    padding: 8,
  },
  tableColRight: {
    width: "25%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#eeeeee",
    padding: 8,
    alignItems: "flex-end",
  },
  tableCellHeader: {
    margin: 2,
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  tableCell: {
    margin: 2,
    fontSize: 10,
    color: "#333333",
  },
  tableCellRight: {
    margin: 2,
    fontSize: 10,
    color: "#333333",
    fontWeight: "bold",
  },
  totalsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalsBox: {
    width: 250,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  totalsLabel: {
    fontSize: 10,
    color: "#666",
  },
  totalsValue: {
    fontSize: 10,
    color: "#0B0C10",
    fontWeight: "bold",
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 4,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 8,
  },
  totalFinalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0B0C10",
  },
  totalFinalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#D4AF37",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#888",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingTop: 10,
  },
});

type InvoiceProps = {
  invoice: any;
};

export const InvoiceDocument = ({ invoice }: InvoiceProps) => {
  const { booking, customer } = invoice;
  
  const fmtCurrency = (val: any) => `${Number(val).toFixed(2)} €`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header: Logo and Company Info */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Transfers in Barcelona</Text>
            <Text style={styles.logoSub}>Premium Chauffeur Service</Text>
          </View>
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>Metransfers S.L.</Text>
            <Text>NIF: B-12345678</Text>
            <Text>Calle Falsa 123, Palma de Mallorca</Text>
            <Text>07001 Islas Baleares, España</Text>
            <Text>info@transfersinbarcelona.com</Text>
          </View>
        </View>

        {/* Title and Meta */}
        <View style={styles.titleContainer}>
          <Text style={styles.invoiceTitle}>FACTURA</Text>
          <View style={styles.invoiceMeta}>
            <Text>Nº de Factura: <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text></Text>
            <Text>Fecha de Emisión: <Text style={styles.metaValue}>{format(new Date(invoice.issuedAt), "dd/MM/yyyy")}</Text></Text>
            <Text>Localizador Reserva: <Text style={styles.metaValue}>{booking.publicCode}</Text></Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerContainer}>
          <Text style={styles.sectionTitle}>Facturado a:</Text>
          <View style={styles.customerDetails}>
            <Text style={{ fontWeight: "bold", color: "#0B0C10" }}>{customer.fullName}</Text>
            <Text>{customer.email}</Text>
            {customer.phone && <Text>{customer.phone}</Text>}
            {customer.country && <Text>{customer.country}</Text>}
          </View>
        </View>

        {/* Trip Summary */}
        <View style={styles.tripContainer}>
          <Text style={styles.sectionTitle}>Detalles del Servicio</Text>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Fecha/Hora:</Text>
            <Text style={styles.tripValue}>
              {format(new Date(booking.serviceDate), "dd/MM/yyyy")} a las {booking.serviceTime}
            </Text>
          </View>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Origen:</Text>
            <Text style={styles.tripValue}>{booking.originAddress}</Text>
          </View>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Destino:</Text>
            <Text style={styles.tripValue}>{booking.destinationAddress}</Text>
          </View>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Vehículo:</Text>
            <Text style={styles.tripValue}>{booking.vehicle?.name}</Text>
          </View>
        </View>

        {/* Breakdown Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Descripción</Text></View>
            <View style={styles.tableColHeaderRight}><Text style={styles.tableCellHeader}>Importe</Text></View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Traslado Privado - {booking.distanceKm} km</Text></View>
            <View style={styles.tableColRight}><Text style={styles.tableCellRight}>{fmtCurrency(booking.basePrice)}</Text></View>
          </View>

          {Number(booking.surchargeAmount) > 0 && (
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Suplementos (Nocturno/Aeropuerto)</Text></View>
              <View style={styles.tableColRight}><Text style={styles.tableCellRight}>{fmtCurrency(booking.surchargeAmount)}</Text></View>
            </View>
          )}

          {Number(booking.discountAmount) > 0 && (
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Descuento Aplicado</Text></View>
              <View style={styles.tableColRight}><Text style={styles.tableCellRight}>-{fmtCurrency(booking.discountAmount)}</Text></View>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Base Imponible:</Text>
              <Text style={styles.totalsValue}>{fmtCurrency(invoice.subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>IVA (21%):</Text>
              <Text style={styles.totalsValue}>{fmtCurrency(invoice.taxAmount)}</Text>
            </View>
            <View style={styles.totalFinalRow}>
              <Text style={styles.totalFinalLabel}>TOTAL FACTURA:</Text>
              <Text style={styles.totalFinalValue}>{fmtCurrency(invoice.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Gracias por confiar en Metransfers S.L. Para cualquier duda respecto a esta factura, por favor contacte a info@transfersinbarcelona.com. Esta factura ha sido generada automáticamente y es válida sin firma.
        </Text>
      </Page>
    </Document>
  );
};
