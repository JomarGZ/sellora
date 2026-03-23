import { useQuery } from "@tanstack/react-query";
import type { Order } from "../types";
import { mockOrders } from "@/data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useOrders() {
  return useQuery({
    queryKey: ["profile", "orders"],
    queryFn: async (): Promise<Order[]> => {
      await delay(1500);
      return mockOrders;
    },
  });
}
