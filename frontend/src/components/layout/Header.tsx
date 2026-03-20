import { useState } from "react";
import { Logo } from "../navigation/Logo";
import { NavigationMenu } from "../navigation/NavigationMenu";
import { AuthButtons } from "../navigation/AuthButtons";
import { UserDropdown } from "../navigation/UserDropdown";

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export function Header({ isLoggedIn = false, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-soft backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4 md:flex-initial">
          <Logo />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-accent md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <NavigationMenu isOpen={mobileMenuOpen} onNavigate={handleNavigate} />
        </div>

        <div className="hidden items-center gap-4 md:flex md:flex-initial">
          {isLoggedIn ? (
            <UserDropdown onLogout={onLogout} />
          ) : (
            <AuthButtons onNavigate={handleNavigate} />
          )}
        </div>
      </div>

      <div className="md:hidden">
        <NavigationMenu isOpen={mobileMenuOpen} onNavigate={handleNavigate} />
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 px-4 py-4">
            {isLoggedIn ? (
              <UserDropdown onLogout={onLogout} />
            ) : (
              <AuthButtons onNavigate={handleNavigate} />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
