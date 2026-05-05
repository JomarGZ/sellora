export interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartPayload {
  product_item_id: number;
  quantity: number;
}
