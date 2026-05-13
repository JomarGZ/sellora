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

export interface AttributeValue {
  attributeId: number;
  attributeName: string;
  valueId: number;
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

export interface ProductItem {
  id: number;
  sku: string;
  price: number;
  in_stock: boolean;
  product?: Product;
  qty_in_stock: number;
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
  is_paid: boolean;
  order_total: number;
  subtotal: number;
  shipping_fee: number;
  currency: string;
  created_at: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: number;
  price: number;
  already_reviewed: boolean;
  product_item_id: number;
  product_item: ProductItem;
  qty: number;
  sku: string;
}

export type ProductResponse = ApiResponse<Product[]> &
  PaginatedResponse<Product>;

export type OrderResponse = PaginatedResponse<Order>;

export * from "./auth";
