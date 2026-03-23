import { mockCustomer, type Customer } from "@/data/mockProfile";
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

export function useUpdateSettings() {
  return useMutation({
    mutationFn: async (settings: any) => {
      await delay(1000);
      return settings;
    },
  });
}
