import { Link } from "@tanstack/react-router";

interface NavigationMenuProps {
  isOpen?: boolean;
  onNavigate?: () => void;
}

export function NavigationMenu({
  isOpen = false,
  onNavigate,
}: NavigationMenuProps) {
  return (
    <nav
      className={`
        absolute left-0 right-0 top-full z-40 flex flex-col gap-4 bg-white py-4 shadow-lg transition-all duration-300 ease-out
        md:static md:flex-row md:items-center md:gap-8 md:bg-transparent md:py-0 md:shadow-none
        ${isOpen ? "animate-slide-down opacity-100" : "hidden opacity-0 md:flex md:opacity-100"}
      `}
    >
      <Link
        to="/"
        onClick={onNavigate}
        className="px-6 py-2 text-gray-600 transition-colors hover:text-sky-600 md:px-0"
        activeProps={{ className: "text-sky-600 font-medium" }}
      >
        Home
      </Link>
      <Link
        to="/shop"
        onClick={onNavigate}
        className="px-6 py-2 text-gray-600 transition-colors hover:text-sky-600 md:px-0"
        activeProps={{ className: "text-sky-600 font-medium" }}
      >
        Shop
      </Link>
      <Link
        to="#"
        onClick={onNavigate}
        className="px-6 py-2 text-gray-600 transition-colors hover:text-sky-600 md:px-0"
        activeProps={{ className: "text-sky-600 font-medium" }}
      >
        Deals
      </Link>

      <Link
        to="/cart"
        onClick={onNavigate}
        className="px-6 py-2 text-gray-600 transition-colors hover:text-sky-600 md:px-0"
        activeProps={{ className: "text-sky-600 font-medium" }}
      >
        Cart
      </Link>
      <Link
        to="/orders"
        onClick={onNavigate}
        className="px-6 py-2 text-gray-600 transition-colors hover:text-sky-600 md:px-0"
        activeProps={{ className: "text-sky-600 font-medium" }}
      >
        orders
      </Link>
    </nav>
  );
}
