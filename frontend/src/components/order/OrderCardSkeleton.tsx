import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const OrderItemSkeleton = () => (
  <div className="flex items-center gap-3 py-3">
    <Skeleton width={56} height={56} borderRadius={6} />
    <div className="flex-1">
      <Skeleton width="60%" height={14} />
      <Skeleton width="40%" height={12} className="mt-1" />
    </div>
    <Skeleton width={48} height={14} />
  </div>
);

const OrderCardSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-3">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton width={110} height={16} />
        <Skeleton width={70} height={20} borderRadius={12} />
      </div>
      <Skeleton width={80} height={12} />
    </div>

    {/* Items */}
    <div className="divide-y divide-border">
      <OrderItemSkeleton />
      <OrderItemSkeleton />
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between border-t border-border pt-3">
      <Skeleton width={90} height={18} />
      <div className="flex gap-2">
        <Skeleton width={100} height={32} borderRadius={6} />
        <Skeleton width={80} height={32} borderRadius={6} />
      </div>
    </div>
  </div>
);

const OrderListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <OrderCardSkeleton key={i} />
    ))}
  </div>
);

export default OrderListSkeleton;
