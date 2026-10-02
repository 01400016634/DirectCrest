/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '../lib/mongoose';
import { Product } from '../lib/models/Schema';
import { productSchema } from '../lib/validations/product';

// Mock authentication check - in real app, use next-auth or similar
const checkAdmin = async () => {
  // const session = await getSession();
  // if (!session || !['ADMIN', 'SUPER_ADMIN', 'PRODUCT_MANAGER'].includes(session.user.role)) {
  //   throw new Error('Unauthorized');
  // }
  return true;
};

export async function createProduct(formData: any) {
  try {
    await checkAdmin();
    await dbConnect();

    // Validate the input
    const validatedData = productSchema.parse(formData);

    // Map validation fields to schema fields
    const productToCreate = {
      ...validatedData,
      brandId: validatedData.brand,
      categoryId: validatedData.category
    };
    delete (productToCreate as any).brand;
    delete (productToCreate as any).category;

    // Create the product in DB
    const newProduct = await Product.create(productToCreate);

    revalidatePath('/admin/products');
    return { success: true, product: JSON.parse(JSON.stringify(newProduct)) };
  } catch (error: any) {
    console.error('Create product error:', error);
    return { success: false, error: error.message };
  }
}

export async function getProducts(options: { page?: number; limit?: number } = {}) {
  try {
    await checkAdmin(); // Must be admin to view all fields including cost!
    await dbConnect();

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    // Notice we use +cost if it was hidden by default, to ensure admin sees it
    const products = await Product.find({})
      .populate('categoryId')
      .populate('brandId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Product.countDocuments();

    return { 
      success: true, 
      products: JSON.parse(JSON.stringify(products)), 
      totalPages: Math.ceil(total / limit) 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await checkAdmin();
    await dbConnect();
    await Product.findByIdAndDelete(id);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
