import type { Product } from '../../data/products'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  showBestSellerBadge?: boolean
}

export function ProductGrid({ products, showBestSellerBadge = false }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showBestSellerBadge={showBestSellerBadge}
        />
      ))}
    </div>
  )
}
