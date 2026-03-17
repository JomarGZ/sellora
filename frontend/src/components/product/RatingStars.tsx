interface RatingStarsProps {
  rating: number
  maxStars?: number
  className?: string
}

export function RatingStars({ rating, maxStars = 5, className = '' }: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75
  const emptyStars = maxStars - fullStars - (hasHalf ? 1 : 0)

  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`Rating: ${rating} out of ${maxStars}`}>
      {Array.from({ length: fullStars }, (_, i) => (
        <span key={`full-${i}`} className="text-amber-400" aria-hidden>★</span>
      ))}
      {hasHalf && <span className="text-amber-400 opacity-80" aria-hidden>★</span>}
      {Array.from({ length: emptyStars }, (_, i) => (
        <span key={`empty-${i}`} className="text-gray-300" aria-hidden>★</span>
      ))}
    </div>
  )
}
