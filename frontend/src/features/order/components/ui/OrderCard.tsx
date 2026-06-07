import { Card, CardContent } from "@/shared/components/ui/card";
import { format, parseISO } from "date-fns";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderItemsList from "../sections/OrderItemsList";
import OrderActions from "./OrderActions";
import type { Order } from "@/shared/types";
import type { ReviewPayload } from "../../types";

interface OrderCardProps {
  order: Order;
  onReview: (payload: ReviewPayload) => void;
  markReceivedLoading: boolean;
  requestCancellationLoading: boolean;
  onMarkReceived: (orderId: number) => void;
  onRequestCancellation: (orderId: number) => void;
}

const OrderCard = ({
  order,
  onReview,
  markReceivedLoading,
  requestCancellationLoading,
  onMarkReceived,
  onRequestCancellation,
}: OrderCardProps) => {
  return (
    <Card className="transition-shadow duration-150 hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              ORDER-{order.id}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(order.placed_at), "MMM d, yyyy")}
          </p>
        </div>

        {/* Body – items */}
        <OrderItemsList items={order.items} onReview={onReview} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-3 mt-1">
          {/* Breakdown */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              Subtotal:{" "}
              <span className="text-foreground font-medium">
                ${order.subtotal}
              </span>
            </p>
            <p>
              Shipping:{" "}
              <span className="text-foreground font-medium">
                ${order.shipping_fee}
              </span>
            </p>
          </div>

          {/* Total */}
          <p className="text-base font-bold text-foreground">
            Total: ${order.total}
          </p>
        </div>
        <OrderActions
          order={order}
          markReceivedLoading={markReceivedLoading}
          requestCancellationLoading={requestCancellationLoading}
          onMarkReceived={onMarkReceived}
          onRequestCancellation={onRequestCancellation}
        />
      </CardContent>
    </Card>
  );
};

export default OrderCard;
