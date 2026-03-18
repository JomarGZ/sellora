import { type CartItemData } from "@/data/cartData";
import CartItem from "./CartItem";

interface CartItemsListProps {
  items: CartItemData[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const CartItemsList = ({
  items,
  onUpdateQuantity,
  onRemove,
}: CartItemsListProps) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CartItemsList;
