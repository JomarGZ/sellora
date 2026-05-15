import { client } from "@/shared/api/client";

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await client.post("/v1/me/avatar", formData);
  return data;
}
