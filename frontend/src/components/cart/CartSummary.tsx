import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

const CartSummary = ({ subtotal, itemCount }: CartSummaryProps) => {
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="bg-card rounded-lg p-6 lg:sticky lg:top-8 shadow-sm border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({itemCount} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between text-foreground font-semibold text-base">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button className="w-full mt-6" size="lg">
        Checkout
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        {subtotal < 100 &&
          `Add $${(100 - subtotal).toFixed(2)} more for free shipping`}
        {subtotal >= 100 && "You qualify for free shipping!"}
      </p>
    </div>
  );
};

export default CartSummary;
