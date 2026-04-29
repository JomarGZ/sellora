import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./shop.api";

export function useProducts(page: number) {
  return useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts(page),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
}
