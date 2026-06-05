import { useCart } from "../../api/cart.queries";
import { useCartSelection } from "../../store/cartSelection.store";
import { CartItemList } from "../list/CartItemList";
import { CartSummary } from "../ui/CartSummary";

export function CartSection() {
  const selectItem = useCartSelection((s) => s.selectItem);
  const isSelected = useCartSelection((s) => s.isSelected);
  const { data: cart, isLoading } = useCart();
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <CartItemList
          isSelected={isSelected}
          onSelectItem={selectItem}
          isLoading={isLoading}
          cart={cart}
        />
      </div>

      <div className="w-full lg:w-80 shrink-0">
        <CartSummary
          itemsCount={cart?.data?.items_count}
          subtotal={cart?.data?.subtotal}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
