import { Link, useParams } from '@tanstack/react-router'
import { getProductById } from '../data/products'
import { ProductBadge } from '../components/product/ProductBadge'

export function ProductPage() {
  const { productId } = useParams({ from: '/product/$productId' })
  const product = productId ? getProductById(productId) : undefined

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-accent">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
          {product.isBestSeller && (
            <ProductBadge label="Best Seller" className="z-10" />
          )}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-4 text-gray-600">
            {product.description ?? 'Premium tech product from Sellora.'}
          </p>
          <p className="mt-2 text-sm text-gray-500">Category: {product.category}</p>
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition-all hover:bg-accent-hover hover:shadow-glow"
            >
              Add to Cart
            </button>
            <Link
              to="/"
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
