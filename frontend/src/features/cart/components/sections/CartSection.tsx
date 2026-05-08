import { useCartSummaryQuery } from "../../api/cart.queries";
import { useCartSelection } from "../../store/cartSelection.store";
import { CartItemList } from "../list/CartItemList";
import { CartSummary } from "../ui/CartSummary";

export function CartSection() {
  const selectItem = useCartSelection((s) => s.selectItem);
  const isSelected = useCartSelection((s) => s.isSelected);
  const { data: summary } = useCartSummaryQuery();
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <CartItemList isSelected={isSelected} onSelectItem={selectItem} />
      </div>

      {summary?.data.count && (
        <div className="w-full lg:w-80 shrink-0">
          <CartSummary summary={summary.data} />
        </div>
      )}
    </div>
  );
}
