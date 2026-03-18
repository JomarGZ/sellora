import { useState, useCallback } from "react";
import type { CheckoutPayload } from "@/types/checkout";
import { toast } from "sonner";

export function useCheckout() {
  const [placing, setPlacing] = useState(false);

  const placeOrder = useCallback(async (payload: CheckoutPayload) => {
    setPlacing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Order placed successfully!");
      return true;
    } catch {
      toast.error("Failed to place order. Please try again.");
      return false;
    } finally {
      setPlacing(false);
    }
  }, []);

  return { placing, placeOrder };
}
