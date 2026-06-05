import type { User } from "./auth";

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

export interface SimplePaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    current_page_url: string;
    from: number | null;
    path: string;
    per_page: number;
    to: number | null;
  };
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

export interface ProductReview {
  average: number;
  count: number;
  ratings: {
    stars: number;
    count: number;
    percentage: number;
  }[];
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
  review_summary: ProductReview;
  primary_image: {
    id: number;
    url: string;
    is_primary: boolean;
  };
}

export interface AttributeValue {
  attributeId: number;
  attributeName: string;
  valueId: number;
  value: string;
}

export interface Review {
  id: number;
  user: User;
  rating: number;
  comment: string | null;
  created_at: string;
  product_item: ProductItem;
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

export interface ProductItem {
  id: number;
  sku: string;
  price: number;
  in_stock: boolean;
  product?: Product;
  qty: number;
  images: ProductItemImage[];
  attribute_values: AttributeValue[];
}
export interface ProductItemImage {
  id: number;
  url: string;
}

export interface AttributeValue {
  attribute_id: number;
  attribute_name: string;
  value_id: number;
  value: string;
}

export interface Order {
  id: number;
  status: string;
  currency: string;
  subtotal: string;
  shipping_fee: string;
  total: string;
  allowed_transitions: string[];
  is_terminal: boolean;
  items: OrderItem[];
  items_count: number;
  placed_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_item_id: number;
  product_name: string;
  product_slug: string;
  product_image_url: string;
  product_sku: string;
  can_review: boolean;
  is_reviewed: boolean;
  in_stock: boolean;
  attributes: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export type ProductResponse = ApiResponse<Product[]> &
  PaginatedResponse<Product>;

export type OrderResponse = PaginatedResponse<Order>;

export type ProductReviewResponse = PaginatedResponse<Review>;
export * from "./auth";
