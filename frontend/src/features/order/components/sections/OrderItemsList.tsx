import type { OrderCallbacks, OrderItem, OrderStatus } from "../../types";
import OrderItemCard from "../ui/OrderItemCard";

interface OrderItemsListProps {
  items: OrderItem[];
  orderStatus: OrderStatus;
  orderId: string;
  callbacks: OrderCallbacks;
  onReviewItem: (orderId: string, item: OrderItem) => void;
}

const OrderItemsList = ({
  items,
  orderStatus,
  orderId,
  callbacks,
  onReviewItem,
}: OrderItemsListProps) => (
  <div className="divide-y divide-border">
    {items.map((item) => (
      <OrderItemCard
        key={item.id}
        item={item}
        orderStatus={orderStatus}
        orderId={orderId}
        callbacks={callbacks}
        onReviewItem={onReviewItem}
      />
    ))}
  </div>
);

export default OrderItemsList;
