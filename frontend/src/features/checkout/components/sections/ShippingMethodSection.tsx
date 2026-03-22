import type { ShippingMethod } from "@/types/checkout";
import { ShippingMethodCard } from "../ui/ShippingMethodCard";
import { ErrorFallback } from "../states/ErrorFallback";
import { ShippingSkeleton } from "../states/ShippingSkeleton";

interface ShippingMethodSectionProps {
  methods: ShippingMethod[];
  loading: boolean;
  error: Error | null;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onRetry: () => void;
}

export function ShippingMethodSection({
  methods,
  loading,
  error,
  selectedId,
  onSelect,
  onRetry,
}: ShippingMethodSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        Shipping Method
      </h2>

      {loading ? (
        <ShippingSkeleton />
      ) : error ? (
        <ErrorFallback
          message="Failed to load shipping methods"
          onRetry={onRetry}
        />
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <ShippingMethodCard
              key={method.id}
              method={method}
              selected={selectedId === method.id}
              onSelect={() => onSelect(method.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
