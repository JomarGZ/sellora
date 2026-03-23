export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  items: OrderItem[];
}
export interface CreateReviewPayload {
  orderItemId: string;
  rating: number;
  comment?: string;
}

export interface OrderFiltersState {
  orderStatus: OrderStatus | "all";
  paymentStatus: PaymentStatus | "all";
  search: string;
}

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

export const ORDER_STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" as const },
  ...Object.values(OrderStatus).map((s) => ({ label: s, value: s })),
];

export const PAYMENT_STATUS_OPTIONS = [
  { label: "All Payments", value: "all" as const },
  ...Object.values(PaymentStatus).map((s) => ({ label: s, value: s })),
];
