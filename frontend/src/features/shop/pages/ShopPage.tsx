import { useEffect, useMemo, useState } from "react";
import { getCategories, getBrands } from "@/data/products";
import { FilterBar } from "@/features/shop/components/ui/FilterBar";
import { SidebarFilters } from "@/features/shop/components/layout/SidebarFilters";
import { MobileFilterDrawer } from "@/features/shop/components/layout/MobileFilterDrawer";
import { ProductGrid } from "@/features/product/components/sections/ProductGrid";
import { Pagination } from "@/features/product/components/ui/Pagination";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { EntityFallback } from "@/shared/components/feedback/EntityFallback";
import { useProducts } from "../api/shop.queries";
import { useQueryClient } from "@tanstack/react-query";
import { getProducts } from "../api/shop.api";
import { useDebouncedCallback } from "use-debounce";
import { shopRoute } from "@/app/routers/router";
import type { SortOption } from "../type";
type Filters = {
  search?: string;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  category?: string[];
  brand?: string[];
  page?: number;
};

export function ShopPage() {
  const {
    page = 1,
    search: searchParam = "",
    minPrice = undefined,
    maxPrice = undefined,
    category = "",
    brand = "",
    sort = undefined,
  } = shopRoute.useSearch();
  const navigate = shopRoute.useNavigate();
  const [searchInput, setSearchInput] = useState(searchParam);
  const [minPriceInput, setMinPriceInput] = useState(
    minPrice?.toString() ?? "",
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    maxPrice?.toString() ?? "",
  );
  const [selectedSort, setSelectedSort] = useState<SortOption>(sort);

  const {
    data: products,
    isLoading,
    refetch,
    isFetching,
  } = useProducts(page, searchParam, maxPrice, minPrice, category, brand, sort);

  const queryClient = useQueryClient();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = useMemo(() => getCategories(), []);
  const brandsList = useMemo(() => getBrands(), []);
  const setPage = (newPage: number) => {
    navigate({
      search: (prev: Filters) => {
        const next = { ...prev };
        if (newPage === 1) {
          delete next.page;
        } else {
          next.page = newPage;
        }
        return next;
      },
    });
  };

  const setSort = useDebouncedCallback((sort: SortOption) => {
    navigate({
      search: (prev: Filters) => {
        const next = { ...prev };
        if (sort) {
          next.sort = sort;
        } else {
          delete next.sort;
        }

        delete next.page;

        return next;
      },
    });
  }, 500);

  const handleSearchChange = useDebouncedCallback((value: string) => {
    navigate({
      search: (prev: Filters) => {
        const next = { ...prev };

        const cleaned = value.trim();

        if (cleaned) {
          next.search = cleaned;
        } else {
          delete next.search;
        }

        delete next.page;

        return next;
      },
    });
  }, 500);

  const handleMinPriceChange = useDebouncedCallback((value: string) => {
    navigate({
      search: (prev: Filters) => {
        const next = { ...prev };
        const num = Number(value);
        if (value && !isNaN(num)) {
          next.minPrice = num;
        } else {
          delete next.minPrice;
        }
        delete next.page;
        return next;
      },
    });
  }, 500);

  const handleMaxPriceChange = useDebouncedCallback((value: string) => {
    navigate({
      search: (prev: Filters) => {
        const next = { ...prev };
        const num = Number(value);
        if (value && !isNaN(num)) {
          next.maxPrice = num;
        } else {
          delete next.maxPrice;
        }
        delete next.page;
        return next;
      },
    });
  }, 500);

  const clearFilters = () => {
    setSelectedSort("default");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPriceInput("");
    setMaxPriceInput("");
    setSearchInput("");
    navigate({
      search: {},
    });
  };

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["products", page + 1],
      queryFn: () => getProducts(page + 1),
    });
  }, [page, queryClient]);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);
  useEffect(() => {
    setSelectedSort(sort);
  }, [sort]);
  useEffect(() => {
    setMinPriceInput(minPrice?.toString() ?? "");
  }, [minPrice]);

  useEffect(() => {
    setMaxPriceInput(maxPrice?.toString() ?? "");
  }, [maxPrice]);
  return (
    <div className="min-h-screen bg-gray-50/50">
      <FilterBar
        searchValue={searchInput}
        onSearchChange={(value) => {
          setSearchInput(value);
          handleSearchChange(value);
        }}
        sortValue={selectedSort}
        onSortChange={setSort}
        rangeStart={products?.meta.from ?? 0}
        rangeEnd={products?.meta.to ?? 0}
        totalCount={products?.meta.total ?? 0}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="hidden lg:block">
            <SidebarFilters
              minPrice={minPriceInput}
              maxPrice={maxPriceInput}
              onMinPriceChange={(v) => {
                setMinPriceInput(v);
                handleMinPriceChange(v);
              }}
              onMaxPriceChange={(v) => {
                setMaxPriceInput(v);
                handleMaxPriceChange(v);
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
            {products?.meta?.total === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
                <p className="text-gray-500">
                  No products match your filters. Try adjusting your search or
                  filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sky-600 cursor-pointer hover:text-sky-700"
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
                  onReset={() => refetch()}
                >
                  <ProductGrid
                    products={products?.data ?? []}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    showBestSellerBadge
                  />
                </ErrorBoundary>

                <Pagination
                  currentPage={page}
                  totalPages={products?.meta.last_page ?? 1}
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
        minPrice={minPriceInput}
        maxPrice={maxPriceInput}
        onMinPriceChange={(v) => {
          setMinPriceInput(v);
          handleMinPriceChange(v);
        }}
        onMaxPriceChange={(v) => {
          setMaxPriceInput(v);
          handleMaxPriceChange(v);
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
