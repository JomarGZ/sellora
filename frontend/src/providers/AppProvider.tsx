import { AppToastProvider } from "@/shared/components/feedback/AppToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </AppToastProvider>
    </QueryClientProvider>
  );
}
