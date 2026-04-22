import { client } from "@/shared/api/client";

export async function getCities(params: {
  search?: string;
  country_id: number;
}) {
  const { data } = await client.get("cities", {
    params: {
      search: params.search,
      "filters[country_id]": params.country_id,
    },
  });

  return data;
}
