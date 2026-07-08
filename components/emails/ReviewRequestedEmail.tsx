import * as React from "react";
import {
  Body, Container, Head, Heading, Html, Preview,
  Section, Text, Hr, Link, Img,
} from "@react-email/components";

interface ReviewRequestedEmailProps {
  customerName: string;
  publicCode: string;
  reviewUrl: string;
  driverName?: string;
  serviceDate: string;
}

export const ReviewRequestedEmail = ({
  customerName,
  publicCode,
  reviewUrl,
  driverName,
  serviceDate,
}: ReviewRequestedEmailProps) => (
  <Html>
    <Head />
    <Preview>⭐ ¿Cómo fue tu traslado? Cuéntanos en 30 segundos</Preview>
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

        <Section style={starsSection}>
          <Text style={starsEmoji}>⭐⭐⭐⭐⭐</Text>
        </Section>

        <Section style={body}>
          <Heading style={h1}>¿Cómo fue tu traslado?</Heading>
          <Text style={text}>Hola <strong>{customerName}</strong>,</Text>
          <Text style={text}>
            Tu traslado del <strong>{serviceDate}</strong>{driverName ? ` con <strong>${driverName}</strong>` : ""} 
            {" "}ha finalizado. Nos encantaría conocer tu experiencia para seguir mejorando nuestro servicio.
          </Text>
          <Text style={text}>
            Solo te llevará <strong>30 segundos</strong>. Tu opinión es muy valiosa para nosotros.
          </Text>

          <Section style={{ textAlign: "center" as const, margin: "32px 0" }}>
            <Link href={reviewUrl} style={button}>
              ⭐ Valorar mi traslado
            </Link>
          </Section>

          <Section style={benefitsBox}>
            <Text style={benefitItem}>✅ Ayudas a otros viajeros a elegir bien</Text>
            <Text style={benefitItem}>✅ Contribuyes a mejorar nuestro servicio</Text>
            <Text style={benefitItem}>✅ Solo 30 segundos de tu tiempo</Text>
          </Section>

          <Text style={smallText}>
            Si el enlace no funciona, cópialo y pégalo en tu navegador:<br />
            <Link href={reviewUrl} style={linkSmall}>{reviewUrl}</Link>
          </Text>
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
const starsSection = { textAlign: "center" as const, padding: "20px 0 8px", backgroundColor: "#fffbeb" };
const starsEmoji = { fontSize: "32px", margin: "0", letterSpacing: "4px" };
const body = { padding: "32px 40px" };
const h1 = { color: "#0a0a0a", fontSize: "26px", fontWeight: "700", margin: "0 0 16px", textAlign: "center" as const };
const text = { color: "#4b5563", fontSize: "15px", lineHeight: "1.7", margin: "0 0 12px" };
const button = { background: "linear-gradient(135deg, #D4AF37 0%, #b5952f 100%)", borderRadius: "10px", color: "#000000", display: "inline-block", fontSize: "16px", fontWeight: "800", padding: "16px 36px", textDecoration: "none", letterSpacing: "0.5px", boxShadow: "0 4px 12px rgba(212,175,55,0.4)" };
const benefitsBox = { backgroundColor: "#f0fdf4", borderRadius: "8px", padding: "20px 24px", border: "1px solid #bbf7d0", margin: "24px 0" };
const benefitItem = { color: "#166534", fontSize: "14px", lineHeight: "1.8", margin: "0" };
const smallText = { color: "#9ca3af", fontSize: "12px", lineHeight: "1.6", margin: "16px 0 0", textAlign: "center" as const };
const linkSmall = { color: "#D4AF37", fontSize: "11px", wordBreak: "break-all" as const };
const hr = { borderColor: "#e5e7eb", margin: "0" };
const footer = { padding: "24px 40px", textAlign: "center" as const };
const footerText = { color: "#6b7280", fontSize: "13px", margin: "4px 0" };
const footerSmall = { color: "#9ca3af", fontSize: "11px", margin: "16px 0 0" };
const link = { color: "#D4AF37", textDecoration: "none" };

export default ReviewRequestedEmail;
