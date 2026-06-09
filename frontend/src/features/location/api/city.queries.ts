import { useQuery } from "@tanstack/react-query";
import { getCities } from "./city.api";

export function useCities(
  countryId?: number,
  search?: string,
  cityId?: number,
) {
  const trimmedSearch = search?.trim();
  const isSearchMode = !!trimmedSearch && trimmedSearch.length >= 2;
  const isPrefillMode = !!cityId;

  return useQuery({
    queryKey: ["cities", countryId, cityId, trimmedSearch],
    queryFn: () =>
      getCities({
        country_id: countryId!,
        search: isSearchMode ? trimmedSearch : undefined,
        city_id: isPrefillMode ? cityId : undefined,
      }),
    enabled: !!countryId && (isSearchMode || isPrefillMode),
  });
}
