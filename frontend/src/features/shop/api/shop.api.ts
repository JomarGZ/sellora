import { client } from "@/shared/api/client";
import type { ProductResponse } from "@/shared/types";

export async function getProducts(
  page: number,
  search?: string,
  maxPrice?: number,
  minPrice?: number,
  category?: string,
  brand?: string,
  sort?: string,
): Promise<ProductResponse> {
  const { data } = await client.get("/v1/products", {
    params: {
      page,
      search: search || undefined,
      max_price: maxPrice || undefined,
      min_price: minPrice || undefined,
      category: category || undefined,
      brand: brand || undefined,
      sort: sort || undefined,
    },
  });
  return data;
}
