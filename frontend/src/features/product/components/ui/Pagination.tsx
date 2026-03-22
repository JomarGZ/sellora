interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const showPages = 5;
  let start = Math.max(1, currentPage - Math.floor(showPages / 2));
  const end = Math.min(totalPages, start + showPages - 1);
  if (end - start + 1 < showPages) start = Math.max(1, end - showPages + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav
      className="flex items-center justify-center gap-1 py-8"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
      >
        Prev
      </button>
      <div className="flex items-center gap-1">
        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-gray-400">…</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              page === currentPage
                ? "border-sky-500 bg-sky-500 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="px-1 text-gray-400">…</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
