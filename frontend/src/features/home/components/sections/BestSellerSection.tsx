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
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="mb-3 inline-block rounded-full border border-neutral-200 bg-white px-4 py-1 text-xs font-medium text-neutral-600 shadow-sm">
                Customer Favorites
              </span>

              <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
                Best Sellers
              </h2>

              <p className="mt-4 text-neutral-500">
                Our most popular products, loved by thousands of customers and
                proven through real purchases.
              </p>
            </div>
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
