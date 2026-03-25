import { client, setToken, clearToken } from "@/shared/api/client";
import { queryClient } from "@/shared/api/queryClient";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import type { User } from "@/shared/types/auth";
import { useRouter } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggingOut: boolean;
  isInitializing: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AppProviders>");
  return ctx;
}

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
  const router = useRouter();

  // 🔥 Restore session on app load using refresh token cookie
  useEffect(() => {
    async function initSession() {
      try {
        const { data } = await client.post("/v1/refresh-token");
        setToken(data.data.accessToken);
        setUser(data.data.user);
      } catch {
        // Not logged in (refresh token expired or missing)
        clearToken();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    initSession();
  }, []);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await client.post("/v1/logout");
    } catch {
      // ignore error, still logout locally
    } finally {
      clearToken(); // remove Authorization header
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
  }, [router, showToast]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoggingOut, isInitializing, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
