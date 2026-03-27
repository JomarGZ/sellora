// src/routes/ProtectedRoute.tsx
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { user, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !user) {
      navigate({ to: "/login" });
    }
  }, [isInitializing, user, navigate]);

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // prevent flash
  }

  return <Outlet />;
}
