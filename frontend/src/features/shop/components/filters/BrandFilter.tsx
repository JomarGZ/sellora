interface BrandFilterProps {
  brands: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function BrandFilter({ brands, selected, onChange }: BrandFilterProps) {
  function toggle(brand: string) {
    if (selected.includes(brand)) {
      onChange(selected.filter((b) => b !== brand))
    } else {
      onChange([...selected, brand])
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Brand</h3>
      <ul className="space-y-1.5">
        {brands.map((brand) => (
          <li key={brand}>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(brand)}
                onChange={() => toggle(brand)}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
