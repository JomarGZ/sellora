import { client } from "@/shared/api/client";

export async function getCities(params: {
  search?: string;
  country_id: number;
  city_id?: number;
}) {
  const { data } = await client.get("cities", {
    params: {
      ...(params.search && { search: params.search }),

      "filters[country_id]": params.country_id,

      ...(params.city_id && {
        "filters[id]": params.city_id,
      }),
    },
  });

  return data;
}
