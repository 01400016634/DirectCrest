import * as z from 'zod';

export const addressSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone number is required').max(20),
  country: z.string().min(2, 'Country is required'), // Could map to countryId later
  level1: z.string().min(2, 'State/Province/Division is required'),
  level2: z.string().min(2, 'City/District is required'),
  level3: z.string().optional(), // Upazila etc.
  postalCode: z.string().min(2, 'Postal code is required'),
  street: z.string().min(5, 'Street address is required'),
  isDefault: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;
