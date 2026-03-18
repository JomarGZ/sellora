
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
  isLoading = false,
  skeletonCount = 8,
}: ProductGridProps) {

  return (
 
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

  )
}