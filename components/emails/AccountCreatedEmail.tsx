import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AccountCreatedEmailProps {
  customerName: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}

export const AccountCreatedEmail = ({
  customerName,
  email,
  temporaryPassword,
  loginUrl,
}: AccountCreatedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a MeTransfers - Datos de acceso a tu cuenta</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Bienvenido a MeTransfers, {customerName}!</Heading>
          
          <Text style={text}>
            Gracias por confiar en nosotros para tu traslado. Hemos creado automáticamente una cuenta para ti para que puedas gestionar tus reservas más fácilmente.
          </Text>

          <Section style={credentialsSection}>
            <Text style={text}>Tus credenciales de acceso temporal son:</Text>
            <Text style={credentialItem}>
              <strong>Usuario / Email:</strong> {email}
            </Text>
            <Text style={credentialItem}>
              <strong>Contraseña Temporal:</strong> {temporaryPassword}
            </Text>
          </Section>

          <Text style={warningText}>
            * Por motivos de seguridad, te recomendamos iniciar sesión y cambiar esta contraseña lo antes posible desde tu perfil.
          </Text>

          <Section style={btnContainer}>
            <Link style={button} href={loginUrl}>
              Iniciar Sesión
            </Link>
          </Section>

          <Text style={footer}>
            Si tienes alguna pregunta, no dudes en responder a este correo.
            <br />
            El equipo de MeTransfers
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AccountCreatedEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  maxWidth: "600px",
  border: "1px solid #eee",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "20px",
};

const credentialsSection = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "6px",
  marginBottom: "20px",
  borderLeft: "4px solid #D4AF37",
};

const credentialItem = {
  color: "#333",
  fontSize: "16px",
  margin: "8px 0",
};

const warningText = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "20px",
  fontStyle: "italic",
  marginBottom: "30px",
};

const btnContainer = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const button = {
  backgroundColor: "#111111",
  borderRadius: "6px",
  color: "#D4AF37",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 30px",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
};
