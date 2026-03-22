import { AppSkeleton } from "../../../components/ui/AppSkeleton";

export function ProductCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md animate-pulse">
      <div className="flex flex-col flex-1">
        {/* Image placeholder */}
        <div className="relative aspect-square bg-gray-50">
          <AppSkeleton className="h-full w-full" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          {/* Category & Brand badges */}
          <div className="flex flex-wrap gap-1.5">
            <AppSkeleton height={18} width={60} className="rounded-full" />
            <AppSkeleton height={18} width={50} className="rounded-full" />
          </div>

          {/* Product name */}
          <AppSkeleton height={24} width="80%" className="mt-2" />

          {/* Rating */}
          <AppSkeleton height={16} width="40%" />

          {/* Price */}
          <div className="mt-auto flex items-baseline gap-2">
            <AppSkeleton height={20} width="30%" />
            <AppSkeleton height={16} width="20%" />
          </div>
        </div>

        {/* Add to Cart button */}
        <div className="p-4 pt-0">
          <AppSkeleton height={36} className="w-full rounded-lg" />
        </div>
      </div>
    </article>
  );
}
