import { ProductGrid } from "../../../product/components/sections/ProductGrid";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { EntityFallback } from "../../../../shared/components/feedback/EntityFallback";
import { useNewArrivalProducts } from "../../api/home.queries";

export function NewArrivalsSection() {
  const { data: newArrivals, refetch, isLoading } = useNewArrivalProducts();
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
        onReset={() => refetch()}
      >
        <ProductGrid
          products={newArrivals?.data ?? []}
          isLoading={isLoading}
          showBestSellerBadge={false}
        />
      </ErrorBoundary>
    </section>
  );
}
