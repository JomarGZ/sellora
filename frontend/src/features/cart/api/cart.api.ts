import { client } from "@/shared/api/client";
import type { CartItem, CartPayload, Summary } from "../types";
import type { ApiResponse } from "@/shared/types";

export async function getCart({ page = 1 }: { page?: number }) {
  const { data } = await client.get("/v1/shopping-cart", { params: { page } });
  return data;
}

export async function addCartItem(payload: CartPayload) {
  const { data } = await client.post("/v1/shopping-cart", payload);
  return data;
}

export async function buyNowItem(
  payload: CartPayload,
): Promise<ApiResponse<CartItem>> {
  const { data } = await client.post("/v1/shopping-cart/buy-now", payload);
  return data;
}

export async function updateCartItemQuantity({
  id,
  quantity,
}: {
  id: number;
  quantity: number;
}) {
  const { data } = await client.put(`/v1/shopping-cart/${id}`, { quantity });
  return data;
}

export async function deleteCartItem(id: number) {
  const { data } = await client.delete(`/v1/shopping-cart/${id}`);
  return data;
}

export async function getSummary(ids: number[]): Promise<ApiResponse<Summary>> {
  const { data } = await client.post("/v1/shopping-cart/summary", {
    ids,
  });
  return data;
}
