interface ProductBadgeProps {
  label: string;
  className?: string;
}

export function ProductBadge({ label, className = "" }: ProductBadgeProps) {
  return (
    <span
      className={`absolute left-3 top-3 rounded-md bg-sky-500 px-2 py-1 text-xs font-medium text-white shadow-md ${className}`}
    >
      {label}
    </span>
  );
}
