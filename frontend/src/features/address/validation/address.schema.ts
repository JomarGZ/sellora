import { z } from "zod";

export const addressSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  country_id: z.coerce.number().min(1, "Country is required"),
  city_id: z.coerce.number().min(1, "City is required"),
  street_address: z.string().min(1, "Street address is required"),
  is_default: z.boolean().optional(),
});

export type AddressFormInput = z.input<typeof addressSchema>; // 👈 what form uses
export type AddressFormValues = z.output<typeof addressSchema>; // 👈 what submit gets
