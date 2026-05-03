import { useQuery } from "@tanstack/react-query";
import { getProduct } from "./product.api";

export function useProductShow(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });
}
