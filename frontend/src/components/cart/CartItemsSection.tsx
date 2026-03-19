import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { type CartItemData } from "@/data/cartData";
import CartItemSkeletonList from "./CartItemSkeletonList";
import CartItemsList from "./CartItemsList";
import { EntityFallback } from "../ui/EntityFallback";

interface CartItemsSectionProps {
  isLoading: boolean;
  items: CartItemData[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onErrorReset: () => void;
}

const CartItemsSection = ({
  isLoading = true,
  items,
  onUpdateQuantity,
  onRemove,
  onErrorReset,
}: CartItemsSectionProps) => {
  if (isLoading) {
    return <CartItemSkeletonList />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }: FallbackProps) => (
        <EntityFallback
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          title="Unable to load cart items"
        />
      )}
      onReset={onErrorReset}
    >
      <CartItemsList
        items={items}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />
    </ErrorBoundary>
  );
};

export default CartItemsSection;
