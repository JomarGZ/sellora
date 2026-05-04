import { client } from "@/shared/api/client";

export async function getProduct(slug: string) {
  const { data } = await client.get(`/v1/products/${slug}`);
  return data;
}
