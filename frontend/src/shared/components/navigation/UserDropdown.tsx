import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import UserAvatar from "../ui/user-avatar";
import { useMe } from "@/features/auth/api/user.queries";

interface UserDropdownProps {
  onLogout?: () => void;
}

export function UserDropdown({ onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useMe();

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
  return (
    <div className="relative" ref={ref}>
      {/* Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="cursor-pointer"
        aria-haspopup="true"
      >
        <UserAvatar
          src={user?.avatar}
          firstName={user?.first_name}
          lastName={user?.last_name}
          isOnline={true}
        />
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
