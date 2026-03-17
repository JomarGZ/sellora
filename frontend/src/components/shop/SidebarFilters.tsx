import { PriceRangeFilter } from './PriceRangeFilter'
import { CategoryFilter } from './CategoryFilter'
import { BrandFilter } from './BrandFilter'

interface SidebarFiltersProps {
  minPrice: string
  maxPrice: string
  onMinPriceChange: (v: string) => void
  onMaxPriceChange: (v: string) => void
  categories: string[]
  selectedCategories: string[]
  onCategoriesChange: (v: string[]) => void
  brands: string[]
  selectedBrands: string[]
  onBrandsChange: (v: string[]) => void
  onClearFilters: () => void
}

export function SidebarFilters({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  categories,
  selectedCategories,
  onCategoriesChange,
  brands,
  selectedBrands,
  onBrandsChange,
  onClearFilters,
}: SidebarFiltersProps) {
  const hasActiveFilters =
    minPrice !== '' ||
    maxPrice !== '' ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0

  return (
    <aside className="flex w-full flex-col gap-6 lg:w-64 lg:flex-shrink-0">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="space-y-6 border-t border-gray-200 pt-4">
        <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinChange={onMinPriceChange}
          onMaxChange={onMaxPriceChange}
        />
        <CategoryFilter
          categories={categories}
          selected={selectedCategories}
          onChange={onCategoriesChange}
        />
        <BrandFilter
          brands={brands}
          selected={selectedBrands}
          onChange={onBrandsChange}
        />
      </div>
    </aside>
  )
}
