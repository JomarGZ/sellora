import type { ApiResponse, OrderItem } from "@/shared/types";

export interface CheckoutItem {
  product_item_id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant: string;
}

export interface ShippingMethod {
  id: number;
  name: string;
  price: number;
  estimated_days: number;
}

export interface CartItem extends CheckoutItem {
  selected: boolean;
}

export interface CheckoutPayload {
  shipping_method_id: number;
  items: {
    product_item_id: number;
    quantity: number;
  }[];
}

export interface CheckoutOrderItem {
  id: number;
  is_paid?: boolean;
  order_total: number;
  shipping_fee: number;
  order_items: OrderItem[];
  subtotal: number;
  status: string;
  status_label: string;
}

export interface OrderSummary {
  items_count: number;
  subtotal: number;
  shipping_fee: number;
  total: number;
}

export type CheckoutOrderPreviewResponse = ApiResponse<CheckoutOrderItem>;
