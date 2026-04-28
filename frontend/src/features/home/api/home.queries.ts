import { useQuery } from "@tanstack/react-query";
import { getBestSellerProducts, getNewArrivalProducts } from "./home.api";

export function useNewArrivalProducts() {
  return useQuery({
    queryKey: ["newArrivalProducts"],
    queryFn: getNewArrivalProducts,
  });
}

export function useBestSellerProducts() {
  return useQuery({
    queryKey: ["bestSellerProducts"],
    queryFn: getBestSellerProducts,
  });
}
