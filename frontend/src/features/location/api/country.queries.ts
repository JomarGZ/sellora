import { useQuery } from "@tanstack/react-query";
import { getCountries } from "./country.api";

export function useCountries(search?: string) {
  return useQuery({
    queryKey: ["countries", search],
    queryFn: () => getCountries(search),
    staleTime: Infinity,
  });
}
