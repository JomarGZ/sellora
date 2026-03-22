import { Card, CardContent } from "@/shared/components/ui/card";
import { format, parseISO } from "date-fns";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderItemsList from "../sections/OrderItemsList";
import OrderActions from "./OrderActions";
import type { Order, OrderCallbacks, OrderItem } from "../../types";

interface OrderCardProps {
  order: Order;
  callbacks: OrderCallbacks;
  onReviewItem: (orderId: string, item: OrderItem) => void;
}

const OrderCard = ({ order, callbacks, onReviewItem }: OrderCardProps) => (
  <Card className="transition-shadow duration-150 hover:shadow-md">
    <CardContent className="p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            {order.id}
          </h3>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-xs text-muted-foreground">
          {format(parseISO(order.date), "MMM d, yyyy")}
        </p>
      </div>

      {/* Body – items */}
      <OrderItemsList
        items={order.items}
        orderStatus={order.status}
        orderId={order.id}
        callbacks={callbacks}
        onReviewItem={onReviewItem}
      />

      {/* Footer */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-3 mt-1">
        <p className="text-base font-bold text-foreground">
          Total: ${order.total.toFixed(2)}
        </p>
        <OrderActions order={order} callbacks={callbacks} />
      </div>
    </CardContent>
  </Card>
);

export default OrderCard;
