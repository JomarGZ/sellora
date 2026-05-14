import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/providers/AuthProvider";

interface UserDropdownProps {
  onLogout?: () => void;
  hasNewActivity?: boolean; // optional prop for dot
}

export function UserDropdown({ onLogout, hasNewActivity }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log(user);
  return (
    <div className="relative" ref={ref}>
      {/* Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center cursor-pointer justify-center overflow-hidden rounded-full bg-yellow-300 text-accent transition-all hover:ring-2 hover:ring-accent"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </span>
        )}

        {/* Notification Dot */}
        {/* {hasNewActivity && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 z-10 rounded-full bg-red-950 ring-2 ring-white"></span>
        )} */}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-48 animate-slide-down rounded-lg bg-white py-1 shadow-elevated"
          role="menu"
        >
          <Link
            to="/account/orders"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
            role="menuitem"
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onLogout?.();
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
