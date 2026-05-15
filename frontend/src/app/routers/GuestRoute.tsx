// src/routes/GuestRoute.tsx
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function GuestRoute() {
  const { user, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && user) {
      navigate({ to: "/" }); // redirect logged-in users to home
    }
  }, [isInitializing, user, navigate]);

  if (isInitializing) return <div>Loading...</div>;
  if (user) return null; // prevent flash

  return <Outlet />;
}
