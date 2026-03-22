import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { cn } from "@/shared/components/lib/utils";
import type { ProductItem } from "../../types";

interface PurchaseActionsProps {
  productId: number;
  selectedItem: ProductItem | null;
  hasAttributes: boolean;
}

export function PurchaseActions({
  productId: _productId,
  selectedItem,
  hasAttributes,
}: PurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const isOutOfStock = selectedItem ? selectedItem.qtyInStock === 0 : false;
  const isSelectionIncomplete = hasAttributes && !selectedItem;

  // ─────────────────────────────────────────────────────────────────────────────
  // When you have your real API ready, replace the bodies of these two handlers
  // with your actual fetch / mutation calls.
  // ─────────────────────────────────────────────────────────────────────────────

  const handleAddToCart = async () => {
    if (!selectedItem) {
      //   toast({
      //     title: "Please select options",
      //     description: "Choose all product options before adding to cart.",
      //     variant: "destructive",
      //   });
      return;
    }

    setAddingToCart(true);
    try {
      // TODO: replace with real API call
      // await addToCartApi({ productItemId: selectedItem.id, quantity });
      await new Promise((r) => setTimeout(r, 500));

      //   toast({
      //     title: "Added to Cart!",
      //     description: `${quantity}x item added to your cart.`,
      //   });
      setQuantity(1);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    const next = !wishlisted;
    setWishlisted(next);
    // TODO: replace with real API call
    // await toggleWishlistApi(productId);
    // toast({
    //   title: next ? "Added to Wishlist" : "Removed from Wishlist",
    //   description: next
    //     ? "We'll save this for later."
    //     : "Item removed from your wishlist.",
    // });
  };

  return (
    <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-border/60">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center h-14 bg-muted/50 rounded-xl border border-border/80 px-2 flex-shrink-0">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background disabled:opacity-40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium font-display text-lg">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity((q) =>
                selectedItem ? Math.min(selectedItem.qtyInStock, q + 1) : q + 1,
              )
            }
            disabled={
              isOutOfStock ||
              (selectedItem !== null && quantity >= selectedItem.qtyInStock)
            }
            className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background disabled:opacity-40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart */}
        <Button
          size="lg"
          className="flex-1 h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          disabled={isOutOfStock || isSelectionIncomplete || addingToCart}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {addingToCart
            ? "Adding..."
            : isOutOfStock
              ? "Out of Stock"
              : isSelectionIncomplete
                ? "Select Options"
                : "Add to Cart"}
        </Button>

        {/* Wishlist */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-14 w-14 rounded-xl shrink-0 border-border/80 transition-all duration-300 hover:border-rose-200 hover:bg-rose-50",
            wishlisted && "border-rose-200 bg-rose-50",
          )}
          onClick={handleToggleWishlist}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-300",
              wishlisted
                ? "fill-rose-500 text-rose-500 scale-110"
                : "text-muted-foreground hover:text-rose-500",
            )}
          />
        </Button>
      </div>

      {selectedItem &&
        selectedItem.qtyInStock > 0 &&
        selectedItem.qtyInStock <= 5 && (
          <p className="text-sm text-amber-600 font-medium">
            Hurry! Only {selectedItem.qtyInStock} left in stock.
          </p>
        )}
    </div>
  );
}
