import { ErrorBoundary } from "react-error-boundary";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { ErrorFallback } from "@/components/checkout/ErrorFallback";
import { useState } from "react";
import type { CheckoutItem } from "@/types/checkout";
import { mockCartItems } from "@/data";

export default function CheckoutPage() {
  const [items, setItems] = useState<CheckoutItem[]>(mockCartItems);
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
