import { ProductGrid } from "../../../product/components/sections/ProductGrid";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { EntityFallback } from "../../../../shared/components/feedback/EntityFallback";
import { useNewArrivalProducts } from "../../api/home.queries";

export function NewArrivalsSection() {
  const { data: newArrivals, refetch, isLoading } = useNewArrivalProducts();
  const products = newArrivals?.data ?? [];

  return (
    <>
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full border border-neutral-200 bg-white px-4 py-1 text-xs font-medium text-neutral-600 shadow-sm">
              Just In
            </span>

            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
              New Arrivals
            </h2>

            <p className="mt-4 text-neutral-500">
              Discover our latest products, freshly added and trending among
              shoppers right now.
            </p>
          </div>
          <ErrorBoundary
            FallbackComponent={({
              error,
              resetErrorBoundary,
            }: FallbackProps) => (
              <EntityFallback
                resetErrorBoundary={resetErrorBoundary}
                title="Unable to load new arrival products."
                error={error}
              />
            )}
            onReset={() => refetch()}
          >
            <ProductGrid
              products={products}
              isLoading={isLoading}
              showBestSellerBadge={false}
            />
          </ErrorBoundary>
        </section>
      )}
    </>
  );
}
