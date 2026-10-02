'use server';

import connectDB from '@/lib/mongoose';
import { ProductRequest, Quote, User } from '@/lib/models/Schema';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';
import SourcingQuoteEmail from '@/emails/SourcingQuoteEmail';
import * as React from 'react';

// Mock auth check until NextAuth is implemented
const isAdmin = async () => {
  // Hardcoded mock check
  return true;
};

export async function issueQuote(
  requestId: string,
  finalPrice: number,
  shippingCost: number,
  internalSupplierCost: number,
  notes?: string
) {
  try {
    if (!(await isAdmin())) {
      throw new Error('Unauthorized: Admin access required');
    }

    await connectDB();

    const request = await ProductRequest.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status === 'Quoted') {
      throw new Error('Request is already quoted');
    }

    const quote = new Quote({
      requestId,
      finalPrice,
      shippingCost,
      internalSupplierCost, // Kept strictly private by schema select: false
      notes
    });

    await quote.save();

    request.status = 'Quoted';
    await request.save();

    // Fetch user email
    let emailAddress = 'customer@example.com';
    if (request.userId) {
      const user = await User.findById(request.userId);
      if (user && user.email) {
        emailAddress = user.email;
      }
    }

    await sendEmail({
      to: emailAddress,
      subject: 'Your Sourcing Quote is Ready - DirectCrest',
      react: React.createElement(SourcingQuoteEmail, {
        requestTitle: request.productTitle || 'Custom Product Request',
        quotePrice: finalPrice,
        estimatedShipping: shippingCost,
        requestUrl: 'https://directcrest.com/account',
      }),
    });

    revalidatePath('/admin/sourcing');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error issuing quote:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to issue quote';
    return { success: false, error: errorMessage };
  }
}
