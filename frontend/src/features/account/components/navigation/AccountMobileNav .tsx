// account/components/layout/AccountMobileNav.tsx
import { useState } from "react";
import { Menu } from "lucide-react";
import { AccountNavLink } from "./AccountNavlink";

const links = [
  { label: "Profile", to: "/account/profile" },
  { label: "Orders", to: "/account/orders" },
  { label: "Cart", to: "/account/cart" },
  { label: "Addresses", to: "/account/addresses" },
  { label: "Wishlist", to: "/account/wishlist" },
  { label: "Settings", to: "/account/settings" },
];

const AccountMobileNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden p-4 border-b border-border flex justify-between items-center">
      <span className="font-bold">My Account</span>
      <button onClick={() => setOpen(!open)}>
        <Menu className="w-6 h-6" />
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-t border-border p-4 flex flex-col space-y-2">
          {links.map((link) => (
            <AccountNavLink key={link.to} to={link.to}>
              {link.label}
            </AccountNavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountMobileNav;
