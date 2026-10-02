import { z } from 'zod';

export const sourcingFormSchema = z.object({
  productTitle: z.string().min(3, "Product title must be at least 3 characters"),
  description: z.string().min(10, "Please provide more details in the description"),
  targetPrice: z.string().optional(),
  quantity: z.string(),
  imageLink: z.string().optional(),
});

export type SourcingFormValues = z.infer<typeof sourcingFormSchema>;
