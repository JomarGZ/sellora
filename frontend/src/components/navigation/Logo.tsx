import { Link } from '@tanstack/react-router'

export function Logo() {
  return (
    <Link
      to="/"
      className="text-xl font-semibold text-gray-900 transition-colors hover:text-accent md:text-2xl"
    >
      Sellora
    </Link>
  )
}
