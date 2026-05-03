import { client } from "@/shared/api/client";
import type { ProductResponse } from "@/shared/types";

export async function getProducts(
  page: number,
  search?: string,
  maxPrice?: number,
  minPrice?: number,
  categories?: string[],
  brands?: string[],
  sort?: string,
): Promise<ProductResponse> {
  const { data } = await client.get("/v1/products", {
    params: {
      page,
      search: search || undefined,
      max_price: maxPrice || undefined,
      min_price: minPrice || undefined,
      categories: categories || undefined,
      brands: brands || undefined,
      sort: sort || undefined,
    },
  });
  return data;
}

export async function getFilterOptions() {
  const { data } = await client.get("/v1/products/filters");
  return data;
}
