import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to DirectCrest!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>DirectCrest</Heading>
          <Text style={text}>
            Welcome to DirectCrest, {name}! We are thrilled to have you on board. Explore our interactive 3D catalog and experience a new standard in factory-direct sourcing.
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} DirectCrest. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '10px',
  border: '1px solid #e6ebf1',
};

const h1 = {
  color: '#ffffff',
  backgroundColor: '#dc2626',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 30px',
};

const footer = {
  padding: '0 30px',
  marginTop: '40px',
  borderTop: '1px solid #e6ebf1',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '20px',
};
