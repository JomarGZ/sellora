import type { OrderItem } from "@/shared/types";
import OrderItemCard from "../ui/OrderItemCard";
import type { ReviewPayload } from "../../types";

interface OrderItemsListProps {
  items: OrderItem[];
  onReview: (payload: ReviewPayload) => void;
}

const OrderItemsList = ({ items, onReview }: OrderItemsListProps) => (
  <div className="divide-y divide-border">
    {items.map((item) => (
      <OrderItemCard key={item.id} item={item} onReview={onReview} />
    ))}
  </div>
);

export default OrderItemsList;
