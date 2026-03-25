// src/shared/api/client.ts
//
// Token strategy:
//   • Access token  — stored in a module-level variable (in-memory only).
//                     Never touches localStorage/sessionStorage/cookies.
//                     Lost on page refresh → silently restored via /refresh.
//   • Refresh token — HttpOnly cookie set by the server. The browser sends
//                     it automatically. JS can never read or steal it.

import axios from "axios";

// ── In-memory access token ────────────────────────────────────────────────────
// Module scope = lives as long as the JS runtime, gone on hard refresh.

let accessToken: string | null = null;

export function setToken(token: string): void {
  accessToken = token;
  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearToken(): void {
  accessToken = null;
  delete client.defaults.headers.common["Authorization"];
}

export function getToken(): string | null {
  return accessToken;
}

// ── Axios instance ────────────────────────────────────────────────────────────

export const client = axios.create({
  baseURL: "http://localhost/api",
  withCredentials: true, // sends the HttpOnly refreshToken cookie automatically
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Silent token refresh ──────────────────────────────────────────────────────
// When a request returns 401 (access token expired), automatically call
// POST /refresh — the browser sends the HttpOnly refreshToken cookie.
// On success, store the new access token and retry the original request once.

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(token: string) {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
}

client.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    // Only attempt refresh on 401, and not on the /refresh or /login calls
    // themselves to avoid infinite loops.
    const isAuthEndpoint =
      original.url?.includes("/refresh") ||
      original.url?.includes("/login") ||
      original.url?.includes("/register");

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;

      // If a refresh is already in-flight, queue this request until it resolves.
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
        // POST /refresh — server reads the HttpOnly refreshToken cookie,
        // returns a new access token in the JSON body.
        const { data } = await client.post<{ data: { token: string } }>(
          "/v1/refresh",
        );
        const newToken = data.data.token;

        setToken(newToken);
        processQueue(newToken);

        original.headers["Authorization"] = `Bearer ${newToken}`;
        return client(original);
      } catch (refreshError) {
        // Refresh failed (cookie expired / revoked) → force logout.
        // Import is deferred to avoid circular dependency.
        clearToken();
        refreshQueue = [];
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Flatten Laravel validation errors into error.message for toast consumers.
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
