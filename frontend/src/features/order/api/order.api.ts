import { client } from "@/shared/api/client";
import type { OrderResponse } from "@/shared/types";
import type { CreateReviewPayload } from "../types";

export async function getOrders(page?: number): Promise<OrderResponse> {
  const { data } = await client.get("/v1/orders", {
    params: { page },
  });
  return data;
}

export async function createOrderItemReview(payload: CreateReviewPayload) {
  const { data } = await client.post("/v1/reviews", payload);
  return data;
}

export async function requestOrderCancellation(orderId: number) {
  const { data } = await client.patch(`v1/orders/${orderId}/request-cancel`);
  return data;
}

export async function markOrderAsReceived(orderId: number) {
  const { data } = await client.patch(`v1/orders/${orderId}/mark-received`);
  return data;
}
