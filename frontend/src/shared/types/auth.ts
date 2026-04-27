import type { ApiResponse } from ".";

export interface AuthPayload {
  user: User;
  accessToken: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar?: string | null;
  created_at: string;
  updated_at: string;
}

// ── Login ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export type LoginResponse = ApiResponse<AuthPayload>;

// ── Register ──────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export type RegisterResponse = ApiResponse<AuthPayload>;

// ── Logout ────────────────────────────────────────────────────────────────────

export interface LogoutResponse {
  message: string;
}
