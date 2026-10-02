import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: `"DirectCrest Orders" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Test Email from DirectCrest',
      text: 'This is a test email to verify your Gmail credentials are working properly.',
    });
    console.log('Success! Test email sent:', info.messageId);
  } catch (err) {
    console.error('Failed to send test email!', err);
  }
}
run();
