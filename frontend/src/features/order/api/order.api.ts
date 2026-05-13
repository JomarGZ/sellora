import { client } from "@/shared/api/client";
import type { OrderResponse } from "@/shared/types";
import type { CreateReviewPayload } from "../types";

export async function getOrders(page?: number): Promise<OrderResponse> {
  const { data } = await client.get("/v1/orders", {
    params: { page },
  });
  return data;
}

export async function createReviewItem(payload: CreateReviewPayload) {
  const { data } = await client.post("/v1/reviews", payload);
  return data;
}
