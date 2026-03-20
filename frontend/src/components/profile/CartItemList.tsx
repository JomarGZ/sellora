import { CartItemCard } from "./CartItemCard";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/data/mockProfile";

interface CartItemListProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemList({
  items,
  onUpdateQuantity,
  onRemove,
}: CartItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center p-12 bg-white dark:bg-card rounded-2xl border border-border/50">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground">
          Your cart is empty
        </h3>
        <p className="text-muted-foreground mt-2">
          Looks like you haven't added anything yet.
        </p>
        <Button className="mt-6 rounded-xl">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
