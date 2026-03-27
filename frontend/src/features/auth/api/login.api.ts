// src/features/auth/api/login.api.ts

import { client } from "@/shared/api/client";
import type { LoginPayload, LoginResponse } from "@/shared/types/auth";

/**
 * POST /login
 *
 * 1. Fetches Sanctum CSRF cookie  → sets `XSRF-TOKEN` cookie.
 * 2. Posts credentials            → Axios sends `X-XSRF-TOKEN` automatically.
 */
export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>("/v1/login", payload);
  return data;
}
