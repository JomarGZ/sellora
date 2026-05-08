// features/cart/components/list/CartItemList.tsx
import { CartItemCard } from "../item/CartItemCard";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Pagination } from "@/features/product/components/ui/Pagination";
import Skeleton from "react-loading-skeleton";
import { accountCartRoute } from "@/app/routers/router";
import {
  useCartQuery,
  useDeleteCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from "../../api/cart.queries";
import type { CartItem } from "../../types";

type CartItemListProps = {
  isSelected: (id: number) => boolean;
  onSelectItem: (id: number, checked: boolean) => void;
  onSelectAll: (ids: number[]) => void;
  onDeselectAll: (ids: number[]) => void;
};

export function CartItemList({
  isSelected,
  onSelectItem,
  onSelectAll,
  onDeselectAll,
}: CartItemListProps) {
  const { page = 1 } = accountCartRoute.useSearch();
  const navigate = accountCartRoute.useNavigate();
  const { data: cartData, isLoading } = useCartQuery(page);
  const deleteCartItem = useDeleteCartItemMutation();
  const updateQuantity = useUpdateCartItemQuantityMutation();

  const setPage = (newPage: number) => {
    navigate({
      search: (prev: { page?: number }) => {
        const next = { ...prev };
        if (newPage === 1) delete next.page;
        else next.page = newPage;
        return next;
      },
    });
  };

  const pageIds =
    cartData?.data.map((item: CartItem) => item.product_item.id) ?? [];

  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => isSelected(id));

  const handleSelectPage = (checked: boolean) => {
    checked ? onSelectAll(pageIds) : onDeselectAll(pageIds);
  };

  if (!isLoading && cartData?.data.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-4">
      {/* Per-page select-all — mirrors Shopee/Lazada behaviour */}
      {!isLoading && pageIds.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-card rounded-xl border border-border/50">
          <input
            type="checkbox"
            checked={allPageSelected}
            onChange={(e) => handleSelectPage(e.target.checked)}
            className="w-4 h-4 rounded"
            id="select-page"
          />
          <label
            htmlFor="select-page"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Select all on this page
          </label>
        </div>
      )}

      {isLoading ? (
        <CartSkeleton />
      ) : (
        cartData?.data.map((item: CartItem) => (
          <CartItemCard
            key={item.id}
            item={item}
            isSelected={isSelected(item.product_item.id)}
            onSelect={onSelectItem}
            onUpdateQuantity={(id, quantity) =>
              updateQuantity.mutate({ id, quantity })
            }
            onRemove={(id) => deleteCartItem.mutate(id)}
            isRemoving={
              deleteCartItem.isPending && deleteCartItem.variables === item.id
            }
          />
        ))
      )}

      <Pagination
        currentPage={page}
        totalPages={cartData?.meta.last_page ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="text-center p-12 bg-white dark:bg-card rounded-2xl border border-border/50">
      <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-semibold">Your cart is empty</h3>
      <p className="text-muted-foreground mt-2">
        Looks like you haven't added anything yet.
      </p>
      <Button className="mt-6 rounded-xl">Continue Shopping</Button>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-4">
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
  );
}
