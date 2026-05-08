import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCartItem,
  buyNowItem,
  deleteCartItem,
  getCart,
  updateCartItemQuantity,
} from "./cart.api";

import { useAppToast } from "@/shared/components/feedback/AppToast";
import { useNavigate, type HistoryState } from "@tanstack/react-router";
import type { CartItem, CartItemResponse } from "../types";

export function useCartQuery(page: number) {
  return useQuery({
    queryKey: ["cart", page],
    queryFn: () => getCart({ page: page }),
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();

  return useMutation({
    mutationFn: addCartItem,

    onSuccess() {
      showToast({
        severity: "success",
        summary: "Added to Cart",
        detail: "Successfully added to cart.",
      });

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError(error: any) {
      showToast({
        severity: "error",
        summary: "Failed",
        detail: error?.message ?? "Unable to add item to cart.",
      });
    },
  });
}

export function useBuyNowMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();

  return useMutation({
    mutationFn: buyNowItem,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError(error: any) {
      showToast({
        severity: "error",
        summary: "Failed",
        detail: error?.message ?? "Unable to proceed to checkout.",
      });
    },
  });
}

export function useUpdateCartItemQuantityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItemQuantity,
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["cart"],
      });

      queryClient.setQueriesData(
        { queryKey: ["cart"] },
        (old: CartItemResponse | undefined) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((item: CartItem) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          };
        },
      );

      return { previousQueries };
    },
    onError: (_error, _variables, context) => {
      // rollback
      context?.previousQueries?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useDeleteCartItemMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();
  return useMutation({
    mutationFn: deleteCartItem,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["cart"],
      });

      queryClient.setQueriesData(
        { queryKey: ["cart"] },
        (old: CartItemResponse | undefined) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.filter((item: any) => item.id !== id),
            meta: old.meta
              ? {
                  ...old.meta,
                  total: Math.max(0, old.meta.total - 1),
                }
              : old.meta,
          };
        },
      );

      return { previousQueries };
    },
    onError(error, _, context) {
      context?.previousQueries?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      showToast({
        severity: "error",
        summary: "Failed",
        detail: error?.message ?? "Unable to delete address.",
      });
    },
    onSuccess: () => {
      showToast({
        severity: "success",
        summary: "Removed",
        detail: "Item removed from cart.",
      });
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}
