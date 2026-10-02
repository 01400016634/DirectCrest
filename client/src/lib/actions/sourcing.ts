'use server';

import connectDB from '@/lib/mongoose';
import { ProductRequest } from '@/lib/models/Schema';
import { SourcingFormValues } from './sourcing.schema';

export async function submitSourcingRequest(data: SourcingFormValues, userId?: string) {
  try {
    await connectDB();

    // In a real implementation, we'd use NextAuth to get the session. 
    // We'll optionally accept a userId here, or fall back to a mock for now.
    const mockUserId = userId || '000000000000000000000000';

    const request = new ProductRequest({
      userId: mockUserId,
      productTitle: data.productTitle,
      description: data.description,
      targetPrice: data.targetPrice ? Number(data.targetPrice) : undefined,
      quantity: Number(data.quantity),
      imageLink: data.imageLink,
      status: 'Pending',
    });

    await request.save();

    return { success: true };
  } catch (error: unknown) {
    console.error('Error saving sourcing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit request';
    return { success: false, error: errorMessage };
  }
}
