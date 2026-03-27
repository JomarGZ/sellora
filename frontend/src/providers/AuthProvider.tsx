// src/providers/AuthProvider.tsx

import { router } from "@/app/routers/router";
import {
  client,
  setToken,
  clearToken,
  getTokenExpiresIn,
} from "@/shared/api/client";
import { queryClient } from "@/shared/api/queryClient";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import type { User } from "@/shared/types/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

/** Refresh the access token this many ms before it expires. */
const REFRESH_BEFORE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

/** Minimum delay between proactive refresh attempts (safety guard). */
const MIN_REFRESH_INTERVAL_MS = 30 * 1000; // 30 seconds

// ── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggingOut: boolean;
  /** True while the app is checking for an existing session on first load. */
  isInitializing: boolean;
  logout: () => Promise<void>;
  /**
   * Call this after storing a new access token (login / register) to kick
   * off the proactive refresh schedule for that token.
   */
  scheduleProactiveRefresh: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AppProviders>");
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { showToast } = useAppToast();

  const proactiveRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // ── Proactive token refresh ─────────────────────────────────────────────────
  // Reads the decoded expiry from the current in-memory token (via
  // getTokenExpiresIn) and schedules a refresh to fire 15 minutes before
  // expiry. After each successful refresh, reschedules itself for the new token.
  // This keeps long-lived sessions alive without the user ever hitting a 401.

  const scheduleProactiveRefresh = useCallback(() => {
    if (proactiveRefreshTimer.current) {
      clearTimeout(proactiveRefreshTimer.current);
      proactiveRefreshTimer.current = null;
    }

    const expiresIn = getTokenExpiresIn();

    // Skip if expiry is unknown or the token is already nearly expired —
    // the 401 interceptor will handle it reactively in that case.
    if (!expiresIn || expiresIn <= REFRESH_BEFORE_EXPIRY_MS) return;

    const delay = Math.max(
      expiresIn - REFRESH_BEFORE_EXPIRY_MS,
      MIN_REFRESH_INTERVAL_MS,
    );

    proactiveRefreshTimer.current = setTimeout(async () => {
      try {
        const { data } = await client.post<{
          data: { accessToken: string; user: User };
        }>("/v1/refresh-token");

        setToken(data.data.accessToken);
        if (data.data.user) setUser(data.data.user);

        // Reschedule for the new token's expiry.
        scheduleProactiveRefresh();
      } catch {
        // Proactive refresh failed quietly — the reactive 401 interceptor
        // in client.ts will recover the session on the next API call.
      }
    }, delay);
  }, []);

  // ── Session init on mount ───────────────────────────────────────────────────
  // On every page load the in-memory token is gone. Call /v1/refresh-token
  // immediately — the browser sends the HttpOnly refreshToken cookie
  // automatically. On success, restore the token + user and start the
  // proactive refresh schedule.

  useEffect(() => {
    async function initSession() {
      try {
        const response = await client.post<{
          data: { accessToken: string; user: User };
        }>("/v1/refresh-token");
        const { data } = response.data;
        setToken(data.accessToken);
        setUser(data.user);
        scheduleProactiveRefresh();
      } catch {
        // No valid refresh token — user is simply not logged in.
        clearToken();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    initSession();

    return () => {
      if (proactiveRefreshTimer.current) {
        clearTimeout(proactiveRefreshTimer.current);
      }
    };
  }, [scheduleProactiveRefresh]);

  // ── Session expired (dispatched by the 401 interceptor in client.ts) ────────
  // When a reactive 401 refresh also fails (refresh token revoked / expired),
  // the interceptor dispatches this event to avoid a circular import with router.

  useEffect(() => {
    function handleSessionExpired() {
      if (proactiveRefreshTimer.current) {
        clearTimeout(proactiveRefreshTimer.current);
        proactiveRefreshTimer.current = null;
      }
      setUser(null);
      queryClient.clear();
      showToast({
        severity: "error",
        summary: "Session expired",
        detail: "Please log in again to continue.",
      });
      router.navigate({ to: "/login" });
    }

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [showToast]);

  // ── Manual logout ───────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    if (proactiveRefreshTimer.current) {
      clearTimeout(proactiveRefreshTimer.current);
      proactiveRefreshTimer.current = null;
    }

    setIsLoggingOut(true);
    try {
      await client.post("/v1/logout");
    } catch {
      // Always clean up locally even if the server call fails.
    } finally {
      clearToken();
      setUser(null);
      queryClient.clear();
      showToast({
        severity: "success",
        summary: "Logged out",
        detail: "You have been successfully logged out.",
      });
      router.navigate({ to: "/login" });
      setIsLoggingOut(false);
    }
  }, [showToast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggingOut,
        isInitializing,
        logout,
        scheduleProactiveRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
