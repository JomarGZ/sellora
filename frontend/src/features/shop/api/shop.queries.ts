import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./shop.api";

export function useProducts(
  page: number,
  search?: string,
  maxPrice?: number,
  minPrice?: number,
  category?: string,
  brand?: string,
  sort?: string,
) {
  return useQuery({
    queryKey: [
      "products",
      page,
      search,
      maxPrice,
      minPrice,
      category,
      brand,
      sort,
    ],
    queryFn: () =>
      getProducts(page, search, maxPrice, minPrice, category, brand, sort),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
}
