export interface CheckoutItem {
  product_item_id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant: string;
}

export interface Address {
  id: number;
  full_name: string;
  phone: string;
  address_line: string;
  is_default: boolean;
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
  address_id: number;
  shipping_method_id: number;
  items: {
    product_item_id: number;
    quantity: number;
  }[];
}
