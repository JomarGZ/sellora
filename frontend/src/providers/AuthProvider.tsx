import { client, initCsrf } from "@/shared/api/client";
import { queryClient } from "@/shared/api/queryClient";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import type { User } from "@/shared/types/auth";
import { useRouter } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggingOut: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AppProviders>");
  return ctx;
}

// ── Inner provider (needs useAppToast, so must be inside AppToastProvider) ────

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
  const { showToast } = useAppToast();
  const router = useRouter();

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await initCsrf();
      await client.post("/logout");
      setUser(null);
      // Clear all cached query data on logout so no user-specific
      // data leaks to the next session.
      queryClient.clear();
      showToast({
        severity: "success",
        summary: "Logged out",
        detail: "You have been successfully logged out.",
      });
      router.navigate({ to: "/login" });
    } catch {
      showToast({
        severity: "error",
        summary: "Logout failed",
        detail: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  }, [router, showToast]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggingOut, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
