// src/routes/GuestRoute.tsx
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMe } from "@/features/auth/api/user.queries";

export default function GuestRoute() {
  const { data: user, isLoading } = useMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: "/" }); // redirect logged-in users to home
    }
  }, [isLoading, user, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (user) return null; // prevent flash

  return <Outlet />;
}
