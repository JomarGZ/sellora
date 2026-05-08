import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import type { Summary } from "../../types";

interface CartSummaryProps {
  summary: Summary;
}

export function CartSummary({ summary }: CartSummaryProps) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-border/50 p-6 shadow-sm sticky top-8">
      <h3 className="text-lg font-bold font-display mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between text-muted-foreground">
          <span>Items</span>
          <span className="text-foreground font-medium">{summary.count}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-base font-bold font-display">
          <span>Total</span>
          <span className="text-primary">${summary.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <Input placeholder="Promo code" className="rounded-xl" />
        <Button variant="outline" className="rounded-xl">
          Apply
        </Button>
      </div>

      <Button className="w-full rounded-xl py-6 text-base font-bold" size="lg">
        Checkout
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Secure checkout powered by Stripe
      </p>
    </div>
  );
}
