import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Order, OrderItem, User } from '@/lib/models/Schema';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';
import OrderConfirmationEmail from '@/emails/OrderConfirmationEmail';
import * as React from 'react';
import PDFDocument from 'pdfkit';
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { items, formData, total, subtotal, deliveryFee, discount } = body;

    // Generate unique order ID
    const trackingNumber = 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    let user = await User.findOne({ email: formData.email });
    if (!user) {
      user = await User.create({ email: formData.email, firstName: formData.name, lastName: '' });
    }

    // Create the order
    const newOrder = await Order.create({
      userId: user._id,
      total: total,
      status: 'Pending',
      shippingAddress: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        deliveryOption: formData.deliveryOption,
        paymentMethod: formData.paymentMethod
      },
      trackingNumber,
      carrier: formData.deliveryOption === 'express' ? 'Express Courier' : 'Standard Delivery',
    });

    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        orderId: newOrder._id,
        productId: item.productId,
        quantity: item.quantity,
        priceSnapshot: item.price
      }));
      await OrderItem.insertMany(orderItems);
    }

    // Trigger the automated Email confirmation
    if (formData.email) {
      const emailItems = items.map((item: any) => ({
        name: item.name || 'Product',
        quantity: item.quantity,
        price: item.price || 0,
      }));

      const generatePDF = (): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
          const doc = new PDFDocument({ margin: 50 });
          const buffers: Buffer[] = [];
          doc.on('data', buffers.push.bind(buffers));
          doc.on('end', () => resolve(Buffer.concat(buffers)));
          doc.on('error', reject);

          doc.fontSize(20).text('DirectCrest Purchase Receipt', { align: 'center' });
          doc.moveDown();
          doc.fontSize(12).text(`Order ID: ${newOrder._id.toString()}`);
          doc.text(`Tracking Number: ${trackingNumber}`);
          doc.text(`Date: ${new Date().toLocaleDateString()}`);
          doc.moveDown();
          
          doc.text('Items:');
          emailItems.forEach((item: any) => {
            doc.text(`- ${item.name} x${item.quantity} (Tk ${(item.price * item.quantity).toFixed(2)})`);
          });
          
          doc.moveDown();
          doc.text(`Total Paid: Tk ${total.toFixed(2)}`, { align: 'right' });
          
          doc.end();
        });
      };

      generatePDF().then(pdfBuffer => {
        return sendEmail({
          to: formData.email,
          subject: 'Order Confirmation - DirectCrest',
          react: React.createElement(OrderConfirmationEmail, {
            orderId: trackingNumber,
            total: total,
            shippingAddress: formData.address || 'N/A',
            items: emailItems,
          }),
          attachments: [
            {
              filename: `Receipt-${trackingNumber}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        });
      }).catch(err => console.error("Failed to send async email:", err));
    }

    return NextResponse.json({ success: true, trackingNumber, orderId: newOrder._id }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
