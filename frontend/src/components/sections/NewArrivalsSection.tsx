import { ProductGrid } from '../product/ProductGrid'
import { newArrivals } from '../../data/products'
import { ErrorBoundary } from 'react-error-boundary'

export function NewArrivalsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-semibold text-gray-900 sm:text-3xl">
        New Arrivals
      </h2>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <ProductGrid products={newArrivals} isLoading={false} showBestSellerBadge={false} />
      </ErrorBoundary>
    </section>
  )
}
