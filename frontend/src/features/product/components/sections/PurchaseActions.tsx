import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Heart, ShoppingCart, Minus, Plus, ShoppingBag } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  useAddToCartMutation,
  useBuyNowMutation,
} from "@/features/cart/api/cart.queries";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import type { ProductItem } from "@/shared/types";
import { useNavigate, type HistoryState } from "@tanstack/react-router";
import { useCartSelection } from "@/features/cart/store/cartSelection.store";

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
  const { showToast } = useAppToast();
  const addToCart = useAddToCartMutation();
  const buyNow = useBuyNowMutation();
  const navigate = useNavigate();
  const isOutOfStock = selectedItem ? selectedItem.qty === 0 : false;
  const isSelectionIncomplete = hasAttributes && !selectedItem;
  const selectItem = useCartSelection((s) => s.selectItem);

  // ─────────────────────────────────────────────────────────────────────────────
  // When you have your real API ready, replace the bodies of these two handlers
  // with your actual fetch / mutation calls.
  // ─────────────────────────────────────────────────────────────────────────────

  const handleAddToCart = () => {
    if (!selectedItem) {
      showToast({
        severity: "error",
        summary: "Please select options",
        detail: "Choose all product options before adding to cart.",
      });
      return;
    }
    addToCart.mutate({
      product_item_id: selectedItem.id,
      quantity,
    });
  };

  const handleBuyNow = async () => {
    if (!selectedItem) {
      showToast({
        severity: "error",
        summary: "Please select options",
        detail: "Choose all product options before buying.",
      });
      return;
    }

    try {
      const response = await buyNow.mutateAsync({
        product_item_id: selectedItem.id,
        quantity,
      });
      const cartItem = response.data;
      const isChecked = true;
      selectItem(cartItem.id, isChecked);
      navigate({
        to: "/account/cart",
      });
    } catch (error) {
      console.error("Failed to add to cart a for buy now");
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
        <div className="flex items-center h-14 bg-muted/50 rounded-xl border border-border/80 px-2 shrink-0">
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
                selectedItem ? Math.min(selectedItem.qty, q + 1) : q + 1,
              )
            }
            disabled={
              isOutOfStock ||
              (selectedItem !== null && quantity >= selectedItem.qty)
            }
            className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background disabled:opacity-40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart */}
        <Button
          size="lg"
          className="flex-1 h-14 text-base cursor-pointer font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          disabled={
            isOutOfStock || isSelectionIncomplete || addToCart.isPending
          }
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {addToCart.isPending
            ? "Adding..."
            : isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          className="flex-1 h-14 text-base cursor-pointer font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          disabled={isOutOfStock || isSelectionIncomplete || buyNow.isPending}
          onClick={handleBuyNow}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          {buyNow.isPending
            ? "Buying out..."
            : isOutOfStock
              ? "Out of Stock"
              : "Buy Now"}
        </Button>

        {/* Wishlist */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-14 w-14 rounded-xl shrink-0 cursor-pointer border-border/80 transition-all duration-300 hover:border-rose-200 hover:bg-rose-50",
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

      {selectedItem && selectedItem.qty > 0 && selectedItem.qty <= 5 && (
        <p className="text-sm text-amber-600 font-medium">
          Hurry! Only {selectedItem.qty} left in stock.
        </p>
      )}
    </div>
  );
}
