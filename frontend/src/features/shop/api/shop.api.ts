import { client } from "@/shared/api/client";
import type { ProductResponse } from "@/shared/types";

export async function getProducts(
  page: number,
  search?: string,
): Promise<ProductResponse> {
  const { data } = await client.get("/v1/products", {
    params: {
      page,
      search: search || undefined,
    },
  });
  return data;
}
