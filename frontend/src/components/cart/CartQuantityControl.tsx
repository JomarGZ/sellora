import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartQuantityControlProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

const CartQuantityControl = ({
  quantity,
  onDecrease,
  onIncrease,
}: CartQuantityControlProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 md:h-9 md:w-9"
        onClick={onDecrease}
        disabled={quantity <= 1}
      >
        <Minus size={16} />
      </Button>
      <span className="w-10 text-center font-medium text-foreground text-sm">
        {quantity}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 md:h-9 md:w-9"
        onClick={onIncrease}
      >
        <Plus size={16} />
      </Button>
    </div>
  );
};

export default CartQuantityControl;
