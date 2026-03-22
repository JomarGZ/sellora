import { Link } from '@tanstack/react-router'

interface AuthButtonsProps {
  onNavigate?: () => void
}

export function AuthButtons({ onNavigate }: AuthButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/login"
        onClick={onNavigate}
        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        Login
      </Link>
      <Link
        to="/register"
        onClick={onNavigate}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-soft transition-all hover:bg-accent-hover hover:shadow-glow"
      >
        Register
      </Link>
    </div>
  )
}
