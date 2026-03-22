import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function OrderItemsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex gap-4 rounded-lg border border-border bg-card p-3"
        >
          <Skeleton width={80} height={80} borderRadius={8} />
          <div className="flex-1">
            <Skeleton width="60%" height={18} />
            <Skeleton width="40%" height={12} className="mt-1" />
            <div className="mt-4 flex justify-between">
              <Skeleton width={40} height={14} />
              <Skeleton width={50} height={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
