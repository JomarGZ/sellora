// src/features/auth/api/login.queries.ts

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { loginApi } from "./login.api";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import { useAuth } from "@/providers/AuthProvider";
import type { LoginPayload, LoginResponse } from "@/shared/types/auth";
import { setToken } from "@/shared/api/client";

/**
 * useLoginMutation
 *
 * Usage in LoginForm:
 *   const { mutate: login, isPending } = useLoginMutation();
 *   login({ email, password, remember });
 */
export function useLoginMutation() {
  const { setUser } = useAuth();
  const { showToast } = useAppToast();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginApi,

    onSuccess(response) {
      const { accessToken, user } = response.data;
      // setToken(response.data.token);
      // setUser(response.data.user);
      showToast({
        severity: "success",
        summary: "Welcome back",
        detail: data.message ?? "You have successfully logged in.",
      });
      router.navigate({ to: "/account/overview" });
    },

    onError(error) {
      showToast({
        severity: "error",
        summary: "Login failed",
        detail: error.message ?? "Something went wrong. Please try again.",
      });
    },
  });
}
