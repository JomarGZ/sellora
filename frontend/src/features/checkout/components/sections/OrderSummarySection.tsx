import { Separator } from "@/shared/components/ui/separator";
import { PlaceOrderButton } from "../ui/PlaceOrderButton";
import type { OrderSummary } from "../../types";

interface OrderSummarySectionProps {
  orderSummary: OrderSummary;
  placing: boolean;
  onPlaceOrder: () => void;
}

export function OrderSummarySection({
  orderSummary,
  placing,
  onPlaceOrder,
}: OrderSummarySectionProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-lg font-semibold text-card-foreground">
        Order Summary
      </h2>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({orderSummary.items_count} items)
          </span>
          <span className="text-card-foreground">
            ${orderSummary.subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-card-foreground">
            {orderSummary.shipping_fee
              ? `$${orderSummary.shipping_fee.toFixed(2)}`
              : "—"}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold text-card-foreground">Total</span>
          <span className="text-xl font-bold text-card-foreground">
            ${orderSummary.total.toFixed(2)}
          </span>
        </div>
      </div>

      <PlaceOrderButton
        loading={placing}
        onClick={onPlaceOrder}
        className="mt-5"
      />
    </div>
  );
}
