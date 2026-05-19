import { ProductGrid } from "../../../product/components/sections/ProductGrid";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { EntityFallback } from "../../../../shared/components/feedback/EntityFallback";
import { useBestSellerProducts } from "../../api/home.queries";

export function BestSellerSection() {
  const {
    data: bestSellerProducts,
    refetch,
    isLoading,
  } = useBestSellerProducts();

  const products = bestSellerProducts?.data ?? [];
  return (
    <>
      {products.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-semibold text-gray-900 sm:text-3xl">
              Best Sellers
            </h2>
            <ErrorBoundary
              FallbackComponent={({
                error,
                resetErrorBoundary,
              }: FallbackProps) => (
                <EntityFallback
                  resetErrorBoundary={resetErrorBoundary}
                  title="Unable to load best seller products."
                  error={error}
                />
              )}
              onReset={() => refetch()}
            >
              <ProductGrid
                products={products}
                showBestSellerBadge
                isLoading={isLoading}
              />
            </ErrorBoundary>
          </div>
        </section>
      )}
    </>
  );
}
