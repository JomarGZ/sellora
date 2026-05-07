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

  // Read once — location.state is never re-read after mount.
  // On refresh, location.state is null → no preselection. ✓
  const buyNowId = (location.state as BuyNowState)?.buyNow?.itemId ?? null;

  const {
    selectedArray,
    selectedCount,
    isSelected,
    selectItem,
    selectAll,
    deselectAll,
  } = useCartSelection(buyNowId ? [buyNowId] : []);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <CartItemList
          isSelected={isSelected}
          onSelectItem={selectItem}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          buyNowItemId={buyNowId}
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
