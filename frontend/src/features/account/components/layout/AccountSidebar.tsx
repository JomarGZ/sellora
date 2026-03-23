// account/components/layout/AccountSidebar.tsx
import { LogOut } from "lucide-react";
import { AccountNavLink } from "../navigation/AccountNavlink";

const links = [
  { label: "overview", to: "/account/overview" },
  { label: "Orders", to: "/account/orders" },
  { label: "Cart", to: "/account/cart" },
  { label: "Addresses", to: "/account/addresses" },
  { label: "Wishlist", to: "/account/wishlist" },
  { label: "Settings", to: "/account/settings" },
];

const AccountSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-border p-6">
      <h2 className="text-xl font-bold mb-6">My Account</h2>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <AccountNavLink key={link.to} to={link.to}>
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
