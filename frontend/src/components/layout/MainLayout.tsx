import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export function MainLayout({
  children,
  isLoggedIn = false,
  onLogout,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
