import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function AddressSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <Skeleton circle width={16} height={16} />
            <div className="flex-1">
              <Skeleton width="40%" height={18} />
              <Skeleton width="30%" height={14} className="mt-1" />
              <Skeleton width="80%" height={14} className="mt-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
