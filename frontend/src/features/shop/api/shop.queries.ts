import { useQuery } from "@tanstack/react-query";
import { getFilterOptions, getProducts } from "./shop.api";
import type { FilterResponse } from "../types";

export function useProducts(
  page: number,
  search?: string,
  maxPrice?: number,
  minPrice?: number,
  categories?: string[],
  brands?: string[],
  sort?: string,
) {
  return useQuery({
    queryKey: [
      "products",
      page,
      search,
      maxPrice,
      minPrice,
      categories,
      brands,
      sort,
    ],
    queryFn: () =>
      getProducts(page, search, maxPrice, minPrice, categories, brands, sort),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductFilters() {
  return useQuery<FilterResponse>({
    queryKey: ["productFilters"],
    queryFn: () => getFilterOptions(),
    staleTime: 1000 * 60 * 60,
  });
}
