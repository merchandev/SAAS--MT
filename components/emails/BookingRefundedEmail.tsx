import * as React from "react";
import {
  Body, Container, Head, Heading, Html, Preview,
  Section, Text, Hr, Link, Row, Column,
} from "@react-email/components";

interface BookingRefundedEmailProps {
  customerName: string;
  publicCode: string;
  totalPrice: string;
  refundDays?: number;
}

export const BookingRefundedEmail = ({
  customerName,
  publicCode,
  totalPrice,
  refundDays = 5,
}: BookingRefundedEmailProps) => (
  <Html>
    <Head />
    <Preview>Reembolso procesado para tu reserva #{publicCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brandName}>TRANSFERS IN BARCELONA</Text>
          <Text style={headerTagline}>Traslados Privados de Lujo</Text>
        </Section>

        <Section style={badgeSection}>
          <Text style={badge}>💸 REEMBOLSO PROCESADO</Text>
        </Section>

        <Section style={body}>
          <Heading style={h1}>Tu reembolso está en camino</Heading>
          <Text style={text}>Hola <strong>{customerName}</strong>,</Text>
          <Text style={text}>
            Hemos procesado el reembolso correspondiente a tu reserva <strong style={codeStyle}>#{publicCode}</strong>. 
            El importe de <strong style={{ color: "#D4AF37" }}>{totalPrice}</strong> será devuelto a tu método de pago original.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>💳 Información del reembolso</Text>
            <Hr style={divider} />
            <Row style={detailRow}>
              <Column style={detailLabel}>Reserva</Column>
              <Column style={detailValue}><strong style={codeStyle}>{publicCode}</strong></Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Importe a devolver</Column>
              <Column style={{ ...detailValue, color: "#D4AF37", fontWeight: "700", fontSize: "16px" }}>{totalPrice}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Plazo estimado</Column>
              <Column style={detailValue}>{refundDays}–10 días hábiles</Column>
            </Row>
          </Section>

          <Section style={infoBox}>
            <Text style={infoBoxText}>
              ℹ️ Los plazos de reembolso dependen de tu entidad bancaria. Si pasados 10 días hábiles no has 
              recibido el importe, contacta con nosotros y lo gestionamos.
            </Text>
          </Section>
        </Section>

        <Hr style={hr} />
        <Section style={footer}>
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
const brandName = { color: "#D4AF37", fontSize: "22px", fontWeight: "800", letterSpacing: "4px", margin: "0", textTransform: "uppercase" as const };
const headerTagline = { color: "#888", fontSize: "12px", letterSpacing: "2px", margin: "4px 0 0", textTransform: "uppercase" as const };
const badgeSection = { textAlign: "center" as const, backgroundColor: "#f0fdf4", padding: "12px 0" };
const badge = { color: "#166534", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", margin: "0" };
const body = { padding: "32px 40px" };
const h1 = { color: "#0a0a0a", fontSize: "26px", fontWeight: "700", margin: "0 0 16px" };
const text = { color: "#4b5563", fontSize: "15px", lineHeight: "1.7", margin: "0 0 12px" };
const codeStyle = { color: "#D4AF37", fontFamily: "monospace" };
const card = { backgroundColor: "#f9fafb", borderRadius: "8px", padding: "24px", border: "1px solid #e5e7eb", margin: "24px 0" };
const cardTitle = { color: "#111827", fontSize: "14px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1px", margin: "0 0 12px" };
const divider = { borderColor: "#e5e7eb", margin: "12px 0" };
const detailRow = { margin: "8px 0" };
const detailLabel = { color: "#6b7280", fontSize: "13px", width: "45%" };
const detailValue = { color: "#111827", fontSize: "13px", fontWeight: "500" };
const infoBox = { backgroundColor: "#f0f9ff", borderRadius: "8px", padding: "16px 20px", border: "1px solid #bae6fd", margin: "0 0 24px" };
const infoBoxText = { color: "#0c4a6e", fontSize: "13px", lineHeight: "1.6", margin: "0" };
const hr = { borderColor: "#e5e7eb", margin: "0" };
const footer = { padding: "24px 40px", textAlign: "center" as const };
const footerText = { color: "#6b7280", fontSize: "13px", margin: "4px 0" };
const footerSmall = { color: "#9ca3af", fontSize: "11px", margin: "16px 0 0" };
const link = { color: "#D4AF37", textDecoration: "none" };

export default BookingRefundedEmail;
