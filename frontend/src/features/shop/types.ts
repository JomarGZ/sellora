import type { ApiResponse } from "@/shared/types";

export type SortOption =
  | "default"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "rating";

export interface Category {
  id: number;
  name: string;
  slug: string;
  children?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

export interface FilterData {
  categories: Category[];
  brands: Brand[];
}

export type FilterResponse = ApiResponse<FilterData>;
