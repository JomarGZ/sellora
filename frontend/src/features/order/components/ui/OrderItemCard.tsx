import { Button } from "@/shared/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  REVIEWABLE_STATUSES,
  type OrderCallbacks,
  type OrderItem,
  type OrderStatus,
} from "../../types";

interface OrderItemCardProps {
  item: OrderItem;
  orderStatus: OrderStatus;
  orderId: string;
  callbacks: OrderCallbacks;
  onReviewItem: (orderId: string, item: OrderItem) => void;
}

const OrderItemCard = ({
  item,
  orderStatus,
  orderId,
  callbacks,
  onReviewItem,
}: OrderItemCardProps) => {
  const canReview = REVIEWABLE_STATUSES.includes(orderStatus) && !item.reviewed;
  const canBuyAgain = item.inStock;

  return (
    <div className="flex items-start gap-3 py-3">
      <img
        src={item.image}
        alt={item.name}
        className="h-14 w-14 rounded-md object-cover bg-secondary shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {item.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.variant} · Qty: {item.quantity}
            </p>
            {!item.inStock && (
              <Badge
                variant="outline"
                className="mt-1 text-[10px] text-destructive border-destructive/20"
              >
                Out of Stock
              </Badge>
            )}
            {item.reviewed && (
              <Badge
                variant="outline"
                className="mt-1 text-[10px] text-status-success border-status-success/20"
              >
                Reviewed
              </Badge>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground whitespace-nowrap">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Item-level actions */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {canBuyAgain && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs gap-1 px-2 text-primary"
              onClick={() => callbacks.onBuyAgain(item)}
            >
              <ShoppingCart className="h-3 w-3" />
              Buy Again
            </Button>
          )}
          {canReview && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs gap-1 px-2 text-status-pending"
              onClick={() => onReviewItem(orderId, item)}
            >
              <Star className="h-3 w-3" />
              Rate Product
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
