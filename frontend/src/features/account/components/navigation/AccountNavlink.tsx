import { Link, useMatchRoute } from "@tanstack/react-router";
import type React from "react";

interface AccountNavLinkProps {
  to: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  variant?: "sidebar" | "pill";
}

export const AccountNavLink = ({
  to,
  icon: Icon,
  children,
  variant = "sidebar",
}: AccountNavLinkProps) => {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: true });

  const baseClass =
    "flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap";

  const styles = {
    sidebar: isActive
      ? "bg-primary text-primary-foreground shadow-sm px-4 py-2.5 rounded-lg"
      : "text-muted-foreground hover:bg-muted px-4 py-2.5 rounded-lg",

    pill: isActive
      ? "bg-primary text-primary-foreground shadow-sm px-5 py-2.5 rounded-full"
      : "bg-white text-muted-foreground border border-border/50 hover:bg-muted px-5 py-2.5 rounded-full",
  };

  return (
    <Link to={to} className={`${baseClass} ${styles[variant]}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );
};
