import { useState, useEffect } from "react";
import {
  ErrorBoundary,
  getErrorMessage,
  type FallbackProps,
} from "react-error-boundary";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MOCK_PRODUCTS, MOCK_PRODUCT_ITEMS } from "@/data/mock-data";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ProductGallery } from "@/features/product/components/sections/ProductGallery";
import { ProductInfo } from "@/features/product/components/sections/ProductInfo";
import { ProductOptions } from "@/features/product/components/sections/ProductOptions";
import { PurchaseActions } from "@/features/product/components/sections/PurchaseActions";
import { ProductReviews } from "@/features/product/components/sections/ProductReviews";
import { useSearch } from "@tanstack/react-router";
import type { ProductDetail, ProductItem } from "../types";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <svg
          className="w-12 h-12 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold font-display mb-2">
        Something went wrong
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {getErrorMessage(error) || "Failed to load product details."}
      </p>
      <Button onClick={resetErrorBoundary} size="lg" className="rounded-xl">
        Try again
      </Button>
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="w-full">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="flex gap-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-6 pt-4">
          <Skeleton height={24} width={200} />
          <Skeleton height={48} width="80%" />
          <Skeleton height={40} width={150} />
          <Skeleton height={120} />
          <Skeleton height={60} className="mt-8" />
        </div>
      </div>
    </div>
  );
}

function ProductPageContent({ productId }: { productId: number }) {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);

  // Simulate async data fetch — swap this block for real API calls when ready
  useEffect(() => {
    setIsLoading(true);
    setSelectedAttributes({});
    setSelectedItem(null);

    const timer = setTimeout(() => {
      const p = MOCK_PRODUCTS[productId] ?? null;
      const its = MOCK_PRODUCT_ITEMS[productId] ?? [];
      setProduct(p);
      setItems(its);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [productId]);

  // Auto-select first available SKU once items load
  useEffect(() => {
    if (items.length > 0 && Object.keys(selectedAttributes).length === 0) {
      const defaultItem = items.find((i) => i.qtyInStock > 0) ?? items[0];
      const initialAttrs: Record<string, string> = {};
      defaultItem.attributeValues.forEach((av) => {
        initialAttrs[av.attributeName] = av.value;
      });
      setSelectedAttributes(initialAttrs);
      setSelectedItem(defaultItem);
    }
  }, [items]);

  const handleAttributeSelect = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    const matchingItem = items.find((item) =>
      item.attributeValues.every(
        (av) => newAttributes[av.attributeName] === av.value,
      ),
    );
    setSelectedItem(matchingItem ?? null);
  };

  if (isLoading) return <ProductPageSkeleton />;

  if (!product) {
    throw new Error(`Product #${productId} not found.`);
  }

  const galleryImages = selectedItem?.images?.length
    ? selectedItem.images
    : product.images;
  const hasAttributes = product.attributes.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Section: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Left: Gallery */}
          <div className="w-full">
            <div className="lg:sticky lg:top-8">
              <ProductGallery
                images={galleryImages}
                productName={product.name}
              />
            </div>
          </div>

          {/* Right: Info + Options + Actions */}
          <div className="w-full flex flex-col pt-2 lg:pt-4">
            <ProductInfo
              product={product}
              selectedItem={selectedItem}
              items={items}
            />

            <div className="mt-8">
              <ProductOptions
                product={product}
                items={items}
                selectedAttributes={selectedAttributes}
                onAttributeSelect={handleAttributeSelect}
              />
            </div>

            <PurchaseActions
              productId={product.id}
              selectedItem={selectedItem}
              hasAttributes={hasAttributes}
            />

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-border/50 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Secure Payment
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Free Shipping
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                30-Day Returns
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                2-Year Warranty
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs */}
        <div className="mt-16 sm:mt-24">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border/60 rounded-none overflow-x-auto flex-nowrap mb-8">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 font-display text-lg whitespace-nowrap"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 font-display text-lg whitespace-nowrap"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 font-display text-lg whitespace-nowrap"
              >
                Customer Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="description"
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="prose prose-slate max-w-4xl text-muted-foreground leading-relaxed">
                <p>
                  {product.description ??
                    "No description available for this product."}
                </p>
                <p className="mt-4">
                  Carefully crafted with premium materials and designed for
                  everyday use. This product embodies our commitment to quality
                  and sustainable practices.
                </p>
              </div>
            </TabsContent>

            <TabsContent
              value="specifications"
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="max-w-4xl">
                <h3 className="text-xl font-display font-semibold mb-6">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {product.attributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex flex-col py-3 border-b border-border/50"
                    >
                      <span className="text-sm font-medium text-foreground uppercase tracking-wider">
                        {attr.name}
                      </span>
                      <span className="text-muted-foreground mt-1">
                        {attr.values.map((v) => v.value).join(", ")}
                      </span>
                    </div>
                  ))}
                  <div className="flex flex-col py-3 border-b border-border/50">
                    <span className="text-sm font-medium text-foreground uppercase tracking-wider">
                      Brand
                    </span>
                    <span className="text-muted-foreground mt-1">
                      {product.brand.name}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="reviews"
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="max-w-5xl">
                <ProductReviews productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default function ProductPage() {
  const searchString = useSearch({ from: "/product/$productId" });
  const params = new URLSearchParams(searchString);
  const productIdStr = params.get("productId");
  const productId = productIdStr ? parseInt(productIdStr, 10) : 1;

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ProductPageContent productId={productId} />
    </ErrorBoundary>
  );
}
