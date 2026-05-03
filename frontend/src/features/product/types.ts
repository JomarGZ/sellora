import type { Brand, Category, Product } from "@/shared/types";

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
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
  attributeValues: AttributeValue[];
}

export interface AttributeValue {
  attributeId: number;
  attributeName: string;
  valueId: number;
  value: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  brand: Brand;
  categories: Category[];
  images: ProductImage[];
  attributes: AttributeGroup[];
  ordersCount: number;
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
