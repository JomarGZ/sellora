import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const CartEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <ShoppingBag className="text-muted-foreground mb-4" size={48} />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground mb-6">
        Looks like you haven't added anything yet.
      </p>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
      >
        <a href="/">Continue Shopping</a>
      </Button>
    </div>
  );
};

export default CartEmptyState;
