export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  brand: Brand;
  category: Category;
  min_price: string;
  is_new: boolean;
  is_bestseller: boolean;
  rating: {
    average: number;
    count: number;
  };
  primary_image: {
    id: number;
    url: string;
    is_primary: boolean;
  };
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
}

export interface ProductItem {
  id: number;
  sku: string;
  price: number;
  originalPrice: number | null;
  qtyInStock: number;
  images: ProductImage[];
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
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface Brand {
  id: number;
  name: string;
  logo: string | null;
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

export type ProductResponse = ApiResponse<Product[]> &
  PaginatedResponse<Product>;

export * from "./auth";
