import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import * as React from 'react';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  react,
  attachments,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}) {
  try {
    const html = await render(react);
    
    const info = await transporter.sendMail({
      from: `"DirectCrest Orders" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    
    console.log('Email sent: %s', info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
