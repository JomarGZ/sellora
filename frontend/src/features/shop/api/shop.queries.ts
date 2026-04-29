import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./shop.api";

export function useProducts(page: number, search?: string) {
  return useQuery({
    queryKey: ["products", page, search],
    queryFn: () => getProducts(page, search),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
}
