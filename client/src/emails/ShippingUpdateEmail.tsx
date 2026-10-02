import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
} from '@react-email/components';

interface ShippingUpdateEmailProps {
  orderId: string;
  trackingNumber: string;
  trackingUrl: string;
}

export default function ShippingUpdateEmail({
  orderId = 'ORD-12345',
  trackingNumber = 'TRK987654321',
  trackingUrl = 'https://directcrest.com/tracking/TRK987654321',
}: ShippingUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your DirectCrest Order has Shipped!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>DirectCrest</Heading>
          <Text style={text}>Great news! Your order is on the way.</Text>
          <Text style={text}>
            Order <strong>{orderId}</strong> has shipped and is now en route to your shipping address.
          </Text>

          <Section style={section}>
            <Heading as="h3" style={h3}>Tracking Information</Heading>
            <Text style={itemText}>Tracking Number: <strong>{trackingNumber}</strong></Text>
          </Section>

          <Section style={buttonContainer}>
            <Button href={trackingUrl} style={button}>
              Track Your Package
            </Button>
          </Section>

          <Text style={footer}>
            DirectCrest, 123 Sourcing Lane, Suite 100, Shenzhen & Global
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f8fafc',
  fontFamily: 'Inter, -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const h1 = {
  color: '#1e3a8a',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const h3 = {
  color: '#0f172a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 10px',
};

const itemText = {
  color: '#475569',
  fontSize: '15px',
  margin: '5px 0',
};

const section = {
  backgroundColor: '#f1f5f9',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#1e3a8a',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '30px',
};
