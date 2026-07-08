import * as React from "react";
import {
  Body, Container, Head, Heading, Html, Preview,
  Section, Text, Hr, Link, Row, Column,
} from "@react-email/components";

interface TripStartedEmailProps {
  customerName: string;
  publicCode: string;
  driverName: string;
  driverPhone?: string;
  vehicleName?: string;
  originAddress: string;
  serviceTime: string;
}

export const TripStartedEmail = ({
  customerName,
  publicCode,
  driverName,
  driverPhone,
  vehicleName,
  originAddress,
  serviceTime,
}: TripStartedEmailProps) => (
  <Html>
    <Head />
    <Preview>🚗 Tu conductor está en camino — Reserva #{publicCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brandName}>TRANSFERS IN BARCELONA</Text>
          <Text style={headerTagline}>Traslados Privados de Lujo</Text>
        </Section>

        <Section style={badgeSection}>
          <Text style={badge}>🚗 VIAJE EN CURSO</Text>
        </Section>

        <Section style={body}>
          <Heading style={h1}>¡Tu conductor está en camino!</Heading>
          <Text style={text}>Hola <strong>{customerName}</strong>,</Text>
          <Text style={text}>
            Tu traslado <strong style={codeStyle}>#{publicCode}</strong> ha comenzado. 
            Tu conductor profesional ya se dirige al punto de recogida.
          </Text>

          <Section style={driverCard}>
            <Text style={driverCardTitle}>🧑‍✈️ Tu conductor</Text>
            <Hr style={divider} />
            <Row style={detailRow}>
              <Column style={detailLabel}>Conductor</Column>
              <Column style={detailValue}><strong>{driverName}</strong></Column>
            </Row>
            {driverPhone && (
              <Row style={detailRow}>
                <Column style={detailLabel}>📱 Teléfono</Column>
                <Column style={detailValue}>
                  <Link href={`tel:${driverPhone}`} style={phoneLink}>{driverPhone}</Link>
                </Column>
              </Row>
            )}
            {vehicleName && (
              <Row style={detailRow}>
                <Column style={detailLabel}>🚙 Vehículo</Column>
                <Column style={detailValue}>{vehicleName}</Column>
              </Row>
            )}
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>📍 Detalles del viaje</Text>
            <Hr style={divider} />
            <Row style={detailRow}>
              <Column style={detailLabel}>Punto de recogida</Column>
              <Column style={detailValue}>{originAddress}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Hora acordada</Column>
              <Column style={detailValue}><strong>{serviceTime}</strong></Column>
            </Row>
          </Section>

          <Section style={infoBox}>
            <Text style={infoBoxText}>
              ℹ️ Si necesitas contactar con tu conductor o tienes algún imprevisto, llama directamente 
              al número indicado o contáctanos a través de WhatsApp.
            </Text>
          </Section>

          <Section style={{ textAlign: "center" as const }}>
            <Link href="https://wa.me/34662024136" style={waButton}>
              💬 Contactar por WhatsApp
            </Link>
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
const badgeSection = { textAlign: "center" as const, backgroundColor: "#fffbeb", padding: "12px 0" };
const badge = { color: "#92400e", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", margin: "0" };
const body = { padding: "32px 40px" };
const h1 = { color: "#0a0a0a", fontSize: "26px", fontWeight: "700", margin: "0 0 16px" };
const text = { color: "#4b5563", fontSize: "15px", lineHeight: "1.7", margin: "0 0 12px" };
const codeStyle = { color: "#D4AF37", fontFamily: "monospace" };
const driverCard = { background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", borderRadius: "10px", padding: "20px 24px", margin: "24px 0" };
const driverCardTitle = { color: "#D4AF37", fontSize: "14px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1px", margin: "0 0 12px" };
const card = { backgroundColor: "#f9fafb", borderRadius: "8px", padding: "24px", border: "1px solid #e5e7eb", margin: "0 0 24px" };
const cardTitle = { color: "#111827", fontSize: "14px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1px", margin: "0 0 12px" };
const divider = { borderColor: "#374151", margin: "12px 0" };
const detailRow = { margin: "8px 0" };
const detailLabel = { color: "#9ca3af", fontSize: "13px", width: "45%" };
const detailValue = { color: "#f9fafb", fontSize: "13px", fontWeight: "500" };
const phoneLink = { color: "#D4AF37", textDecoration: "none", fontWeight: "700" };
const infoBox = { backgroundColor: "#f0f9ff", borderRadius: "8px", padding: "16px 20px", border: "1px solid #bae6fd", margin: "0 0 24px" };
const infoBoxText = { color: "#0c4a6e", fontSize: "13px", lineHeight: "1.6", margin: "0" };
const waButton = { backgroundColor: "#25D366", borderRadius: "8px", color: "#ffffff", display: "inline-block", fontSize: "14px", fontWeight: "700", padding: "12px 24px", textDecoration: "none" };
const hr = { borderColor: "#e5e7eb", margin: "0" };
const footer = { padding: "24px 40px", textAlign: "center" as const };
const footerText = { color: "#6b7280", fontSize: "13px", margin: "4px 0" };
const footerSmall = { color: "#9ca3af", fontSize: "11px", margin: "16px 0 0" };
const link = { color: "#D4AF37", textDecoration: "none" };

export default TripStartedEmail;
