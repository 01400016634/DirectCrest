import nodemailer from 'nodemailer';

// Configure the transport using environment variables. 
// For Gmail, you will use your Gmail address and a 16-digit "App Password" (not your normal password).
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || process.env.EMAIL_USER,
    pass: (process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
  },
});

export const sendOrderConfirmationEmail = async (
  toEmail: string, 
  orderDetails: {
    trackingNumber: string;
    name: string;
    total: number;
    itemsCount: number;
  }
) => {
  const userEnv = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const passEnv = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  // If no credentials are provided in .env, we just mock the email success (so it doesn't crash in dev)
  if (!userEnv || !passEnv) {
    console.log(`[MOCK EMAIL] To: ${toEmail} | Subject: Order Confirmed ${orderDetails.trackingNumber}`);
    return { success: true, mocked: true };
  }

  try {
    const mailOptions = {
      from: `"DirectCrest" <${userEnv}>`,
      to: toEmail,
      subject: `Order Confirmed! Your Tracking ID: ${orderDetails.trackingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #dc2626; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">DirectCrest</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333333;">Hi ${orderDetails.name},</h2>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              Thank you for your purchase! Your order has been successfully placed and is now processing.
            </p>
            
            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; font-weight: bold;">Order Details</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Tracking ID:</strong> <span style="color: #dc2626;">${orderDetails.trackingNumber}</span></p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Items:</strong> ${orderDetails.itemsCount}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Total Paid:</strong> ৳${orderDetails.total.toFixed(2)}</p>
            </div>

            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              You can track the live status of your shipment on our website at any time using your tracking ID and email/phone.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/track-order" style="background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; font-size: 16px;">Track Your Order</a>
            </div>
          </div>
          <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} DirectCrest. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
