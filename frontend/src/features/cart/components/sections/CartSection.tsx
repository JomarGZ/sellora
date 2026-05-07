import { useCartUI } from "../../hooks/useCartUI";
import { CartItemList } from "../list/CartItemList";
import { CartSummary } from "../ui/CartSummary";
import { useLocation } from "@tanstack/react-router";
import {
  useCartQuery,
  useDeleteCartItemMutation,
} from "../../api/cart.queries";
import { accountCartRoute } from "@/app/routers/router";

export function CartSection() {
  const { page = 1 } = accountCartRoute.useSearch();
  const { data: cartItems, isLoading: isCartLoading } = useCartQuery(page);
  const location = useLocation();
  const selectedItemId = (location.state as any)?.buyNow?.selectedItemId;

  console.log(selectedItemId);
  const { items, updateQuantity, removeItem, subtotal, shipping, total } =
    useCartUI();

  const deleteCartItem = useDeleteCartItemMutation();
  const handleRemove = (id: number) => {
    deleteCartItem.mutate(id);
  };

  const handleUpdateQuantity = (id: number, qty: number) => {
    updateQuantity(id, qty);
    // toast({ title: "Quantity updated" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <CartItemList
          items={cartItems}
          isRemoving={deleteCartItem.isPending}
          isLoading={isCartLoading}
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
