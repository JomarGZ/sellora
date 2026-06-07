import { client } from "@/shared/api/client";
import type { CheckoutOrderPreviewResponse, CheckoutPayload } from "../types";

export async function checkout(payload: CheckoutPayload) {
  const { data } = await client.post("/v1/checkout", payload);

  return data;
}

export async function preview() {
  const { data } = await client.get("/v1/checkout/preview");
  return data;
}

export async function getDefaultShipping() {
  const { data } = await client.get("/v1/shipping-option/default");
  return data;
}

export async function placeOrder(idempotencyKey: string) {
  const { data } = await client.post("/v1/checkout/initiate", {
    idempotency_key: idempotencyKey,
  });
  return data;
}
