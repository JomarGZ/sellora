import { CartItemCard } from "../item/CartItemCard";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { CartItemResponse } from "../../types";
import { accountCartRoute } from "@/app/routers/router";
import { Pagination } from "@/features/product/components/ui/Pagination";
import Skeleton from "react-loading-skeleton";

interface CartItemListProps {
  items: CartItemResponse;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  isLoading: boolean;
  isRemoving?: boolean;
}

export function CartItemList({
  items,
  onUpdateQuantity,
  onRemove,
  isLoading,
  isRemoving = false,
}: CartItemListProps) {
  const { page = 1 } = accountCartRoute.useSearch();
  const navigate = accountCartRoute.useNavigate();

  const setPage = (page: number) => {
    navigate({
      search: (prev: { page?: number }) => {
        if (page === 1) {
          delete prev.page;
        } else {
          prev.page = page;
        }

        return prev;
      },
    });
  };
  if (items?.data.length === 0) {
    return (
      <div className="text-center p-12 bg-white dark:bg-card rounded-2xl border border-border/50">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground">
          Your cart is empty
        </h3>
        <p className="text-muted-foreground mt-2">
          Looks like you haven't added anything yet.
        </p>
        <Button className="mt-6 rounded-xl">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-card p-4 rounded-2xl border border-border/50 flex gap-4"
            >
              <Skeleton width={96} height={96} borderRadius={12} />
              <div className="flex-1 py-1">
                <Skeleton width="60%" height={24} className="mb-2" />
                <Skeleton width="30%" height={16} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        items?.data?.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            isRemoving={isRemoving}
          />
        ))
      )}
      <Pagination
        currentPage={page}
        totalPages={items?.meta.last_page ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
