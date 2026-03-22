import { useEffect, useRef, useState } from 'react'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchBox({
  value,
  onChange,
  placeholder = 'Search gadgets...',
  debounceMs = 300,
}: SearchBoxProps) {
  const [localValue, setLocalValue] = useState(value)
  const isFirstMount = useRef(true)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    const timer = window.setTimeout(() => {
      onChange(localValue)
    }, debounceMs)
    return () => window.clearTimeout(timer)
  }, [localValue, debounceMs, onChange])

  return (
    <div className="relative flex-1 min-w-0">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        aria-label="Search products"
      />
    </div>
  )
}
