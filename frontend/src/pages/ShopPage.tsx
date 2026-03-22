import { useMemo, useState } from "react";
import { products, getCategories, getBrands } from "../data/products";
import type { Product } from "../data/products";
import { FilterBar } from "../components/shop/FilterBar";
import { SidebarFilters } from "../components/shop/SidebarFilters";
import { MobileFilterDrawer } from "../components/shop/MobileFilterDrawer";
import { ProductGrid } from "../features/product/components/sections/ProductGrid";
import { Pagination } from "../features/product/components/ui/Pagination";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { EntityFallback } from "@/components/ui/EntityFallback";
const PAGE_SIZE = 20;
type SortOption = "default" | "price-asc" | "price-desc" | "newest" | "rating";

function filterAndSortProducts(
  items: Product[],
  search: string,
  sort: SortOption,
  minPrice: string,
  maxPrice: string,
  categories: string[],
  brands: string[],
): Product[] {
  let result = items;

  const q = search.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  const min = minPrice !== "" ? Number(minPrice) : null;
  const max = maxPrice !== "" ? Number(maxPrice) : null;
  if (min != null && !Number.isNaN(min))
    result = result.filter((p) => p.price >= min);
  if (max != null && !Number.isNaN(max))
    result = result.filter((p) => p.price <= max);

  if (categories.length > 0) {
    result = result.filter((p) => categories.includes(p.category));
  }
  if (brands.length > 0) {
    result = result.filter((p) => brands.includes(p.brand));
  }

  switch (sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result = [...result].sort(
        (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0),
      );
      break;
    case "rating":
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return result;
}

export function ShopPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = useMemo(() => getCategories(), []);
  const brandsList = useMemo(() => getBrands(), []);

  const filtered = useMemo(
    () =>
      filterAndSortProducts(
        products,
        search,
        sort,
        minPrice,
        maxPrice,
        selectedCategories,
        selectedBrands,
      ),
    [search, sort, minPrice, maxPrice, selectedCategories, selectedBrands],
  );

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = filtered.slice(start, start + PAGE_SIZE);

  const rangeStart = totalFiltered === 0 ? 0 : start + 1;
  const rangeEnd = totalFiltered === 0 ? 0 : start + paginatedProducts.length;

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPage(1);
    setMobileFiltersOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <FilterBar
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        sortValue={sort}
        onSortChange={setSort}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        totalCount={totalFiltered}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="hidden lg:block">
            <SidebarFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={(v) => {
                setMinPrice(v);
                setPage(1);
              }}
              onMaxPriceChange={(v) => {
                setMaxPrice(v);
                setPage(1);
              }}
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoriesChange={(v) => {
                setSelectedCategories(v);
                setPage(1);
              }}
              brands={brandsList}
              selectedBrands={selectedBrands}
              onBrandsChange={(v) => {
                setSelectedBrands(v);
                setPage(1);
              }}
              onClearFilters={clearFilters}
            />
          </div>

          <main className="min-w-0 flex-1">
            {paginatedProducts.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
                <p className="text-gray-500">
                  No products match your filters. Try adjusting your search or
                  filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sky-600 hover:text-sky-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <ErrorBoundary
                  FallbackComponent={({
                    error,
                    resetErrorBoundary,
                  }: FallbackProps) => (
                    <EntityFallback
                      resetErrorBoundary={resetErrorBoundary}
                      title="Unable to load products."
                      error={error}
                    />
                  )}
                  onReset={() => {
                    //Refetch data
                  }}
                >
                  <ProductGrid
                    products={paginatedProducts}
                    isLoading={false}
                    showBestSellerBadge
                  />
                </ErrorBoundary>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </main>
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={(v) => {
          setMinPrice(v);
          setPage(1);
        }}
        onMaxPriceChange={(v) => {
          setMaxPrice(v);
          setPage(1);
        }}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoriesChange={(v) => {
          setSelectedCategories(v);
          setPage(1);
        }}
        brands={brandsList}
        selectedBrands={selectedBrands}
        onBrandsChange={(v) => {
          setSelectedBrands(v);
          setPage(1);
        }}
        onClearFilters={clearFilters}
      />
    </div>
  );
}
