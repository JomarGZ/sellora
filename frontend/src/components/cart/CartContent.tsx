import { type CartItemData } from "@/data/cartData";
import CartItemsSection from "./CartItemsSection";
import CartSummary from "./CartSummary";

interface CartContentProps {
  isLoading: boolean;
  items: CartItemData[];
  subtotal: number;
  itemCount: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onErrorReset: () => void;
}

const CartContent = ({
  isLoading,
  items,
  subtotal,
  itemCount,
  onUpdateQuantity,
  onRemove,
  onErrorReset,
}: CartContentProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <CartItemsSection
          isLoading={isLoading}
          items={items}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          onErrorReset={onErrorReset}
        />
      </div>
      <div className="w-full lg:w-80 shrink-0">
        <CartSummary subtotal={subtotal} itemCount={itemCount} />
      </div>
    </div>
  );
};

export default CartContent;
