import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CartItemSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-card rounded-lg">
      <Skeleton width={96} height={96} borderRadius={8} className="shrink-0" />
      <div className="flex flex-col md:flex-row flex-1 gap-4 md:items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={20} />
          <Skeleton width="30%" height={16} />
          <Skeleton width="20%" height={16} />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton width={100} height={40} borderRadius={8} />
          <Skeleton width={60} height={20} />
        </div>
      </div>
    </div>
  );
};

export default CartItemSkeleton;
