import { client } from "@/shared/api/client";
import type { User } from "@/shared/types";
import type { ProfilePayload } from "../types";
import type { ProfileFormValues } from "@/features/account/validation/profile.schema";

export async function fetchMe() {
  const { data } = await client.get("v1/me");
  return data.data as User;
}

export async function updateProfile(payload: ProfileFormValues) {
  const { data } = await client.put("/v1/me/profile", payload);
  return data;
}
