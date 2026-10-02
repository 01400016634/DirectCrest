/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '../lib/mongoose';
import { Category } from '../lib/models/Schema';
import { categorySchema } from '../lib/validations/category';

export async function createCategory(formData: any) {
  try {
    await dbConnect();
    const validatedData = categorySchema.parse(formData);
    
    // Ensure parentId is either a valid ObjectId string or undefined
    if (!validatedData.parentId) {
      delete validatedData.parentId;
    }

    const newCategory = await Category.create(validatedData);
    revalidatePath('/admin/categories');
    return { success: true, category: JSON.parse(JSON.stringify(newCategory)) };
  } catch (error: any) {
    console.error('Create category error:', error);
    return { success: false, error: error.message };
  }
}

export async function getCategories() {
  try {
    await dbConnect();
    const categories = await Category.find({}).populate('parentId').lean();
    return { success: true, categories: JSON.parse(JSON.stringify(categories)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await dbConnect();
    await Category.findByIdAndDelete(id);
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
