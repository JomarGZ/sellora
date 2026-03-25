// src/features/auth/api/register.queries.ts

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { registerApi } from "./register.api";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import { useAuth } from "@/providers/AuthProvider";
import type { RegisterPayload, RegisterResponse } from "@/shared/types/auth";
import { client, setToken } from "@/shared/api/client";

/**
 * useRegisterMutation
 *
 * Usage in RegisterForm:
 *   const { mutate: register, isPending } = useRegisterMutation();
 *   register({ name, email, password, password_confirmation });
 */
export function useRegisterMutation() {
  const { setUser } = useAuth();
  const { showToast } = useAppToast();
  const router = useRouter();

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: registerApi,

    onSuccess(response) {
      const { accessToken, user } = response.data;
      setToken(accessToken);
      setUser(user);
      client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      showToast({
        severity: "success",
        summary: "Account created",
        detail: response.message ?? "Welcome aboard! Your account is ready.",
      });
      router.navigate({ to: "/account/overview" });
    },

    onError(error) {
      showToast({
        severity: "error",
        summary: "Registration failed",
        detail: error.message ?? "Something went wrong. Please try again.",
      });
    },
  });
}
