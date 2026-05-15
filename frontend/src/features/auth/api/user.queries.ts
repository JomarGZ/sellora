import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "./user.api";
import { useAuth } from "@/providers/AuthProvider";

export function useMe() {
  const { isHydrated } = useAuth();

  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: isHydrated,
    retry: false,
  });
}
