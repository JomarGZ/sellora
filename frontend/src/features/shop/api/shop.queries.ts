import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./shop.api";

export function useProducts(
  page: number,
  search?: string,
  maxPrice?: number,
  minPrice?: number,
  category?: string,
  brand?: string,
) {
  return useQuery({
    queryKey: ["products", page, search, maxPrice, minPrice, category, brand],
    queryFn: () =>
      getProducts(page, search, maxPrice, minPrice, category, brand),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
}
