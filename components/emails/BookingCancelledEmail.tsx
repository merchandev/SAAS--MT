import * as React from "react";
import {
  Body, Container, Head, Heading, Html, Preview,
  Section, Text, Hr, Link, Img, Row, Column,
} from "@react-email/components";

interface BookingCancelledEmailProps {
  customerName: string;
  publicCode: string;
  serviceDate: string;
  serviceTime: string;
  cancellationReason?: string;
}

export const BookingCancelledEmail = ({
  customerName,
  publicCode,
  serviceDate,
  serviceTime,
  cancellationReason,
}: BookingCancelledEmailProps) => (
  <Html>
    <Head />
    <Preview>Reserva #{publicCode} cancelada — Información importante</Preview>
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
          <Text style={badge}>❌ RESERVA CANCELADA</Text>
        </Section>

        <Section style={body}>
          <Heading style={h1}>Tu reserva ha sido cancelada</Heading>
          <Text style={text}>Hola <strong>{customerName}</strong>,</Text>
          <Text style={text}>
            Te informamos que la reserva <strong style={codeStyle}>#{publicCode}</strong> programada 
            para el <strong>{serviceDate}</strong> a las <strong>{serviceTime}</strong> ha sido cancelada.
          </Text>

          {cancellationReason && (
            <Section style={card}>
              <Text style={cardTitle}>📌 Motivo de la cancelación</Text>
              <Text style={reasonText}>{cancellationReason}</Text>
            </Section>
          )}

          <Section style={infoBox}>
            <Text style={infoBoxText}>
              💬 Si tienes alguna duda sobre esta cancelación o deseas realizar una nueva reserva, 
              no dudes en contactarnos. Estaremos encantados de ayudarte.
            </Text>
          </Section>

          <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
            <Link href="https://transfersinbarcelona.com/booking" style={button}>
              Hacer una nueva reserva →
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
const logo = { margin: "0 auto", display: "block" as const };
const headerTagline = { color: "#888", fontSize: "12px", letterSpacing: "2px", margin: "4px 0 0", textTransform: "uppercase" as const };
const badgeSection = { textAlign: "center" as const, backgroundColor: "#fef2f2", padding: "12px 0" };
const badge = { color: "#991b1b", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", margin: "0" };
const body = { padding: "32px 40px" };
const h1 = { color: "#0a0a0a", fontSize: "26px", fontWeight: "700", margin: "0 0 16px" };
const text = { color: "#4b5563", fontSize: "15px", lineHeight: "1.7", margin: "0 0 12px" };
const codeStyle = { color: "#D4AF37", fontFamily: "monospace" };
const card = { backgroundColor: "#f9fafb", borderRadius: "8px", padding: "20px 24px", border: "1px solid #e5e7eb", margin: "20px 0" };
const cardTitle = { color: "#111827", fontSize: "13px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1px", margin: "0 0 8px" };
const reasonText = { color: "#4b5563", fontSize: "14px", lineHeight: "1.6", margin: "0" };
const infoBox = { backgroundColor: "#f0f9ff", borderRadius: "8px", padding: "16px 20px", border: "1px solid #bae6fd", margin: "0 0 24px" };
const infoBoxText = { color: "#0c4a6e", fontSize: "13px", lineHeight: "1.6", margin: "0" };
const button = { backgroundColor: "#111827", borderRadius: "8px", color: "#D4AF37", display: "inline-block", fontSize: "14px", fontWeight: "700", padding: "14px 28px", textDecoration: "none" };
const hr = { borderColor: "#e5e7eb", margin: "0" };
const footer = { padding: "24px 40px", textAlign: "center" as const };
const footerText = { color: "#6b7280", fontSize: "13px", margin: "4px 0" };
const footerSmall = { color: "#9ca3af", fontSize: "11px", margin: "16px 0 0" };
const link = { color: "#D4AF37", textDecoration: "none" };

export default BookingCancelledEmail;
