import type {
  DeleteUserAddressesResponse,
  UserAddressesResponse,
  UserAddressResponse,
} from "../types";
import { client } from "@/shared/api/client";
import type { AddressFormValues } from "../validation/address.schema";

export async function createUserAddress(
  payload: AddressFormValues,
): Promise<UserAddressResponse> {
  const { data } = await client.post<UserAddressResponse>(
    "/v1/user/address",
    payload,
  );
  return data;
}
export async function getUserAddress(id: number): Promise<UserAddressResponse> {
  const { data } = await client.get(`/v1/user/address/${id}`);
  return data;
}

export async function getUserAddresses(): Promise<UserAddressesResponse> {
  const { data } = await client.get("/v1/user/address");
  return data;
}

export async function updateUserAddress({
  id,
  ...payload
}: AddressFormValues & { id: number }): Promise<UserAddressResponse> {
  const { data } = await client.put(`/v1/user/address/${id}`, payload);
  return data;
}

export async function deleteUserAddress(
  id: number,
): Promise<DeleteUserAddressesResponse> {
  const { data } = await client.delete(`/v1/user/address/${id}`);
  return data;
}

export async function setDefaultUserAddress(
  id: number,
): Promise<UserAddressResponse> {
  const { data } = await client.put(`/v1/user/address/${id}/default`);
  return data;
}
