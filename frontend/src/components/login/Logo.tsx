import { ShoppingBag } from "lucide-react";

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
      <ShoppingBag className="h-5 w-5 text-primary-foreground" />
    </div>
    <span className="text-xl font-bold tracking-tight text-foreground">
      Storefront
    </span>
  </div>
);

export default Logo;
