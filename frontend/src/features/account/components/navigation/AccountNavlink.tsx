import { Link, useMatchRoute } from "@tanstack/react-router";

interface AccountNavLinkProps {
  to: string;
  children: React.ReactNode;
}

export const AccountNavLink = ({ to, children }: AccountNavLinkProps) => {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: true });

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
};
