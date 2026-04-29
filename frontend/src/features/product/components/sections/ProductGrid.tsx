import { ProductCard } from "../ui/ProductCard";
import { ProductCardSkeleton } from "../../states/ProductCardSkeleton";
import type { Product } from "@/shared/types";

interface ProductGridProps {
  products: Product[];
  showBestSellerBadge?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  showBestSellerBadge = false,
  isLoading = false,
  isFetching = false,
  skeletonCount = 8,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ${
          isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showBestSellerBadge={showBestSellerBadge}
          />
        ))}

        {isFetching && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border-2 border-gray-300 border-t-sky-500 animate-spin h-6 w-6" />
          </div>
        )}

        {products.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-gray-900">
              No products found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
