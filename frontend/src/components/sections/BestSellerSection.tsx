import { ProductGrid } from "../../features/product/components/sections/ProductGrid";
import { bestSellers } from "../../data/products";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { EntityFallback } from "../../shared/components/ui/EntityFallback";

export function BestSellerSection() {
  return (
    <section className="border-t border-gray-100 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-semibold text-gray-900 sm:text-3xl">
          Best Sellers
        </h2>
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }: FallbackProps) => (
            <EntityFallback
              resetErrorBoundary={resetErrorBoundary}
              title="Unable to load best seller products."
              error={error}
            />
          )}
          onReset={() => {
            //Refetch data
          }}
        >
          <ProductGrid products={bestSellers} showBestSellerBadge />
        </ErrorBoundary>
      </div>
    </section>
  );
}
