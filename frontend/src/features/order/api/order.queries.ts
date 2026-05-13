import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { createReviewItem, getOrders } from "./order.api";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import type { CreateReviewPayload } from "../types";

export function useOrdersList(page?: number) {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => getOrders(page),
  });
}

export function useReviewOrderItem() {
  const { showToast } = useAppToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReviewItem,

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
