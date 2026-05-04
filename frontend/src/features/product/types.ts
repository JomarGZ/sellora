import type { ApiResponse, Brand, Category, Product } from "@/shared/types";

export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

export interface ProductItemImage {
  id: number;
  url: string;
}

export interface ProductItem {
  id: number;
  sku: string;
  price: number;
  in_stock: boolean;
  qty_in_stock: number;
  images: ProductItemImage[];
  attribute_values: AttributeValue[];
}

export interface AttributeValue {
  attribute_id: number;
  attribute_name: string;
  value_id: number;
  value: string;
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
