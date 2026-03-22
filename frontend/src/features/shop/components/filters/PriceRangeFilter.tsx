interface PriceRangeFilterProps {
  minPrice: string
  maxPrice: string
  onMinChange: (value: string) => void
  onMaxChange: (value: string) => void
}

export function PriceRangeFilter({ minPrice, maxPrice, onMinChange, onMaxChange }: PriceRangeFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          step={1}
          placeholder="Min"
          value={minPrice}
          onChange={(e) => onMinChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        <span className="text-gray-400">–</span>
        <input
          type="number"
          min={0}
          step={1}
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => onMaxChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
    </div>
  )
}
