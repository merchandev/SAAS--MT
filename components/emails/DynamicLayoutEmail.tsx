import * as React from "react";
import {
  Body, Container, Head, Html, Preview,
  Section, Hr, Img, Text
} from "@react-email/components";

interface DynamicLayoutEmailProps {
  previewText?: string;
  dynamicHtml: string;
}

export const DynamicLayoutEmail = ({
  previewText = "Novedades de Transfers in Barcelona",
  dynamicHtml,
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
              <a href="tel:+34900000000" style={link}>+34 900 000 000</a>
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
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "32px",
  backgroundColor: "#000000",
  textAlign: "center" as const,
};

const logo = { 
  margin: "0 auto", 
  display: "block" as const 
};

const contentSection = {
  padding: "32px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  padding: "0 32px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "12px",
};

const footerAddress = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "12px",
};

const link = {
  color: "#D4AF37",
  textDecoration: "underline",
};
