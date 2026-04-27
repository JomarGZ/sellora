import { client } from "@/shared/api/client";

export async function getCountries(search?: string) {
  const { data } = await client.get("countries", {
    params: {
      search: search ?? "",
    },
  });

  return data;
}
