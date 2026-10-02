/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '../lib/mongoose';
import { ProductVariant } from '../lib/models/Schema';
import { variantSchema } from '../lib/validations/variant';

export async function createVariant(formData: any) {
  try {
    await dbConnect();
    const validatedData = variantSchema.parse(formData);
    const newVariant = await ProductVariant.create(validatedData);
    revalidatePath(`/admin/products/${validatedData.productId}/variants`);
    return { success: true, variant: JSON.parse(JSON.stringify(newVariant)) };
  } catch (error: any) {
    console.error('Create variant error:', error);
    return { success: false, error: error.message };
  }
}

export async function getVariants(productId: string) {
  try {
    await dbConnect();
    const variants = await ProductVariant.find({ productId }).lean();
    return { success: true, variants: JSON.parse(JSON.stringify(variants)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteVariant(id: string, productId: string) {
  try {
    await dbConnect();
    await ProductVariant.findByIdAndDelete(id);
    revalidatePath(`/admin/products/${productId}/variants`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
