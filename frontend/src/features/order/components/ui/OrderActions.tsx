import { Button } from "@/components/ui/button";
import { ShoppingCart, X, PackageCheck } from "lucide-react";
import {
  CANCELLABLE_STATUSES,
  RECEIVABLE_STATUSES,
  type Order,
  type OrderCallbacks,
} from "../../types";

interface OrderActionsProps {
  order: Order;
  callbacks: OrderCallbacks;
}

/**
 * Order-level action buttons.
 * - Cancel: only if status ∈ CANCELLABLE_STATUSES
 * - Receive: only if status ∈ RECEIVABLE_STATUSES
 * - Order Again: always visible, disabled if ALL items are out of stock
 */
const OrderActions = ({ order, callbacks }: OrderActionsProps) => {
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);
  const canReceive = RECEIVABLE_STATUSES.includes(order.status);
  const allOutOfStock = order.items.every((item) => !item.inStock);

  return (
    <div className="flex flex-wrap gap-2 pt-3">
      <Button
        size="sm"
        onClick={() => callbacks.onOrderAgain(order)}
        disabled={allOutOfStock}
        className="gap-1.5"
        title={allOutOfStock ? "All items are out of stock" : undefined}
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        Order Again
      </Button>

      {canReceive && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => callbacks.onReceive(order.id)}
          className="gap-1.5"
        >
          <PackageCheck className="h-3.5 w-3.5" />
          Confirm Receipt
        </Button>
      )}

      {canCancel && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => callbacks.onCancel(order.id)}
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
