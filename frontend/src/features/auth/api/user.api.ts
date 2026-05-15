import { client } from "@/shared/api/client";
import type { User } from "@/shared/types";

export async function fetchMe() {
  const { data } = await client.get("v1/me");
  return data.data as User;
}
