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

// ── Constants ─────────────────────────────────────────────────────────────

const REFRESH_BEFORE_EXPIRY_MS = 15 * 60 * 1000;
const MIN_REFRESH_INTERVAL_MS = 30 * 1000;

// ── Context ───────────────────────────────────────────────────────────────

interface AuthContextValue {
  isLoggingOut: boolean;
  isInitializing: boolean;
  isHydrated: boolean;
  logout: () => Promise<void>;
  scheduleProactiveRefresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AppProviders>");
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { showToast } = useAppToast();
  const [isHydrated, setIsHydrated] = useState(false);
  const proactiveRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    async function init() {
      try {
        const { data } = await client.post("/v1/refresh-token");

        setToken(data.data.accessToken);

        // prime React Query cache immediately
        queryClient.setQueryData(["me"], data.data.user);
      } catch {
        clearToken();
        queryClient.clear();
      } finally {
        setIsHydrated(true); // 👈 allow /me query after this
      }
    }

    init();
  }, []);
  // ── Proactive Refresh ────────────────────────────────────────────────────

  const scheduleProactiveRefresh = useCallback(() => {
    if (proactiveRefreshTimer.current) {
      clearTimeout(proactiveRefreshTimer.current);
    }

    const expiresIn = getTokenExpiresIn();

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

        // 🔥 Update React Query user cache (source of truth)
        queryClient.setQueryData(["me"], data.data.user);

        scheduleProactiveRefresh();
      } catch {
        // silent fail → 401 interceptor handles recovery
      }
    }, delay);
  }, []);

  // ── Session Init (React Query owns user now) ─────────────────────────────

  useEffect(() => {
    if (isHydrated) {
      scheduleProactiveRefresh();
    }
  }, [isHydrated, scheduleProactiveRefresh]);

  // ── Session Expired Handler ──────────────────────────────────────────────

  useEffect(() => {
    function handleSessionExpired() {
      if (proactiveRefreshTimer.current) {
        clearTimeout(proactiveRefreshTimer.current);
      }

      queryClient.clear();
      clearToken();

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

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    if (proactiveRefreshTimer.current) {
      clearTimeout(proactiveRefreshTimer.current);
    }

    try {
      await client.post("/v1/logout");
    } catch {}

    clearToken();
    queryClient.clear();

    showToast({
      severity: "success",
      summary: "Logged out",
    });

    router.navigate({ to: "/login" });
  }, [showToast]);

  // ── Provider ──────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        isLoggingOut: false,
        isInitializing: !isHydrated,
        isHydrated,
        logout,
        scheduleProactiveRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
