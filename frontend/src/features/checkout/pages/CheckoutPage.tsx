import { ErrorBoundary } from "react-error-boundary";
import { CheckoutContent } from "@/features/checkout/components/sections/CheckoutContent";
import { ErrorFallback } from "@/features/checkout/components/states/ErrorFallback";
import { useState } from "react";
import { mockCartItems } from "@/data";
import type { CheckoutItem } from "../types";

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
