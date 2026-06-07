import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrderItemReview,
  getOrders,
  markOrderAsReceived,
  requestOrderCancellation,
} from "./order.api";
import { useAppToast } from "@/shared/components/feedback/AppToast";

export function useOrdersList(page?: number) {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => getOrders(page),
  });
}

export function useCreateOrderItemReview() {
  const { showToast } = useAppToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderItemReview,

    onSuccess: async (response) => {
      // 1. always run toast
      showToast({
        severity: "success",
        summary: "Review added",
        detail: response.message ?? "Review added to the item successfully.",
      });

      // 2. always invalidate
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      // 3. run component-level onSuccess
    },
  });
}

export function useRequestOrderCancellation() {
  const { showToast } = useAppToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestOrderCancellation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      showToast({
        severity: "success",
        summary: "Request submitted",
        detail: "Cancel request submitted successfully.",
      });
    },
    onError: () => {
      showToast({
        severity: "error",
        summary: "Request error",
        detail: "Cancel request submit failed.",
      });
    },
  });
}

export function useMarkOrderAsReceived() {
  const { showToast } = useAppToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markOrderAsReceived,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      showToast({
        severity: "success",
        summary: "Mark Received",
        detail: "Mark order received successfully.",
      });
    },
    onError: () => {
      showToast({
        severity: "error",
        summary: "Received error",
        detail: "Mark order received failed.",
      });
    },
  });
}
