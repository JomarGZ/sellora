import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { subDays } from "date-fns";
import { ChevronRight } from "lucide-react";
import type { ProductDetail, ProductItem } from "../../types";

interface ProductInfoProps {
  product: ProductDetail;
  selectedItem: ProductItem | null;
  items: ProductItem[];
}

export function ProductInfo({
  product,
  selectedItem,
  items,
}: ProductInfoProps) {
  const minPrice = Math.min(...items.map((i) => i.price));
  const maxPrice = Math.max(...items.map((i) => i.price));

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const displayPrice = selectedItem
    ? formatPrice(selectedItem.price)
    : minPrice === maxPrice
      ? formatPrice(minPrice)
      : `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;

  const originalPrice = selectedItem?.originalPrice;

  const isNewArrival = new Date(product.createdAt) > subDays(new Date(), 30);
  const isBestSeller = product.ordersCount > 50;
  const isOutOfStock = selectedItem
    ? selectedItem.qtyInStock === 0
    : items.every((i) => i.qtyInStock === 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      {product.categories.length > 0 && (
        <nav className="flex items-center flex-wrap gap-y-1 text-sm text-muted-foreground">
          <span className="hover:text-foreground transition-colors cursor-pointer">
            Home
          </span>
          {product.categories.map((cat, idx) => (
            <div key={cat.id} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
              <span
                className={
                  idx === product.categories.length - 1
                    ? "text-foreground font-medium"
                    : "hover:text-foreground transition-colors cursor-pointer"
                }
              >
                {cat.name}
              </span>
            </div>
          ))}
        </nav>
      )}

      {/* Brand & Title */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {product.brand.logo && (
            <img
              src={product.brand.logo}
              alt={product.brand.name}
              className="h-6 w-auto object-contain"
            />
          )}
          <span className="text-sm font-semibold tracking-wide text-primary/80 uppercase">
            {product.brand.name}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display text-foreground leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Price & Badges */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {displayPrice}
          </span>
          {originalPrice && originalPrice > (selectedItem?.price ?? 0) && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-1.5">
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="font-semibold uppercase tracking-wider text-xs px-2 py-0.5 rounded-md"
            >
              Out of Stock
            </Badge>
          )}
          {isNewArrival && !isOutOfStock && (
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-semibold uppercase tracking-wider text-xs px-2 py-0.5 rounded-md shadow-none">
              New Arrival
            </Badge>
          )}
          {isBestSeller && (
            <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 border-none font-semibold uppercase tracking-wider text-xs px-2 py-0.5 rounded-md shadow-none">
              Best Seller
            </Badge>
          )}
        </div>
      </div>

      <Separator className="bg-border/60" />

      {/* Description */}
      {product.description && (
        <div className="prose prose-sm sm:prose-base prose-slate max-w-none text-muted-foreground leading-relaxed">
          <p>{product.description}</p>
        </div>
      )}
    </div>
  );
}
