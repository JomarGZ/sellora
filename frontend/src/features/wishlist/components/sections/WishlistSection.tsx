import Skeleton from "react-loading-skeleton";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useCartUI } from "@/features/cart/hooks/useCartUI";
import { useRemoveFromWishlist, useWishlist } from "../../api/wishlist.queries";

export function WishlistSection() {
  const { data: wishlist, isLoading } = useWishlist();
  const removeMutation = useRemoveFromWishlist();
  const { addItem } = useCartUI();

  const handleRemove = (id: string, name: string) => {
    removeMutation.mutate(id, {
      onSuccess: () => {
        // toast({ title: "Removed from wishlist", description: name });
      },
    });
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      variant: "Default",
    });
    // toast({ title: "Added to cart", description: item.name });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-border/50"
          >
            <Skeleton height={200} className="rounded-none" />
            <div className="p-4">
              <Skeleton count={2} className="mb-4" />
              <Skeleton height={36} borderRadius={8} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!wishlist?.length) {
    return (
      <div className="text-center p-16 bg-white dark:bg-card rounded-3xl border border-border/50">
        <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-display font-bold text-foreground">
          Your wishlist is empty
        </h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Explore our collection and add items you love to your wishlist.
        </p>
        <Button className="mt-6 rounded-xl px-8">Discover Products</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col relative"
        >
          <button
            onClick={() => handleRemove(item.id, item.name)}
            disabled={removeMutation.isPending}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm text-rose-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50"
            title="Remove from wishlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="aspect-square overflow-hidden relative bg-muted">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {!item.inStock && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="font-semibold text-sm rounded-lg px-3 py-1"
                >
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h4 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {item.name}
            </h4>
            <div className="mt-auto pt-4 flex items-center justify-between">
              <span className="text-lg font-bold font-display">
                ${item.price.toFixed(2)}
              </span>
              <Button
                size="sm"
                className="rounded-lg shadow-sm hover-elevate"
                disabled={!item.inStock}
                onClick={() => handleAddToCart(item)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
