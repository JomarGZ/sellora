import { z } from "zod";

export const addressSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  country_id: z.string().min(1, "Country is required"),
  city_id: z.string().min(1, "City is required"),
  street_address: z.string().min(1, "Street address is required"),
  is_default: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
