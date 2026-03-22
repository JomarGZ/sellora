import type { ShippingMethod } from "@/types/checkout";
import { Check, Truck } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ShippingMethodCardProps {
  method: ShippingMethod;
  selected: boolean;
  onSelect: () => void;
}

export function ShippingMethodCard({
  method,
  selected,
  onSelect,
}: ShippingMethodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-lg border-2 p-4 text-left transition-all duration-150",
        selected
          ? "border-selection bg-selection-light"
          : "border-border bg-card hover:border-muted-foreground/30",
      )}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-selection">
          <Check className="h-3 w-3 text-accent-foreground" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="flex-1">
          <span className="font-medium text-card-foreground">
            {method.name}
          </span>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {method.estimated_days === 1
              ? "Next day delivery"
              : `${method.estimated_days}-${method.estimated_days + 2} business days`}
          </p>
        </div>
        <span className="font-semibold text-card-foreground">
          ${method.price.toFixed(2)}
        </span>
      </div>
    </button>
  );
}
