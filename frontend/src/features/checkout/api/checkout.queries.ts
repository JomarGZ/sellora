import {
  useMutation,
  useQuery,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  checkout,
  getCurrentCheckout,
  getDefaultShipping,
  placeOrder,
  createPreview,
} from "./checkout.api";
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

export function useCheckoutSnapshot(
  options?: UseMutationOptions<any, any, number[]>,
) {
  const { showToast } = useAppToast();

  return useMutation({
    mutationFn: createPreview,
    onError(error: any) {
      showToast({
        severity: "error",
        summary: "Failed",
        detail: error?.message ?? "Unable to proceed to add to cart",
      });
    },
    ...options,
  });
}

export function useCurrentCheckoutPreview() {
  return useQuery({
    queryKey: ["checkout-preview-data"],
    queryFn: getCurrentCheckout,
  });
}

export function useShippingOption() {
  return useQuery({
    queryKey: ["shipping-option"],
    queryFn: getDefaultShipping,
  });
}

export function usePlaceOrder(options?: UseMutationOptions<any, any, number>) {
  const { showToast } = useAppToast();

  return useMutation({
    mutationFn: placeOrder,
    onError(error: any) {
      showToast({
        severity: "error",
        summary: "Failed to place order",
        detail: error?.message ?? "Unable to proceed place an order",
      });
    },
    ...options,
  });
}
