import { useQuery } from "@tanstack/react-query";
import { getCities } from "./city.api";

export function useCities(countryId?: number, search?: string) {
  return useQuery({
    queryKey: ["cities", countryId, search],
    queryFn: () =>
      getCities({
        country_id: countryId!,
        search,
      }),
    enabled: !!countryId && !!search?.trim() && search.trim().length >= 2,
  });
}
