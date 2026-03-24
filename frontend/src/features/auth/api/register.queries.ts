// src/features/auth/api/register.queries.ts

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { registerApi } from "./register.api";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import { useAuth } from "@/providers/AuthProvider";
import type { RegisterPayload, RegisterResponse } from "@/shared/types/auth";

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

    onSuccess(data) {
      setUser(data.user);
      showToast({
        severity: "success",
        summary: "Account created",
        detail: data.message ?? "Welcome aboard! Your account is ready.",
      });
      router.navigate({ to: "/account" });
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
