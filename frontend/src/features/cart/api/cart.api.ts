import { client } from "@/shared/api/client";
import type { CartItem, CartPayload } from "../types";
import type { ApiResponse } from "@/shared/types";

export async function getCart() {
  const { data } = await client.get("/v1/cart");
  return data;
}

export async function addCartItem(payload: CartPayload) {
  const { data } = await client.post("/v1/cart/items", payload);
  return data;
}

export async function buyNowItem(
  payload: CartPayload,
): Promise<ApiResponse<CartItem>> {
  const { data } = await client.post("/v1/carts/buy-now", payload);
  return data;
}

export async function updateCartItemQuantity({
  itemId,
  cartId,
  quantity,
}: {
  itemId: number;
  cartId: number;
  quantity: number;
}) {
  const { data } = await client.patch(`/v1/cart/${cartId}/items/${itemId}`, {
    quantity,
  });
  return data;
}

export async function deleteCartItem(id: number) {
  const { data } = await client.delete(`/v1/shopping-cart/${id}`);
  return data;
}
