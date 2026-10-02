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
  Button,
} from '@react-email/components';

interface SourcingQuoteEmailProps {
  requestTitle: string;
  quotePrice: number;
  estimatedShipping: number;
  requestUrl: string;
}

export default function SourcingQuoteEmail({
  requestTitle = 'Custom Product Request',
  quotePrice = 0,
  estimatedShipping = 0,
  requestUrl = 'https://directcrest.com/account',
}: SourcingQuoteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your DirectCrest Sourcing Quote is Ready</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>DirectCrest Sourcing</Heading>
          <Text style={text}>Great news! Your sourcing quote is ready.</Text>
          <Text style={text}>
            We have reviewed your request for <strong>{requestTitle}</strong> and have prepared a custom quote for you.
          </Text>

          <Section style={section}>
            <Heading as="h3" style={h3}>Quote Details</Heading>
            <Row style={row}>
              <Column>
                <Text style={itemText}>Product Price</Text>
              </Column>
              <Column align="right">
                <Text style={itemText}>${quotePrice.toFixed(2)}</Text>
              </Column>
            </Row>
            <Row style={row}>
              <Column>
                <Text style={itemText}>Estimated Shipping</Text>
              </Column>
              <Column align="right">
                <Text style={itemText}>${estimatedShipping.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={buttonContainer}>
            <Button href={requestUrl} style={button}>
              View Quote Details
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

const row = {
  width: '100%',
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
