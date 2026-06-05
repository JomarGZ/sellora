// features/cart/components/list/CartItemList.tsx
import { CartItemCard } from "../item/CartItemCard";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Skeleton from "react-loading-skeleton";
import {
  useDeleteCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from "../../api/cart.queries";
import type { CartItem } from "../../types";

type CartItemListProps = {
  isSelected: (id: number) => boolean;
  isLoading: boolean;
  onSelectItem: (id: number, checked: boolean) => void;
  cart: any;
};

export function CartItemList({
  isSelected,
  onSelectItem,
  isLoading = false,
  cart,
}: CartItemListProps) {
  const deleteCartItem = useDeleteCartItemMutation();
  const updateQuantity = useUpdateCartItemQuantityMutation();

  if (!isLoading && cart?.data.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <CartSkeleton />
      ) : (
        cart?.data?.items.map((item: CartItem) => (
          <CartItemCard
            key={item.id}
            item={item}
            isSelected={isSelected(item.id)}
            onSelect={onSelectItem}
            onUpdateQuantity={(id, quantity) => {
              updateQuantity.mutate({
                itemId: id,
                cartId: cart.data.id,
                quantity,
              });
              console.log("update");
            }}
            onRemove={(id) => deleteCartItem.mutate(id)}
            isRemoving={
              deleteCartItem.isPending && deleteCartItem.variables === item.id
            }
          />
        ))
      )}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="text-center p-12 bg-white dark:bg-card rounded-2xl border border-border/50">
      <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-semibold">Your cart is empty</h3>
      <p className="text-muted-foreground mt-2">
        Looks like you haven't added anything yet.
      </p>
      <Button className="mt-6 rounded-xl">Continue Shopping</Button>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-4">
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
  );
}
