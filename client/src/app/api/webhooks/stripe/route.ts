import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import connectDB from '@/lib/mongoose';
import { Order, OrderItem, Product, Inventory, Payment, User, ProductRequest, Quote } from '@/lib/models/Schema';
import { sendEmail } from '@/lib/email';
import OrderConfirmationEmail from '@/emails/OrderConfirmationEmail';
import * as React from 'react';
import PDFDocument from 'pdfkit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-08-26.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Webhook Error';
      console.error(`Webhook signature verification failed: ${message}`);
      return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;
      const quoteId = paymentIntent.metadata.quoteId;

      if (!orderId) {
        console.error('No orderId in metadata');
        return NextResponse.json({ error: 'No orderId in metadata' }, { status: 400 });
      }

      await connectDB();

      if (quoteId) {
        const quote = await Quote.findById(quoteId);
        if (quote) {
          await ProductRequest.findByIdAndUpdate(quote.requestId, { status: 'Paid' });
        }
      }

      // Find the order and update status to PAID
      const order = await Order.findByIdAndUpdate(
        orderId, 
        { status: 'PAID' },
        { new: true }
      );

      if (!order) {
        console.error(`Order not found: ${orderId}`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Record the payment
      await Payment.create({
        orderId: order._id,
        amount: paymentIntent.amount / 100, // back to dollars
        status: 'COMPLETED',
      });

      // Deduct inventory
      const orderItems = await OrderItem.find({ orderId: order._id });

      for (const item of orderItems) {
        // If variantId exists, update Inventory for that variant
        if (item.variantId) {
          await Inventory.findOneAndUpdate(
            { productId: item.productId, variantId: item.variantId },
            { $inc: { quantity: -item.quantity } }
          );
        } else {
          // Update product stock directly
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } }
          );
        }
      }

      console.log(`Successfully processed order ${orderId}`);

      // Fetch user email if possible, or use a default
      let emailAddress = 'customer@example.com';
      if (order.userId) {
        const user = await User.findById(order.userId);
        if (user && user.email) {
          emailAddress = user.email;
        }
      }
      
      if (emailAddress === 'customer@example.com' && order.shippingAddress?.email) {
        emailAddress = order.shippingAddress.email;
      }

      const emailItems = orderItems.map((item) => ({
        name: item.name || 'Product',
        quantity: item.quantity,
        price: item.price,
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
          doc.fontSize(12).text(`Order ID: ${order._id.toString()}`);
          doc.text(`Date: ${new Date().toLocaleDateString()}`);
          doc.moveDown();
          
          doc.text('Items:');
          emailItems.forEach(item => {
            doc.text(`- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`);
          });
          
          doc.moveDown();
          doc.text(`Total Paid: $${order.total.toFixed(2)}`, { align: 'right' });
          
          doc.end();
        });
      };
      
      const pdfBuffer = await generatePDF();

      await sendEmail({
        to: emailAddress,
        subject: 'Order Confirmation - DirectCrest',
        react: React.createElement(OrderConfirmationEmail, {
          orderId: order._id.toString(),
          total: order.total,
          shippingAddress: order.shippingAddress?.street || 'N/A',
          items: emailItems,
        }),
        attachments: [
          {
            filename: `Receipt-${order._id.toString()}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
