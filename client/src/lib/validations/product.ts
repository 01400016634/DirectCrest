import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  brand: z.string().min(2, 'Brand is required'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  retailPrice: z.number().min(0, 'Retail price cannot be negative'),
  wholesalePrice: z.number().min(0, 'Wholesale price cannot be negative'),
  cost: z.number().min(0, 'Cost cannot be negative').optional(), // Private field
  sku: z.string().min(3, 'SKU is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED', 'OPEN_BOX', 'PRE_ORDER']),
  weight: z.number().min(0).optional(),
  countryOfOrigin: z.string().optional(),
  category: z.string().min(1, 'Category ID is required'),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  threeDModelUrl: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
