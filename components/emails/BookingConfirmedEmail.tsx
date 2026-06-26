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
  Link,
} from '@react-email/components';

interface BookingConfirmedEmailProps {
  customerName: string;
  publicCode: string;
  originAddress: string;
  destinationAddress: string;
  serviceDate: string;
  serviceTime: string;
  passengers: number;
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
  receiptUrl,
}: BookingConfirmedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu reserva de traslado con MeTransfers ha sido confirmada</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Reserva Confirmada!</Heading>
          
          <Text style={text}>Hola {customerName},</Text>
          <Text style={text}>
            Tu reserva ha sido recibida y confirmada con éxito. A continuación, encontrarás los detalles de tu viaje:
          </Text>

          <Section style={detailsSection}>
            <Text style={detailText}><strong>Código de Reserva:</strong> {publicCode}</Text>
            <Text style={detailText}><strong>Fecha:</strong> {serviceDate}</Text>
            <Text style={detailText}><strong>Hora:</strong> {serviceTime}</Text>
            <Text style={detailText}><strong>Origen:</strong> {originAddress}</Text>
            <Text style={detailText}><strong>Destino:</strong> {destinationAddress}</Text>
            <Text style={detailText}><strong>Pasajeros:</strong> {passengers}</Text>
          </Section>

          {receiptUrl && (
            <Section style={actionSection}>
              <Link href={receiptUrl} style={buttonLink}>
                Ver recibo seguro
              </Link>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Si tienes alguna pregunta o necesitas realizar cambios, puedes contactarnos respondiendo a este correo o mediante nuestro sitio web.
          </Text>
          <Text style={footer}>
            Gracias por elegir MeTransfers.
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
  color: '#1a202c',
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
  backgroundColor: '#f7fafc',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px 0',
};

const actionSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const buttonLink = {
  backgroundColor: '#1a202c',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '12px 18px',
  textDecoration: 'none',
};

const detailText = {
  color: '#2d3748',
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

export default BookingConfirmedEmail;
