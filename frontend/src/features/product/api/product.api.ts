import { client } from "@/shared/api/client";
import type { ProductReviewResponse } from "@/shared/types";

export async function getProduct(slug: string) {
  const { data } = await client.get(`/v1/products/${slug}`);
  return data;
}

export async function getProductRatingReview(
  slug: string,
  page: number,
): Promise<ProductReviewResponse> {
  const { data } = await client.get(`/v1/products/${slug}/reviews`, {
    params: { page },
  });
  return data;
}
