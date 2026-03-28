// src/shared/api/client.ts
//
// Token strategy:
//   • Access token  — stored in module-level variable (in-memory only).
//                     Never touches localStorage / sessionStorage / cookies.
//                     Lost on page refresh → silently restored via /v1/refresh-token.
//   • Refresh token — HttpOnly cookie set by the server. Browser sends it
//                     automatically. JS can never read or steal it.

import axios from "axios";

// ── In-memory access token ────────────────────────────────────────────────────

let accessToken: string | null = null;
// Decoded expiry stored as a Unix timestamp (ms) so AuthProvider can
// schedule a proactive refresh without re-decoding on every tick.
let tokenExpiresAt: number | null = null;

export function setToken(token: string): void {
  accessToken = token;
  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Decode the JWT expiry (middle base64 segment) — no library needed.
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // `exp` is in seconds; convert to ms for Date / setTimeout compatibility.
    tokenExpiresAt = payload.exp ? payload.exp * 1000 : null;
  } catch {
    tokenExpiresAt = null;
  }
}

export function clearToken(): void {
  accessToken = null;
  tokenExpiresAt = null;
  delete client.defaults.headers.common["Authorization"];
}

export function getToken(): string | null {
  return accessToken;
}

/** Returns ms until the access token expires, or null if unknown. */
export function getTokenExpiresIn(): number | null {
  if (!tokenExpiresAt) return null;
  return tokenExpiresAt - Date.now();
}

// ── Axios instance ────────────────────────────────────────────────────────────

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // sends HttpOnly refreshToken cookie automatically
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── 401 silent refresh ────────────────────────────────────────────────────────
// When any request returns 401 (access token expired mid-session):
//   1. Call POST /v1/refresh-token once — browser sends HttpOnly cookie.
//   2. Store the new access token in memory.
//   3. Retry all queued requests with the new token.
// If refresh itself fails → dispatch `auth:session-expired` so AuthProvider
// can clean up state and redirect without a circular import.

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(token: string) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

client.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    const isAuthEndpoint = [
      "/v1/refresh-token",
      "/v1/login",
      "/v1/register",
    ].some((path) => original.url?.includes(path));

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;

      // Queue concurrent requests while a refresh is already in-flight.
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            original.headers["Authorization"] = `Bearer ${token}`;
            resolve(client(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await client.post<{
          data: { accessToken: string };
        }>("/v1/refresh-token");

        const newToken = data.data.accessToken;
        setToken(newToken);
        processQueue(newToken);

        original.headers["Authorization"] = `Bearer ${newToken}`;
        return client(original);
      } catch (refreshError) {
        refreshQueue = [];
        clearToken();
        // Let AuthProvider handle state cleanup and redirect.
        window.dispatchEvent(new Event("auth:session-expired"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Flatten Laravel validation / error messages for toast consumers.
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.response?.status === 422) {
      const errors: Record<string, string[]> =
        error.response.data?.errors ?? {};
      const first = Object.values(errors)[0]?.[0];
      if (first) error.message = first;
    }

    return Promise.reject(error);
  },
);
