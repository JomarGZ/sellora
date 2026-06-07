import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  checkout,
  getDefaultShipping,
  placeOrder,
  preview,
} from "./checkout.api";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import { useNavigate } from "@tanstack/react-router";

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

export function useCheckoutPreview(options?: UseMutationOptions<any, any>) {
  const { showToast } = useAppToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: preview,
    onSuccess: (data) => {
      queryClient.setQueryData(["checkout-preview"], data);
      navigate({ to: "/checkout" });
    },
    onError: () => {
      showToast({
        severity: "error",
        summary: "Failed",
        detail: "Unable to proceed to checkout",
      });
    },
    ...options,
  });
}

export function useShippingOption() {
  return useQuery({
    queryKey: ["shipping-option"],
    queryFn: getDefaultShipping,
  });
}

export function usePlaceOrder(options?: UseMutationOptions<any, any, string>) {
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
