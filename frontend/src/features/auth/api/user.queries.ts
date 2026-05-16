import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchMe, updateProfile } from "./user.api";
import { useAppToast } from "@/shared/components/feedback/AppToast";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });
}

export function useUpdateProfile() {
  const { showToast } = useAppToast();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      showToast({
        severity: "success",
        summary: "Profile updated",
        detail: "Profile updated successfully.",
      });
    },
    onError: (error) => {
      showToast({
        severity: "error",
        summary: "Failed to update",
        detail: error.message ?? "Failed to update user information",
      });
    },
  });
}
