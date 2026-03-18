import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemActionsProps {
  subtotal: number;
  onRemove: () => void;
}

const CartItemActions = ({ subtotal, onRemove }: CartItemActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="font-semibold text-foreground min-w-[60px] text-right">
        ${subtotal.toFixed(2)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
};

export default CartItemActions;
