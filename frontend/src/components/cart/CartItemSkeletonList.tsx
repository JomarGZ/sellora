import CartItemSkeleton from "./CartItemSkeleton";

interface CartItemSkeletonListProps {
  count?: number;
}

const CartItemSkeletonList = ({ count = 4 }: CartItemSkeletonListProps) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  );
};

export default CartItemSkeletonList;
