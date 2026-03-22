import { mockAddresses, mockOrders, mockWishlist } from "@/data";
import { mockCustomer, type Customer } from "@/data/mockProfile";
import type { Address, Order, WishlistItem } from "@/shared/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Utility to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useCustomerProfile() {
  return useQuery({
    queryKey: ["profile", "customer"],
    queryFn: async (): Promise<Customer> => {
      await delay(1200);
      return mockCustomer;
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["profile", "orders"],
    queryFn: async (): Promise<Order[]> => {
      await delay(1500);
      return mockOrders;
    },
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: ["profile", "addresses"],
    queryFn: async (): Promise<Address[]> => {
      await delay(1000);
      return mockAddresses;
    },
  });
}

export function useWishlist() {
  return useQuery({
    queryKey: ["profile", "wishlist"],
    queryFn: async (): Promise<WishlistItem[]> => {
      await delay(1800);
      return mockWishlist;
    },
  });
}

// Simulated Mutations
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Customer>) => {
      await delay(800);
      return { ...mockCustomer, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "customer"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(600);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "addresses"] });
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

export function useUpdateSettings() {
  return useMutation({
    mutationFn: async (settings: any) => {
      await delay(1000);
      return settings;
    },
  });
}
