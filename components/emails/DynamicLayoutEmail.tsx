import * as React from "react";
import {
  Body, Container, Head, Html, Preview,
  Section, Hr, Img, Text
} from "@react-email/components";

interface DynamicLayoutEmailProps {
  previewText?: string;
  dynamicHtml: string;
  contactPhone?: string;
}

export const DynamicLayoutEmail = ({
  previewText = "Novedades de Transfers in Barcelona",
  dynamicHtml,
  contactPhone = "+34 662 02 41 36"
}: DynamicLayoutEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* HEADER */}
          <Section style={header}>
            <Img
              src="https://transfersinbarcelona.com/images/MeTransfers-exp.png"
              width="176"
              height="41"
              alt="Transfers in Barcelona"
              style={logo}
            />
          </Section>

          {/* DYNAMIC CONTENT INJECTED HERE */}
          <Section style={contentSection}>
            <div dangerouslySetInnerHTML={{ __html: dynamicHtml }} />
          </Section>

          <Hr style={hr} />
          
          {/* FOOTER */}
          <Section style={footer}>
            <Text style={footerText}>
              ¿Necesitas ayuda? Responde a este correo o llámanos al{" "}
              <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} style={link}>{contactPhone}</a>
            </Text>
            <Text style={footerAddress}>
              Transfers in Barcelona<br />
              Passeig de Gràcia, 1, 08007 Barcelona, España
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default DynamicLayoutEmail;

const main = {
  backgroundColor: "#f3f4f6",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  maxWidth: "600px",
};

const header = {
  padding: "40px 32px",
  backgroundColor: "#111827",
  textAlign: "center" as const,
  borderBottom: "3px solid #D4AF37",
};

const logo = { 
  margin: "0 auto", 
  display: "block" as const 
};

const contentSection = {
  padding: "40px 32px",
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0 32px",
};

const footer = {
  padding: "32px",
  backgroundColor: "#f9fafb",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0",
};

const footerAddress = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "12px",
};

const link = {
  color: "#D4AF37",
  textDecoration: "none",
  fontWeight: "500",
};
