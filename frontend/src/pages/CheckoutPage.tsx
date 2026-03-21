import { ErrorBoundary } from "react-error-boundary";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { ErrorFallback } from "@/components/checkout/ErrorFallback";
import { INITIAL_CART_ITEMS } from "@/data";
import { useState } from "react";
import type { CheckoutItem } from "@/types/checkout";

export default function CheckoutPage() {
  const [items, setItems] = useState<CheckoutItem[]>(INITIAL_CART_ITEMS);
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <ErrorFallback
            message="Something went wrong"
            onRetry={resetErrorBoundary}
          />
        </div>
      )}
    >
      <div className="min-h-screen bg-background">
        <CheckoutContent items={items} />
      </div>
    </ErrorBoundary>
  );
}
