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
export type Summary = {
  items: {
    id: number;
    quantity: number;
    product_item: {
      id: number;
      sku: string;
      price: number;
      qty_in_stock: number;
      in_stock: boolean;
    };
  }[];
  total: number;
  count: number;
};

export type CartItemResponse = ApiResponse<CartItem[]> &
  PaginatedResponse<CartItem>;
