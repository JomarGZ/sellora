import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import type { Product } from '../../data/products'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

interface ProductGridProps {
  products: Product[]
  showBestSellerBadge?: boolean
  isLoading?: boolean
  skeletonCount?: number
}

export function ProductGrid({
  products,
  showBestSellerBadge = false,
  isLoading = true,
  skeletonCount = 8,
}: ProductGridProps) {

  const ProductGridErrorFallback = () =>  (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-center rounded-lg bg-muted/40 px-6 py-20"
    >
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-foreground">
            Unable to load products
          </h3>
          <p className="text-sm text-muted-foreground">
            We're having trouble reaching our servers. Please check your connection or try again.
          </p>
        </div>
          <button className="mt-2 gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
      </div>
    </motion.div>
  )

  return (
    <ErrorBoundary
     FallbackComponent={ProductGridErrorFallback}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showBestSellerBadge={showBestSellerBadge}
              />
            ))}
      </div>
    </ErrorBoundary>
  )
}