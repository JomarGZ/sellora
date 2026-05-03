import { useQuery } from "@tanstack/react-query";
import { getProduct } from "./product.api";
import type { ProductDetailResponse } from "../types";

export function useProductShow(slug: string) {
  return useQuery<ProductDetailResponse>({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });
}
