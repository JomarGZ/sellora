import z from "zod";

export const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(255),
  last_name: z.string().min(1, "Last name is required").max(255).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
