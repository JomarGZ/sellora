// src/features/auth/api/login.api.ts

import type { LoginPayload, LoginResponse } from "@/shared/types/auth";

/**
 * POST /login
 *
 * 1. Fetches Sanctum CSRF cookie  → sets `XSRF-TOKEN` cookie.
 * 2. Posts credentials            → Axios sends `X-XSRF-TOKEN` automatically.
 */
// export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
//   await initCsrf();
//   const { data } = await client.post<LoginResponse>("/login", payload);
//   return data;
// }

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500));

  // Dummy login check
  if (payload.email === "test@example.com" && payload.password === "123456") {
    return {
      user: { id: 1, name: "Test User", email: payload.email },
      message: "Logged in successfully",
    };
  }

  throw new Error("Invalid credentials"); // This triggers onError
}
