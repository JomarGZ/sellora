import { client } from "@/shared/api/client";
import type { ProductResponse } from "@/shared/types";

export async function getProducts(page: number): Promise<ProductResponse> {
  const { data } = await client.get(`/v1/products?page=${page}`);
  return data;
}
