import { Button } from "@/shared/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/shared/components/lib/utils";

interface PlaceOrderButtonProps {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
  className?: string;
}

export function PlaceOrderButton({
  disabled,
  loading,
  onClick,
  className,
}: PlaceOrderButtonProps) {
  return (
    <Button
      className={cn("w-full h-12 text-base font-semibold", className)}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Placing order
        </>
      ) : (
        <>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Place Order
        </>
      )}
    </Button>
  );
}
