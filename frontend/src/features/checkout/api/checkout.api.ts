import { client } from "@/shared/api/client";
import type { CheckoutOrderPreviewResponse, CheckoutPayload } from "../types";

export async function checkout(payload: CheckoutPayload) {
  const { data } = await client.post("/v1/checkout", payload);

  return data;
}

export async function createPreview(ids: number[]) {
  const { data } = await client.post("/v1/checkout/createPreview", { ids });
  return data;
}

export async function getCurrentCheckout(): Promise<CheckoutOrderPreviewResponse> {
  const { data } = await client.get("/v1/checkout/current");
  return data;
}

export async function getDefaultShipping() {
  const { data } = await client.get("/v1/shipping-option/default");
  return data;
}

export async function placeOrder(orderId: number) {
  const { data } = await client.post("/v1/checkout", { order_id: orderId });
  return data;
}
