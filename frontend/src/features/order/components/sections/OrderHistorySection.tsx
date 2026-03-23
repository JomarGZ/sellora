import { useCallback, useMemo, useState } from "react";
import { mockOrders } from "@/data";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import OrderFilters from "@/features/order/components/sections/OrderFilters";
import OrderList from "@/features/order/components/sections/OrderList";
import OrderPagination from "@/features/order/components/sections/OrderPagination";
import ReviewModal from "@/components/profile/ReviewModal";
import ErrorFallback from "@/features/order/components/states/ErrorFallback";
import type {
  Order,
  OrderCallbacks,
  OrderFiltersState,
  OrderItem,
} from "../../types";

const ORDERS_PER_PAGE = 5;

const OrderHistorySection = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filters, setFilters] = useState<OrderFiltersState>({
    orderStatus: "all",
    paymentStatus: "all",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);

  // Review modal state — tracks specific item being reviewed
  const [reviewTarget, setReviewTarget] = useState<{
    orderId: string;
    item: OrderItem;
  } | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filters.orderStatus !== "all" && order.status !== filters.orderStatus)
        return false;
      if (
        filters.paymentStatus !== "all" &&
        order.paymentStatus !== filters.paymentStatus
      )
        return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesItem = order.items.some((item) =>
          item.name.toLowerCase().includes(q),
        );
        if (!matchesId && !matchesItem) return false;
      }
      return true;
    });
  }, [filters, orders]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  const handleFiltersChange = (newFilters: OrderFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // --- Callbacks ---
  const handleCancel = useCallback((orderId: string) => {
    toast.info(`Cancellation requested for ${orderId}`);
  }, []);

  const handleReceive = useCallback((orderId: string) => {
    toast.success(`${orderId} marked as received!`);
  }, []);

  const handleOrderAgain = useCallback((order: Order) => {
    const inStockItems = order.items.filter((i) => i.inStock);
    toast.success(
      `${inStockItems.length} item(s) from ${order.id} added to cart!`,
    );
  }, []);

  const handleBuyAgain = useCallback((item: OrderItem) => {
    toast.success(`${item.name} added to cart!`);
  }, []);

  const handleReviewSubmit = useCallback(
    (orderId: string, itemId: string, rating: number, comment: string) => {
      // Mark item as reviewed in local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                items: o.items.map((i) =>
                  i.id === itemId ? { ...i, reviewed: true } : i,
                ),
              }
            : o,
        ),
      );
      toast.success(
        `Review submitted (${rating}★)${comment ? " with comment" : ""}!`,
      );
    },
    [],
  );

  const callbacks: OrderCallbacks = useMemo(
    () => ({
      onCancel: handleCancel,
      onReceive: handleReceive,
      onOrderAgain: handleOrderAgain,
      onBuyAgain: handleBuyAgain,
      onReviewSubmit: handleReviewSubmit,
    }),
    [
      handleCancel,
      handleReceive,
      handleOrderAgain,
      handleBuyAgain,
      handleReviewSubmit,
    ],
  );

  const handleReviewItem = useCallback((orderId: string, item: OrderItem) => {
    setReviewTarget({ orderId, item });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <h2 className="text-2xl font-semibold sm:text-4xl">Order History</h2>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <OrderFilters filters={filters} onFiltersChange={handleFiltersChange} />

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setOrders(mockOrders)}
        >
          <OrderList
            orders={paginatedOrders}
            isLoading={isLoading}
            callbacks={callbacks}
            onReviewItem={handleReviewItem}
          />
        </ErrorBoundary>

        <OrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <ReviewModal
          orderId={reviewTarget?.orderId ?? null}
          item={reviewTarget?.item ?? null}
          open={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={handleReviewSubmit}
        />
      </div>
    </div>
  );
};

export default OrderHistorySection;
