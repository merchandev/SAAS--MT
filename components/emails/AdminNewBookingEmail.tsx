import * as React from "react";
import {
  Body, Container, Head, Heading, Html, Preview,
  Section, Text, Hr, Link, Img, Row, Column,
} from "@react-email/components";

interface AdminNewBookingEmailProps {
  publicCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  originAddress: string;
  destinationAddress: string;
  serviceDate: string;
  serviceTime: string;
  passengers: number;
  vehicleName: string;
  totalPrice: string;
  adminUrl: string;
}

export const AdminNewBookingEmail = ({
  publicCode,
  customerName,
  customerEmail,
  customerPhone,
  originAddress,
  destinationAddress,
  serviceDate,
  serviceTime,
  passengers,
  vehicleName,
  totalPrice,
  adminUrl,
}: AdminNewBookingEmailProps) => (
  <Html>
    <Head />
    <Preview>🔔 Nueva reserva #{publicCode} — {customerName} · {serviceDate}</Preview>
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
          <Text style={headerTagline}>Panel de Administración</Text>
        </Section>

        <Section style={badgeSection}>
          <Text style={badge}>🔔 NUEVA RESERVA RECIBIDA</Text>
        </Section>

        <Section style={body}>
          <Heading style={h1}>Nueva reserva pendiente de confirmación</Heading>
          <Text style={text}>
            Se ha recibido una nueva reserva que requiere tu confirmación.
          </Text>

          {/* Cliente */}
          <Section style={card}>
            <Text style={cardTitle}>👤 Datos del cliente</Text>
            <Hr style={divider} />
            <Row style={detailRow}>
              <Column style={detailLabel}>Nombre</Column>
              <Column style={detailValue}><strong>{customerName}</strong></Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Email</Column>
              <Column style={detailValue}><Link href={`mailto:${customerEmail}`} style={link}>{customerEmail}</Link></Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Teléfono</Column>
              <Column style={detailValue}><Link href={`tel:${customerPhone}`} style={link}>{customerPhone}</Link></Column>
            </Row>
          </Section>

          {/* Viaje */}
          <Section style={card}>
            <Text style={cardTitle}>🗺️ Detalles del traslado</Text>
            <Hr style={divider} />
            <Row style={detailRow}>
              <Column style={detailLabel}>Código</Column>
              <Column style={detailValue}><strong style={codeStyle}>{publicCode}</strong></Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>📅 Fecha</Column>
              <Column style={detailValue}><strong>{serviceDate}</strong></Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>🕐 Hora</Column>
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
            <Row style={detailRow}>
              <Column style={detailLabel}>🚙 Vehículo</Column>
              <Column style={detailValue}>{vehicleName}</Column>
            </Row>
            <Hr style={divider} />
            <Row style={detailRow}>
              <Column style={detailLabel}><strong>💰 Total cobrado</strong></Column>
              <Column style={{ ...detailValue, color: "#D4AF37", fontSize: "18px", fontWeight: "700" }}>{totalPrice}</Column>
            </Row>
          </Section>

          <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
            <Link href={adminUrl} style={button}>
              Ver y Confirmar Reserva →
            </Link>
          </Section>
        </Section>

        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerSmall}>Este email es solo para uso interno del equipo de Transfers in Barcelona.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: "#f4f4f5", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };
const container = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" };
const header = { background: "linear-gradient(135deg, #1e3a5f 0%, #0f2340 100%)", padding: "32px 40px", textAlign: "center" as const };
const logo = { margin: "0 auto", display: "block" as const };
const headerTagline = { color: "#93b4d4", fontSize: "12px", letterSpacing: "2px", margin: "4px 0 0", textTransform: "uppercase" as const };
const badgeSection = { textAlign: "center" as const, backgroundColor: "#eff6ff", padding: "12px 0" };
const badge = { color: "#1e3a8a", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", margin: "0" };
const body = { padding: "32px 40px" };
const h1 = { color: "#0a0a0a", fontSize: "22px", fontWeight: "700", margin: "0 0 12px" };
const text = { color: "#4b5563", fontSize: "15px", lineHeight: "1.7", margin: "0 0 16px" };
const card = { backgroundColor: "#f9fafb", borderRadius: "8px", padding: "24px", border: "1px solid #e5e7eb", margin: "0 0 16px" };
const cardTitle = { color: "#111827", fontSize: "14px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1px", margin: "0 0 12px" };
const divider = { borderColor: "#e5e7eb", margin: "12px 0" };
const detailRow = { margin: "8px 0" };
const detailLabel = { color: "#6b7280", fontSize: "13px", width: "40%" };
const detailValue = { color: "#111827", fontSize: "13px", fontWeight: "500" };
const codeStyle = { color: "#D4AF37", fontFamily: "monospace", fontSize: "15px" };
const button = { backgroundColor: "#1e3a5f", borderRadius: "8px", color: "#D4AF37", display: "inline-block", fontSize: "14px", fontWeight: "700", padding: "14px 28px", textDecoration: "none" };
const hr = { borderColor: "#e5e7eb", margin: "0" };
const footer = { padding: "20px 40px", textAlign: "center" as const };
const footerSmall = { color: "#9ca3af", fontSize: "11px", margin: "0" };
const link = { color: "#D4AF37", textDecoration: "none" };

export default AdminNewBookingEmail;
