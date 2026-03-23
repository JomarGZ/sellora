import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address } from "../types";
import { mockAddresses } from "@/data";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useAddresses() {
  return useQuery({
    queryKey: ["profile", "addresses"],
    queryFn: async (): Promise<Address[]> => {
      await delay(1000);
      return mockAddresses;
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
