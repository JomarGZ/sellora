import { ProductGrid } from "../../../product/components/sections/ProductGrid";
import { newArrivals } from "../../../../data/products";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { EntityFallback } from "../../../../shared/components/feedback/EntityFallback";

export function NewArrivalsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-semibold text-gray-900 sm:text-3xl">
        New Arrivals
      </h2>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }: FallbackProps) => (
          <EntityFallback
            resetErrorBoundary={resetErrorBoundary}
            title="Unable to load new arrival products."
            error={error}
          />
        )}
        onReset={() => {
          //Refetch data
        }}
      >
        <ProductGrid
          products={newArrivals}
          isLoading={false}
          showBestSellerBadge={false}
        />
      </ErrorBoundary>
    </section>
  );
}
