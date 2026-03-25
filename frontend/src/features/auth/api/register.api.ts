// src/features/auth/api/register.api.ts

import { client } from "@/shared/api/client";
import type { RegisterPayload, RegisterResponse } from "@/shared/types/auth";

/**
 * POST /register
 *
 * 1. Fetches Sanctum CSRF cookie.
 * 2. Posts registration data — Sanctum creates the session on success.
 */
export async function registerApi(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await client.post<RegisterResponse>("/v1/register", payload);
  return data;
}

// export async function registerApi(
//   payload: RegisterPayload,
// ): Promise<RegisterResponse> {
//   // Simulate network delay
//   await new Promise((r) => setTimeout(r, 500));

//   // Return dummy user
//   return {
//     user: {
//       id: Math.floor(Math.random() * 1000) + 1,
//       name: payload.name,
//       email: payload.email,
//     },
//     message: "Account created successfully",
//   };
// }
