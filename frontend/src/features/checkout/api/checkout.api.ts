import { client } from "@/shared/api/client";
import type { CheckoutPayload } from "../types";

export async function checkout(payload: CheckoutPayload) {
  const { data } = await client.post("/v1/checkout", payload);

  return data;
}
