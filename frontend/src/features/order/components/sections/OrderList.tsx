import type { Order, OrderCallbacks, OrderItem } from "@/shared/types";
import OrderListSkeleton from "../states/OrderCardSkeleton";
import EmptyState from "../states/EmptyState";
import OrderCard from "../ui/OrderCard";

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  callbacks: OrderCallbacks;
  onReviewItem: (orderId: string, item: OrderItem) => void;
}

const OrderList = ({
  orders,
  isLoading,
  callbacks,
  onReviewItem,
}: OrderListProps) => {
  if (isLoading) return <OrderListSkeleton />;
  if (orders.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          callbacks={callbacks}
          onReviewItem={onReviewItem}
        />
      ))}
    </div>
  );
};

export default OrderList;
