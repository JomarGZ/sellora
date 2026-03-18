import type { Address, CartItem, ShippingMethod } from "@/types/checkout";

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    product_item_id: 1,
    name: "Classic Cotton T-Shirt",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
    price: 29.99,
    quantity: 2,
    variant: "Size: M | Color: Black",
    selected: false,
  },
  {
    product_item_id: 2,
    name: "Slim Fit Denim Jeans",
    image:
      "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=200&h=200&fit=crop",
    price: 79.99,
    quantity: 1,
    variant: "Size: 32 | Color: Indigo",
    selected: false,
  },
  {
    product_item_id: 3,
    name: "Leather Crossbody Bag",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop",
    price: 149.99,
    quantity: 1,
    variant: "Color: Tan",
    selected: false,
  },
  {
    product_item_id: 4,
    name: "Running Sneakers Pro",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    price: 119.99,
    quantity: 1,
    variant: "Size: 10 | Color: White",
    selected: false,
  },
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    full_name: "John Doe",
    phone: "+1 (555) 123-4567",
    address_line: "123 Main Street, Apt 4B, New York, NY 10001",
    is_default: true,
  },
  {
    id: 2,
    full_name: "John Doe",
    phone: "+1 (555) 987-6543",
    address_line: "456 Oak Avenue, Suite 200, Los Angeles, CA 90001",
    is_default: false,
  },
];

export const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  { id: 1, name: "Standard Shipping", price: 4.99, estimated_days: 7 },
  { id: 2, name: "Express Shipping", price: 12.99, estimated_days: 3 },
  { id: 3, name: "Overnight Shipping", price: 24.99, estimated_days: 1 },
];
