import { Button } from "@/shared/components/ui/button";
import { ShoppingCart, X, PackageCheck } from "lucide-react";
import type { Order } from "@/shared/types";

interface OrderActionsProps {
  order: Order;
  markReceivedLoading: boolean;
  requestCancellationLoading: boolean;
  onMarkReceived: (orderId: number) => void;
  onRequestCancellation: (orderId: number) => void;
}

/**
 * Order-level action buttons.
 * - Cancel: only if status ∈ CANCELLABLE_STATUSES
 * - Receive: only if status ∈ RECEIVABLE_STATUSES
 * - Order Again: always visible, disabled if ALL items are out of stock
 */
const OrderActions = ({
  order,
  markReceivedLoading = false,
  requestCancellationLoading = false,
  onRequestCancellation,
  onMarkReceived,
}: OrderActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 pt-3">
      {order.can_mark_as_received && (
        <Button
          onClick={() => onMarkReceived(order.id)}
          disabled={markReceivedLoading}
          size="sm"
          variant="outline"
          className="gap-1.5"
        >
          <PackageCheck className="h-3.5 w-3.5" />
          Confirm Receipt
        </Button>
      )}

      {order.can_cancel && (
        <Button
          size="sm"
          onClick={() => onRequestCancellation(order.id)}
          disabled={requestCancellationLoading}
          variant="outline"
          className="gap-1.5 text-destructive hover:text-destructive"
        >
          <X className="h-3.5 w-3.5" />
          Cancel Order
        </Button>
      )}
    </div>
  );
};

export default OrderActions;
