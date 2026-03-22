import type { CheckoutItem, ShippingMethod } from "@/types/checkout";
import { Separator } from "@/components/ui/separator";
import { PlaceOrderButton } from "../ui/PlaceOrderButton";

interface OrderSummarySectionProps {
  items: CheckoutItem[];
  shippingMethod: ShippingMethod | null;
  canPlaceOrder: boolean;
  placing: boolean;
  onPlaceOrder: () => void;
}

export function OrderSummarySection({
  items,
  shippingMethod,
  canPlaceOrder,
  placing,
  onPlaceOrder,
}: OrderSummarySectionProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = shippingMethod?.price ?? 0;
  const total = subtotal + shippingFee;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-lg font-semibold text-card-foreground">
        Order Summary
      </h2>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({items.length} items)
          </span>
          <span className="text-card-foreground">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-card-foreground">
            {shippingMethod ? `$${shippingFee.toFixed(2)}` : "—"}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold text-card-foreground">Total</span>
          <span className="text-xl font-bold text-card-foreground">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <PlaceOrderButton
        disabled={!canPlaceOrder}
        loading={placing}
        onClick={onPlaceOrder}
        className="mt-5"
      />
    </div>
  );
}
