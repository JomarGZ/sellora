import { useCheckoutPreview } from "@/features/checkout/api/checkout.queries";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import { useNavigate } from "@tanstack/react-router";

interface CartSummaryProps {
  itemsCount: number;
  subtotal: number;
  isLoading: boolean;
}

export function CartSummary({
  itemsCount,
  isLoading = false,
  subtotal,
}: CartSummaryProps) {
  const CheckoutPreview = useCheckoutPreview();

  const handleCheckoutPreview = () => {
    CheckoutPreview.mutate();
  };

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-border/50 p-6 shadow-sm sticky top-8">
      <h3 className="text-lg font-bold font-display mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between text-muted-foreground">
          <span>Items</span>
          <span className="text-foreground font-medium">{itemsCount || 0}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-base font-bold font-display">
          <span>Total</span>
          <span className={cn("text-primary", isLoading && "opacity-60")}>
            ${subtotal || 0}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <Input placeholder="Promo code" className="rounded-xl" />
        <Button variant="outline" className="rounded-xl">
          Apply
        </Button>
      </div>

      <Button
        onClick={handleCheckoutPreview}
        className="w-full rounded-xl py-6 text-base font-bold"
        size="lg"
      >
        Checkout
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Secure checkout powered by Stripe
      </p>
    </div>
  );
}
