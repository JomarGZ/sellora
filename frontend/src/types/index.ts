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

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
}

export interface AttributeValueSimple {
  id: number;
  value: string;
}

export interface AttributeGroup {
  id: number;
  name: string;
  values: AttributeValueSimple[];
}

export interface AttributeValue {
  attributeId: number;
  attributeName: string;
  valueId: number;
  value: string;
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

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface WishlistStatus {
  productId: number;
  wishlisted: boolean;
}

export interface CartResponse {
  success: boolean;
  message: string;
  cartItemCount: number;
}
export const OrderStatus = {
  Pending: "Pending",
  Processing: "Processing",
  PreparingToShip: "Preparing to Ship",
  Shipped: "Shipped",
  OutForDelivery: "Out for Delivery",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  Paid: "Paid",
  Unpaid: "Unpaid",
  Refunded: "Refunded",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/** Statuses that allow cancellation */
export const CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.PreparingToShip,
];

/** Status that allows confirming receipt */
export const RECEIVABLE_STATUSES: OrderStatus[] = [OrderStatus.OutForDelivery];

/** Status that allows reviewing items */
export const REVIEWABLE_STATUSES: OrderStatus[] = [OrderStatus.Delivered];

export interface OrderItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
  /** Whether product is still available for purchase */
  inStock: boolean;
  /** Whether this item has already been reviewed */
  reviewed: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  items: OrderItem[];
}

export interface OrderFiltersState {
  orderStatus: OrderStatus | "all";
  paymentStatus: PaymentStatus | "all";
  search: string;
}

/** Callbacks that OrderPage passes down to children */
export interface OrderCallbacks {
  onCancel: (orderId: string) => void;
  onReceive: (orderId: string) => void;
  onOrderAgain: (order: Order) => void;
  onBuyAgain: (item: OrderItem) => void;
  onReviewSubmit: (
    orderId: string,
    itemId: string,
    rating: number,
    comment: string,
  ) => void;
}

export const ORDER_STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" as const },
  ...Object.values(OrderStatus).map((s) => ({ label: s, value: s })),
];

export const PAYMENT_STATUS_OPTIONS = [
  { label: "All Payments", value: "all" as const },
  ...Object.values(PaymentStatus).map((s) => ({ label: s, value: s })),
];
