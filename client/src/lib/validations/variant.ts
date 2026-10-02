import { z } from 'zod';

export const variantSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Variant name is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  sku: z.string().min(3, 'SKU is required'),
});

export type VariantFormValues = z.infer<typeof variantSchema>;
