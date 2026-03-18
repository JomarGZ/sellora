import { useState, useCallback } from "react";
import { INITIAL_CART_ITEMS, type CartItemData } from "@/data/cartData";

import CartContent from "@/components/cart/CartContent";
import CartEmptyState from "@/components/cart/CartEmptyState";

export default function CartPage() {
  const [items, setItems] = useState<CartItemData[]>(INITIAL_CART_ITEMS);
  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetCart = useCallback(() => setItems(INITIAL_CART_ITEMS), []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isEmpty = !isLoading && items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        {isEmpty ? (
          <CartEmptyState />
        ) : (
          <CartContent
            isLoading={isLoading}
            items={items}
            subtotal={subtotal}
            itemCount={itemCount}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
            onErrorReset={resetCart}
          />
        )}
      </div>
    </div>
  );
}
