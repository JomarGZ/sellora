import { useQuery } from "@tanstack/react-query";
import { getProduct, getProductRatingReview } from "./product.api";
import type { ProductDetailResponse } from "../types";
import type { ProductReviewResponse } from "@/shared/types";

export function useProductShow(slug: string) {
  return useQuery<ProductDetailResponse>({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });
}

export function useProductReviews(slug: string, page: number) {
  return useQuery<ProductReviewResponse>({
    queryKey: ["product-review", slug, page],
    queryFn: () => getProductRatingReview(slug, page),
    enabled: !!slug,
  });
}
