import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import OrderFilters from "@/features/order/components/sections/OrderFilters";
import OrderList from "@/features/order/components/sections/OrderList";
import ErrorFallback from "@/features/order/components/states/ErrorFallback";
import type { ReviewPayload } from "../../types";
import { ReviewModal } from "../modal/ReviewModal";
import { useOrdersList, useReviewOrderItem } from "../../api/order.queries";
import { accountOrdersRoute } from "@/app/routers/router";
import type { ReviewFormValues } from "../../validation/review.schema";

const OrderHistorySection = () => {
  const { page = 1 } = accountOrdersRoute.useSearch();
  const navigate = accountOrdersRoute.useNavigate();
  const { data: orders, isLoading, refetch } = useOrdersList(page);
  console.log(orders);
  const [selectedReviewItem, setSelectedReviewItem] =
    useState<ReviewPayload | null>(null);
  const reviewMutation = useReviewOrderItem();

  const setPage = (newPage: number) => {
    navigate({
      search: (prev: { page?: number }) => {
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
  const onOrderItemReview = (payload: ReviewPayload) => {
    setSelectedReviewItem(payload);
  };

  const handleReviewSubmit = async (
    data: ReviewFormValues,
    reset: () => void,
  ) => {
    const orderItemId = selectedReviewItem?.orderItemId ?? null;
    const productItemId = selectedReviewItem?.productItemId ?? null;
    if (!orderItemId) {
      console.error("order item id is required to submit");
      return;
    }

    if (!productItemId) {
      console.error("product item id is required to submit");
      return;
    }
    try {
      await reviewMutation.mutateAsync({
        order_item_id: selectedReviewItem!.orderItemId,
        product_item_id: selectedReviewItem!.productItemId,
        rating: data.rating,
        comment: data.comment,
      });
      setSelectedReviewItem(null);
      reset(); // ✅ only runs on success
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* <OrderFilters filters={filters} onFiltersChange={handleFiltersChange} /> */}

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => refetch()}
        >
          <OrderList
            orders={orders}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            onReview={onOrderItemReview}
          />
        </ErrorBoundary>

        <ReviewModal
          productName={selectedReviewItem?.productName ?? ""}
          productImage={selectedReviewItem?.productItemImage ?? ""}
          isPending={reviewMutation.isPending}
          existingReview={null}
          isOpen={!!selectedReviewItem}
          onClose={() => setSelectedReviewItem(null)}
          onSubmit={handleReviewSubmit}
        />
      </div>
    </div>
  );
};

export default OrderHistorySection;
