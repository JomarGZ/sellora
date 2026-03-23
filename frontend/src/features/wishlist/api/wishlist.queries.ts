import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WishlistItem } from "../types";
import { mockWishlist } from "@/data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useWishlist() {
  return useQuery({
    queryKey: ["profile", "wishlist"],
    queryFn: async (): Promise<WishlistItem[]> => {
      await delay(1800);
      return mockWishlist;
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(500);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "wishlist"] });
    },
  });
}
