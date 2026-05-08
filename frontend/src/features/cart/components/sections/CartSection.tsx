// features/cart/components/section/CartSection.tsx
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useCartSelection } from "../../hooks/useCartSelection";
import { CartItemList } from "../list/CartItemList";
import { CartSummary } from "../ui/CartSummary";

type BuyNowState = {
  buyNow?: { itemId: number };
};

export function CartSection() {
  const location = useLocation();

  const buyNowId = (location.state as BuyNowState)?.buyNow?.itemId ?? null;

  const { selectedCount, isSelected, selectItem, selectAll, deselectAll } =
    useCartSelection(buyNowId ? [buyNowId] : []);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <CartItemList
          isSelected={isSelected}
          onSelectItem={selectItem}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
        />
      </div>

      {selectedCount > 0 && (
        <div className="w-full lg:w-80 shrink-0">
          {/* <CartSummary selectedItemIds={selectedArray} /> */}
        </div>
      )}
    </div>
  );
}
