import type {
  ApiResponse,
  PaginatedResponse,
  ProductItem,
} from "@/shared/types";

export interface CartItem {
  id: number;
  name: string;
  product_item: ProductItem;
  price: number;
  quantity: number;
  image: string;
}

export interface CartPayload {
  product_item_id: number;
  quantity: number;
}

export type CartItemResponse = ApiResponse<CartItem[]> &
  PaginatedResponse<CartItem>;
