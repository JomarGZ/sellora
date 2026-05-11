import { ErrorFallback } from "../states/ErrorFallback";
import { ShippingSkeleton } from "../states/ShippingSkeleton";
import { useShippingOption } from "../../api/checkout.queries";
import { Check, Truck } from "lucide-react";
interface ShippingMethodProps {
  shippingOption: {};
  isLoading: boolean;
  refetch: () => void;
  error: any;
}
export function ShippingMethodSection({
  shippingOption,
  isLoading,
  refetch,
  error,
}: ShippingMethodProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        Shipping Method
      </h2>

      {isLoading ? (
        <ShippingSkeleton />
      ) : error ? (
        <ErrorFallback
          message="Failed to load shipping methods"
          onRetry={refetch}
        />
      ) : (
        <div className="space-y-3">
          <div className="relative w-full rounded-lg border-2 p-4 text-left transition-all duration-150 border-selection bg-selection-light">
            <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-selection">
              <Check className="h-3 w-3 text-accent-foreground" />
            </div>

            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium text-card-foreground">
                  {shippingOption.data.name}
                </span>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {shippingOption.data.estimated_days === 1
                    ? "Next day delivery"
                    : `${shippingOption.data.estimated_days}-${shippingOption.data.estimated_days + 2} business days`}
                </p>
              </div>
              <span className="font-semibold text-card-foreground">
                ${shippingOption.data.price}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
