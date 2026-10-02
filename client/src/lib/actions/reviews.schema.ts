import { z } from 'zod';

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Review must be at least 5 characters long").max(500),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
