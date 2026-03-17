import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Product } from '../../data/products'
import { ProductBadge } from './ProductBadge'
import { RatingStars } from './RatingStars'

interface ProductCardProps {
  product: Product
  showBestSellerBadge?: boolean
}

export function ProductCard({ product, showBestSellerBadge = false }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)

  const showBadge = (showBestSellerBadge && product.isBestSeller) || product.isNew
  const badgeLabel = product.isBestSeller ? 'Best Seller' : product.isNew ? 'New' : null

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex flex-col flex-1">
        <Link to="/product/$productId" params={{ productId: product.id }} className="flex flex-col flex-1">
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {showBadge && badgeLabel && (
              <ProductBadge label={badgeLabel} />
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setWishlisted((w) => !w)
              }}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg
                className={`h-5 w-5 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                fill={wishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
              <span className="rounded bg-gray-100 px-1.5 py-0.5">{product.category}</span>
              <span className="rounded bg-gray-100 px-1.5 py-0.5">{product.brand}</span>
            </div>
            <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-sky-600">
              {product.name}
            </h3>
            {'rating' in product && product.reviewCount != null && (
              <div className="flex items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-gray-500">
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>
            )}
            <div className="mt-auto flex items-baseline gap-2">
              <span className="text-lg font-semibold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice != null && product.oldPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>
        <div className="p-4 pt-0">
          <button
            type="button"
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-sky-600 hover:shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
