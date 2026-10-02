import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import * as React from 'react';
import { Html, Head, Preview, Body, Container, Heading, Text, Section } from '@react-email/components';

const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px', borderRadius: '10px', border: '1px solid #e6ebf1' };
const h1 = { color: '#ffffff', backgroundColor: '#dc2626', padding: '20px', textAlign: 'center' as const, margin: '0 0 20px 0' };
const text = { color: '#525f7f', fontSize: '16px', lineHeight: '24px', padding: '0 30px' };
const footer = { padding: '0 30px', marginTop: '40px', borderTop: '1px solid #e6ebf1', textAlign: 'center' as const };
const footerText = { color: '#8898aa', fontSize: '12px', marginTop: '20px' };

export async function POST(req: Request) {
  try {
    const { name, email, orderId, urgency, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Send the email to the support team
    await sendEmail({
      to: 'reajulhasan3230@gmail.com',
      subject: `[${urgency.toUpperCase()}] New Support Request from ${name}`,
      react: React.createElement(
        Html,
        null,
        React.createElement(Head, null),
        React.createElement(Preview, null, 'New Support Request'),
        React.createElement(
          Body,
          { style: main },
          React.createElement(
            Container,
            { style: container },
            React.createElement(Heading, { style: h1 }, 'New Support Request'),
            React.createElement(Text, { style: text }, React.createElement('strong', null, 'Name: '), name),
            React.createElement(Text, { style: text }, React.createElement('strong', null, 'Email: '), email),
            React.createElement(Text, { style: text }, React.createElement('strong', null, 'Order ID: '), orderId || 'N/A'),
            React.createElement(Text, { style: text }, React.createElement('strong', null, 'Urgency: '), urgency),
            React.createElement(Text, { style: text }, React.createElement('strong', null, 'Message: ')),
            React.createElement(Text, { style: text }, message)
          )
        )
      )
    });

    // 2. Send the automated receipt to the user
    await sendEmail({
      to: email,
      subject: 'We have received your request - DirectCrest Support',
      react: React.createElement(
        Html,
        null,
        React.createElement(Head, null),
        React.createElement(Preview, null, 'DirectCrest Support Receipt'),
        React.createElement(
          Body,
          { style: main },
          React.createElement(
            Container,
            { style: container },
            React.createElement(Heading, { style: h1 }, 'DirectCrest Support'),
            React.createElement(Text, { style: text }, 'Hi ', name, ','),
            React.createElement(Text, { style: text }, 'We have received your urgent request. A DirectCrest sourcing agent will review your message and reply via this email address within 24 hours. For immediate order status, please check your Account Dashboard.'),
            React.createElement(
              Section,
              { style: footer },
              React.createElement(Text, { style: footerText }, '© ', new Date().getFullYear(), ' DirectCrest. All rights reserved.')
            )
          )
        )
      )
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Support API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit support request' }, { status: 500 });
  }
}
