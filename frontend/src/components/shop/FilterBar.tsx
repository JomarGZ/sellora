import { SearchBox } from './SearchBox'

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'newest' | 'rating'

interface FilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  sortValue: SortOption
  onSortChange: (value: SortOption) => void
  rangeStart: number
  rangeEnd: number
  totalCount: number
  onOpenMobileFilters?: () => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Rating' },
]

export function FilterBar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  rangeStart,
  rangeEnd,
  totalCount,
  onOpenMobileFilters,
}: FilterBarProps) {
  const from = totalCount === 0 ? 0 : rangeStart
  const to = totalCount === 0 ? 0 : rangeEnd
  const of = totalCount

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-3 sm:flex-1">
            {onOpenMobileFilters && (
              <button
                type="button"
                onClick={onOpenMobileFilters}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 lg:hidden"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
            )}
            <SearchBox value={searchValue} onChange={onSearchChange} />
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              Showing {from}–{to} of {of} product{of !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
