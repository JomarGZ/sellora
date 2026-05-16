import { client } from "@/shared/api/client";
import type { User } from "@/shared/types";
import type { ProfileFormValues } from "@/features/account/validation/profile.schema";
import type { PasswordFormValues } from "@/features/account/validation/password.schema";

export async function fetchMe() {
  const { data } = await client.get("v1/me");
  return data.data as User;
}

export async function updateProfile(payload: ProfileFormValues) {
  const { data } = await client.put("/v1/me/profile", payload);
  return data;
}

export async function changePassword(payload: PasswordFormValues) {
  const { data } = await client.put("/v1/me/change-password", payload);
  return data;
}
