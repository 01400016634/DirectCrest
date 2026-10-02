import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: 'client/.env.local' });

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
      from: `"Test" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Test Email',
      text: 'This is a test email to verify credentials.',
    });
    console.log('Success!', info.messageId);
  } catch (err) {
    console.error('Failed!', err);
  }
}
run();
