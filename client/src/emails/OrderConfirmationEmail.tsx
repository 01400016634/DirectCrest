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
  Row,
  Column,
  Hr,
} from '@react-email/components';

interface OrderConfirmationEmailProps {
  orderId: string;
  total: number;
  shippingAddress: string;
  items: { name: string; quantity: number; price: number }[];
}

export default function OrderConfirmationEmail({
  orderId = 'ORD-12345',
  total = 0,
  shippingAddress = '',
  items = [],
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your DirectCrest Order Confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>DirectCrest</Heading>
          <Text style={text}>Welcome back for your purchase!</Text>
          <Text style={text}>
            Your order <strong>{orderId}</strong> is currently being processed. We will send you another email when it ships.
          </Text>
          <Text style={text}>
            Visit our website at <a href="https://directcrest.com" style={{ color: '#1e3a8a', textDecoration: 'none', fontWeight: 'bold' }}>directcrest.com</a> for more updates and exciting deals!
          </Text>

          <Section style={section}>
            <Heading as="h3" style={h3}>Order Summary</Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column>
                  <Text style={itemText}>{item.name} x {item.quantity}</Text>
                </Column>
                <Column align="right">
                  <Text style={itemText}>${(item.price * item.quantity).toFixed(2)}</Text>
                </Column>
              </Row>
            ))}
            <Hr style={hr} />
            <Row>
              <Column>
                <Text style={boldText}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={boldText}>${total.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={section}>
            <Heading as="h3" style={h3}>Shipping Address</Heading>
            <Text style={text}>{shippingAddress}</Text>
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

const boldText = {
  color: '#0f172a',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '5px 0',
};

const section = {
  backgroundColor: '#f1f5f9',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px 0',
};

const itemRow = {
  width: '100%',
};

const hr = {
  borderColor: '#cbd5e1',
  margin: '15px 0',
};

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '30px',
};
