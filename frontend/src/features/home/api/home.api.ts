import { client } from "@/shared/api/client";
import type { ProductsResponse } from "../types";

export async function getNewArrivalProducts(): Promise<ProductsResponse> {
  const { data } = await client.get("/v1/products/new-arrivals");
  return data;
}

export async function getBestSellerProducts(): Promise<ProductsResponse> {
  const { data } = await client.get("/v1/products/best-sellers");
  return data;
}
