import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

interface UserDropdownProps {
  onLogout?: () => void
}

export function UserDropdown({ onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-light text-accent transition-all hover:ring-2 hover:ring-accent"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-48 animate-slide-down rounded-lg bg-white py-1 shadow-elevated"
          role="menu"
        >
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-accent"
            role="menuitem"
          >
            Profile
          </Link>
          <Link
            to="/orders"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-accent"
            role="menuitem"
          >
            Orders
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onLogout?.()
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
