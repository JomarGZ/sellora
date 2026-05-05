import { useMutation } from "@tanstack/react-query";
import { checkout } from "./checkout.api";
import { useAppToast } from "@/shared/components/feedback/AppToast";

export function useCheckout() {
  const { showToast } = useAppToast();

  return useMutation({
    mutationFn: checkout,
    onError(error) {
      showToast({
        severity: "error",
        summary: "Checkout Failed",
        detail: error.message ?? "Unable to complete checkout.",
      });
    },
  });
}
