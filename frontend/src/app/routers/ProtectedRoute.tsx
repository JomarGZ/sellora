// src/routes/ProtectedRoute.tsx
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMe } from "@/features/auth/api/user.queries";

export default function ProtectedRoute() {
  const { data: user, isLoading } = useMe();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // prevent flash
  }

  return <Outlet />;
}
