import * as React from "react";
import {
  Body, Container, Head, Heading, Html, Preview,
  Section, Text, Hr, Link, Img, Row, Column,
} from "@react-email/components";

interface BookingConfirmedEmailProps {
  customerName: string;
  publicCode: string;
  originAddress: string;
  destinationAddress: string;
  serviceDate: string;
  serviceTime: string;
  passengers: number;
  totalPrice: string;
  receiptUrl?: string;
}

export const BookingConfirmedEmail = ({
  customerName,
  publicCode,
  originAddress,
  destinationAddress,
  serviceDate,
  serviceTime,
  passengers,
  totalPrice,
  receiptUrl,
}: BookingConfirmedEmailProps) => (
  <Html>
    <Head />
    <Preview>✅ Tu traslado #{publicCode} está confirmado — ¡Nos vemos pronto!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src="https://transfersinbarcelona.com/images/MeTransfers-exp.png"
            width="176"
            height="41"
            alt="Transfers in Barcelona"
            style={logo}
          />
          <Text style={headerTagline}>Traslados Privados de Lujo</Text>
        </Section>

        <Section style={badgeSection}>
          <Text style={badge}>✅ RESERVA CONFIRMADA</Text>
        </Section>

        <Section style={body}>
          <Heading style={h1}>¡Tu traslado está confirmado!</Heading>
          <Text style={text}>Hola <strong>{customerName}</strong>,</Text>
          <Text style={text}>
            Nos complace confirmar tu reserva. Nuestro equipo profesional estará listo para recibirte 
            puntualmente. Puedes contactarnos en cualquier momento si necesitas hacer algún cambio.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>📋 Detalles confirmados</Text>
            <Hr style={divider} />
            <Row style={detailRow}>
              <Column style={detailLabel}>Código de reserva</Column>
              <Column style={detailValue}><strong style={codeStyle}>{publicCode}</strong></Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>📅 Fecha</Column>
              <Column style={detailValue}>{serviceDate}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>🕐 Hora de recogida</Column>
              <Column style={detailValue}><strong>{serviceTime}</strong></Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>🛫 Origen</Column>
              <Column style={detailValue}>{originAddress}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>🛬 Destino</Column>
              <Column style={detailValue}>{destinationAddress}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>👥 Pasajeros</Column>
              <Column style={detailValue}>{passengers}</Column>
            </Row>
            <Hr style={divider} />
            <Row style={detailRow}>
              <Column style={detailLabel}><strong>💰 Total</strong></Column>
              <Column style={{ ...detailValue, color: "#D4AF37", fontSize: "18px", fontWeight: "700" }}>{totalPrice}</Column>
            </Row>
          </Section>

          <Section style={infoBox}>
            <Text style={infoBoxText}>
              🚗 <strong>Nuestro conductor te esperará</strong> con un cartel con tu nombre en el punto de recogida. 
              Te contactaremos la noche anterior para confirmarte los detalles finales.
            </Text>
          </Section>

          {receiptUrl && (
            <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
              <Link href={receiptUrl} style={button}>Ver mi recibo seguro →</Link>
            </Section>
          )}
        </Section>

        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>¿Necesitas modificar tu reserva?</Text>
          <Text style={footerText}>
            <Link href="mailto:info@transfersinbarcelona.com" style={link}>info@transfersinbarcelona.com</Link>
            {" · "}
            <Link href="tel:+34662024136" style={link}>+34 662 02 41 36</Link>
          </Text>
          <Text style={footerSmall}>© {new Date().getFullYear()} Transfers in Barcelona · Barcelona, España</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: "#f4f4f5", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };
const container = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" };
const header = { background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)", padding: "32px 40px", textAlign: "center" as const };
const logo = { margin: "0 auto", display: "block" as const };
const headerTagline = { color: "#888", fontSize: "12px", letterSpacing: "2px", margin: "4px 0 0", textTransform: "uppercase" as const };
const badgeSection = { textAlign: "center" as const, backgroundColor: "#f0fdf4", padding: "12px 0" };
const badge = { color: "#166534", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", margin: "0" };
const body = { padding: "32px 40px" };
const h1 = { color: "#0a0a0a", fontSize: "26px", fontWeight: "700", margin: "0 0 16px" };
const text = { color: "#4b5563", fontSize: "15px", lineHeight: "1.7", margin: "0 0 12px" };
const card = { backgroundColor: "#f9fafb", borderRadius: "8px", padding: "24px", border: "1px solid #e5e7eb", margin: "24px 0" };
const cardTitle = { color: "#111827", fontSize: "14px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1px", margin: "0 0 12px" };
const divider = { borderColor: "#e5e7eb", margin: "12px 0" };
const detailRow = { margin: "8px 0" };
const detailLabel = { color: "#6b7280", fontSize: "13px", width: "45%" };
const detailValue = { color: "#111827", fontSize: "13px", fontWeight: "500" };
const codeStyle = { color: "#D4AF37", fontSize: "15px", fontFamily: "monospace" };
const infoBox = { backgroundColor: "#fffbeb", borderRadius: "8px", padding: "16px 20px", border: "1px solid #fde68a", margin: "0 0 24px" };
const infoBoxText = { color: "#78350f", fontSize: "13px", lineHeight: "1.6", margin: "0" };
const button = { backgroundColor: "#D4AF37", borderRadius: "8px", color: "#000000", display: "inline-block", fontSize: "14px", fontWeight: "700", padding: "14px 28px", textDecoration: "none", letterSpacing: "0.5px" };
const hr = { borderColor: "#e5e7eb", margin: "0" };
const footer = { padding: "24px 40px", textAlign: "center" as const };
const footerText = { color: "#6b7280", fontSize: "13px", margin: "4px 0" };
const footerSmall = { color: "#9ca3af", fontSize: "11px", margin: "16px 0 0" };
const link = { color: "#D4AF37", textDecoration: "none" };

export default BookingConfirmedEmail;
