import type { ApiResponse, Product, ProductItem } from "@/shared/types";

export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  verified: boolean;
}

export interface AttributeGroup {
  id: number;
  name: string;
  values: AttributeValueSimple[];
}
export interface AttributeValueSimple {
  id: number;
  value: string;
  hex_color: string;
  label: string;
  swatch: {
    type: string;
    value: string;
  };
  image: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface ProductDetails extends Product {
  attributes: AttributeGroup[];
  images: ProductImage[];
  price_range: {
    min: string;
    max: string;
  };
  variants: ProductItem[];
}

export type ProductDetailResponse = ApiResponse<ProductDetails>;
