// features/account/components/layout/AccountLayout.tsx
import { Outlet, useMatches } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";

import AccountSidebar from "./AccountSidebar";
import { Button } from "@/shared/components/ui/button";
import { ProfileHeader } from "@/features/account/components/ui/ProfileHeader";
import AccountMobileNav from "../navigation/AccountMobileNav";

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/10">
      <h2 className="text-xl font-bold text-destructive mb-2">
        Something went wrong
      </h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
}

export function AccountLayout() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const pageTitle = lastMatch.context?.pageTitle;
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header always visible */}
        <div className="mb-8">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ProfileHeader />
          </ErrorBoundary>
        </div>
        {true && <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Mobile nav */}
          <div className="lg:hidden">
            <AccountMobileNav />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Outlet />
              </motion.div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
