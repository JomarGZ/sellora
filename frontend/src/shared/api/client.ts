// src/shared/api/client.ts

import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const client = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Fetches the Sanctum CSRF cookie before any state-changing request.
 * Axios automatically reads the `XSRF-TOKEN` cookie and attaches it
 * as the `X-XSRF-TOKEN` request header on subsequent calls.
 */
export async function initCsrf(): Promise<void> {
  await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

// ── Response interceptor ──────────────────────────────────────────────────────
// Flatten Laravel validation errors into a single error.message so callers
// (queries, toast handlers) can use error.message directly.
client.interceptors.response.use(
  (response) => response,
  (error) => {
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
