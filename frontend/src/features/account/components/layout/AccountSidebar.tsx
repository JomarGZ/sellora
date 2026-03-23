// account/components/layout/AccountSidebar.tsx
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { AccountNavLink } from "../navigation/AccountNavlink";

const links = [
  { label: "Overview", to: "/account/overview", icon: LayoutDashboard },
  { label: "Orders", to: "/account/orders", icon: ShoppingBag },
  { label: "Cart", to: "/account/cart", icon: ShoppingCart },
  { label: "Addresses", to: "/account/addresses", icon: MapPin },
  { label: "Wishlist", to: "/account/wishlist", icon: Heart },
  { label: "Settings", to: "/account/settings", icon: Settings },
];

const AccountSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border border-border/50 p-4 sticky top-8 rounded-2xl">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <AccountNavLink key={link.to} to={link.to} icon={link.icon}>
            {link.label}
          </AccountNavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-border/40">
        <button className="flex items-center gap-3 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors w-full px-3 py-2 rounded-lg hover:bg-rose-50">
          <LogOut className="w-5 h-5 opacity-70" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AccountSidebar;
