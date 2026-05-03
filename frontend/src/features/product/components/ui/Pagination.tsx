import React from "react";

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
  // Hide pagination if only 1 page
  if (totalPages <= 1) {
    return null;
  }

  const showPages = 5;

  const handlePageChange = (page: number) => {
    // Prevent invalid or duplicate page changes
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange(page);
  };

  // Calculate visible page range
  let start = Math.max(1, currentPage - Math.floor(showPages / 2));

  const end = Math.min(totalPages, start + showPages - 1);

  // Adjust start if near the end
  if (end - start + 1 < showPages) {
    start = Math.max(1, end - showPages + 1);
  }

  // Generate visible pages
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav
      className="flex items-center justify-center gap-1 py-8"
      aria-label="Pagination"
    >
      {/* Prev Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-lg border cursor-pointer border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {/* First Page + Left Ellipsis */}
        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              className="rounded-lg border cursor-pointer border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              1
            </button>

            {start > 2 && <span className="px-1 text-gray-400">…</span>}
          </>
        )}

        {/* Visible Pages */}
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => handlePageChange(page)}
            className={`rounded-lg cursor-pointer border px-3 py-2 text-sm font-medium transition-colors ${
              page === currentPage
                ? "border-sky-500 bg-sky-500 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Right Ellipsis + Last Page */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="px-1 text-gray-400">…</span>
            )}

            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              className="rounded-lg cursor-pointer border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-lg border cursor-pointer border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
