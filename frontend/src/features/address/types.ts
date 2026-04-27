import type { ApiResponse } from "@/shared/types";
import { number } from "zod";

export interface Country {
  id: string;
  iso2: string;
  name: string;
  phone_code: string;
  iso3: string;
  region: string;
  sub_region: string;
}

export interface City {
  id: string;
  name: string;
  country_code: string;
  country: Country;
}

export interface AddressUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
  id: number;
  user: AddressUser;
  first_name: string;
  last_name: string;
  country_id: number;
  city_id: number;
  phone: string;
  country: Country;
  city: City;
  street_address: string;
  is_default: boolean;
}

export type UserAddressResponse = ApiResponse<UserAddress>;
export type UserAddressesResponse = ApiResponse<UserAddress[]>;
export type DeleteUserAddressesResponse = ApiResponse<null>;
