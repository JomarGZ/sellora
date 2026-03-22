import { useEffect } from "react";
import { SidebarFilters } from "./SidebarFilters";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (v: string) => void;
  onMaxPriceChange: (v: string) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (v: string[]) => void;
  brands: string[];
  selectedBrands: string[];
  onBrandsChange: (v: string[]) => void;
  onClearFilters: () => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  categories,
  selectedCategories,
  onCategoriesChange,
  brands,
  selectedBrands,
  onBrandsChange,
  onClearFilters,
}: MobileFilterDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-y-0 left-0 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close filters"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <SidebarFilters
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={onMinPriceChange}
            onMaxPriceChange={onMaxPriceChange}
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoriesChange={onCategoriesChange}
            brands={brands}
            selectedBrands={selectedBrands}
            onBrandsChange={onBrandsChange}
            onClearFilters={onClearFilters}
          />
        </div>
      </div>
    </>
  );
}
