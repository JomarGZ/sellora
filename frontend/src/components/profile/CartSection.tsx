import { useState, useEffect } from "react";
import { CartItemList } from "./CartItemList";
import Skeleton from "react-loading-skeleton";
import { useCart } from "@/hooks/useCart";
import { CartSummary } from "./CartSummary";

export function CartSection() {
  const { items, updateQuantity, removeItem, subtotal, shipping, total } =
    useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemove = (id: string) => {
    removeItem(id);
    // toast({ title: "Item removed from cart" });
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    updateQuantity(id, qty);
    // toast({ title: "Quantity updated" });
  };

  if (!mounted) {
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-card p-4 rounded-2xl border border-border/50 flex gap-4"
            >
              <Skeleton width={96} height={96} borderRadius={12} />
              <div className="flex-1 py-1">
                <Skeleton width="60%" height={24} className="mb-2" />
                <Skeleton width="30%" height={16} />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border/50">
            <Skeleton width="50%" height={24} className="mb-4" />
            <Skeleton count={3} className="mb-2" />
            <Skeleton height={48} borderRadius={12} className="mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h2 className="text-2xl font-display font-bold text-foreground mb-6">
          Shopping Cart
        </h2>
        <CartItemList
          items={items}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
        />
      </div>
      {items.length > 0 && (
        <div className="w-full lg:w-80 shrink-0">
          <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
        </div>
      )}
    </div>
  );
}
