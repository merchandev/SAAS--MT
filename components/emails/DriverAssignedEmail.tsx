import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface DriverAssignedEmailProps {
  customerName: string;
  publicCode: string;
  driverName?: string;
  driverPhone?: string;
  originAddress: string;
  serviceDate: string;
  serviceTime: string;
}

export const DriverAssignedEmail = ({
  customerName,
  publicCode,
  driverName = "nuestro conductor asignado",
  driverPhone,
  originAddress,
  serviceDate,
  serviceTime,
}: DriverAssignedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Conductor asignado para tu traslado {publicCode}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Conductor Asignado!</Heading>
          
          <Text style={text}>Hola {customerName},</Text>
          <Text style={text}>
            Queremos informarte que ya hemos asignado a <strong>{driverName}</strong> para tu próximo traslado con el código <strong>{publicCode}</strong>.
          </Text>

          <Section style={detailsSection}>
            <Text style={detailText}><strong>Punto de Recogida:</strong> {originAddress}</Text>
            <Text style={detailText}><strong>Fecha:</strong> {serviceDate}</Text>
            <Text style={detailText}><strong>Hora de recogida:</strong> {serviceTime}</Text>
            {driverPhone && (
              <Text style={detailText}><strong>Teléfono del conductor:</strong> {driverPhone}</Text>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Nuestro conductor estará esperando por ti a la hora acordada en el punto de recogida. 
            Si necesitas comunicarte con nosotros antes del servicio, responde a este correo.
          </Text>
          <Text style={footer}>
            Transfers in Barcelona - Viaja seguro y puntual.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Estilos básicos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  maxWidth: '600px',
};

const h1 = {
  color: '#2b6cb0',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.2',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const detailsSection = {
  backgroundColor: '#ebf8ff',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px 0',
  border: '1px solid #bee3f8',
};

const detailText = {
  color: '#2c5282',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 8px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
};

const footer = {
  color: '#a0aec0',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

export default DriverAssignedEmail;
