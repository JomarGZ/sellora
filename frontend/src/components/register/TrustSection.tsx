import { ShieldCheck, Lock } from "lucide-react";

const TrustSection = () => (
  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
    <div className="flex items-center gap-1.5">
      <ShieldCheck className="h-3.5 w-3.5" />
      <span>256-bit SSL</span>
    </div>
    <div className="h-3 w-px bg-border" />
    <div className="flex items-center gap-1.5">
      <Lock className="h-3.5 w-3.5" />
      <span>Secure checkout</span>
    </div>
  </div>
);

export default TrustSection;
