// account/components/navigation/AccountMobileNav.tsx
import { MapPin, Settings, ShoppingBag, ShoppingCart } from "lucide-react";
import { AccountNavLink } from "./AccountNavlink";

const links = [
  { label: "My Purchase", to: "/account/orders", icon: ShoppingBag },
  { label: "My Cart", to: "/account/cart", icon: ShoppingCart },
  { label: "My Addresses", to: "/account/addresses", icon: MapPin },
  { label: "Settings", to: "/account/settings", icon: Settings },
];

const AccountMobileNav = () => {
  return (
    <div className="lg:hidden -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar mb-4">
      <div className="flex gap-2 w-max">
        {links.map((link) => (
          <AccountNavLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            variant="pill"
          >
            {link.label}
          </AccountNavLink>
        ))}
      </div>
    </div>
  );
};

export default AccountMobileNav;
