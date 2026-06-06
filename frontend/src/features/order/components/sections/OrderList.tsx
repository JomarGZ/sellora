import type { OrderResponse } from "@/shared/types";
import OrderListSkeleton from "../states/OrderCardSkeleton";
import EmptyState from "../states/EmptyState";
import OrderCard from "../ui/OrderCard";
import { Pagination } from "@/features/product/components/ui/Pagination";
import type { ReviewPayload } from "../../types";
import {
  useMarkOrderAsReceived,
  useRequestOrderCancellation,
} from "../../api/order.queries";

interface OrderListProps {
  orders: OrderResponse | undefined;
  isLoading: boolean;
  page: number;
  setPage: (newPage: number) => void;
  onReview: (payload: ReviewPayload) => void;
}

const OrderList = ({
  orders,
  isLoading,
  page,
  setPage,
  onReview,
}: OrderListProps) => {
  const requestCancellationMutation = useRequestOrderCancellation();
  const markAsReceivedMutation = useMarkOrderAsReceived();
  if (isLoading) return <OrderListSkeleton />;
  if (orders?.data?.length === 0) return <EmptyState />;
  return (
    <>
      <div className="space-y-4">
        {orders?.data.map((order) => (
          <OrderCard
            key={order.id}
            onMarkReceived={(orderId: number) =>
              markAsReceivedMutation.mutate(orderId)
            }
            markReceivedLoading={markAsReceivedMutation.isPending}
            onRequestCancellation={(orderId: number) =>
              requestCancellationMutation.mutate(orderId)
            }
            requestCancellationLoading={requestCancellationMutation.isPending}
            order={order}
            onReview={onReview}
          />
        ))}
      </div>
      <div>
        <Pagination
          currentPage={page}
          totalPages={orders?.pagination?.last_page ?? 1}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};

export default OrderList;
