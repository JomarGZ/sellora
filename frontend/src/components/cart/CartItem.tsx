import { type CartItemData } from "@/data/cartData";
import CartItemImage from "./CartItemImage";
import CartItemDetails from "./CartItemDetails";
import CartQuantityControl from "./CartQuantityControl";
import CartItemActions from "./CartItemActions";

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const subtotal = item.price * item.quantity;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-card rounded-lg border border-border transition-shadow hover:shadow-sm">
      <CartItemImage src={item.image} alt={item.name} />

      <div className="flex flex-col md:flex-row flex-1 gap-4 md:items-center justify-between">
        <CartItemDetails
          name={item.name}
          variant={item.variant}
          price={item.price}
        />

        <div className="flex items-center justify-between md:justify-end gap-6">
          <CartQuantityControl
            quantity={item.quantity}
            onDecrease={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
          />
          <CartItemActions
            subtotal={subtotal}
            onRemove={() => onRemove(item.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
