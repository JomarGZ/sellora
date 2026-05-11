import { Button } from "@/shared/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface PlaceOrderButtonProps {
  loading: boolean;
  onClick: () => void;
  className?: string;
}

export function PlaceOrderButton({
  loading,
  onClick,
  className,
}: PlaceOrderButtonProps) {
  return (
    <Button
      className={cn(
        "w-full h-12 text-base cursor-pointer font-semibold",
        className,
      )}
      disabled={loading}
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
