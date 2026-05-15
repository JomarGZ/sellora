import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { loginApi } from "./login.api";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import { setToken } from "@/shared/api/client";
import { queryClient } from "@/shared/api/queryClient";
import type { LoginPayload, LoginResponse } from "@/shared/types/auth";

export function useLoginMutation() {
  const { showToast } = useAppToast();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginApi,

    onSuccess(response) {
      const { accessToken, user } = response.data;

      // 1. Save token
      setToken(accessToken);

      // 2. PRIME React Query cache (source of truth)
      queryClient.setQueryData(["me"], user);

      // 3. (optional but recommended) force refetch if needed
      queryClient.invalidateQueries({ queryKey: ["me"] });

      // 4. success UI
      showToast({
        severity: "success",
        summary: "Welcome back",
        detail: response.message ?? "You have successfully logged in.",
      });

      // 5. redirect
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
