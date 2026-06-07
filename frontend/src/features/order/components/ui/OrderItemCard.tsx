import { Button } from "@/shared/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import type { OrderItem } from "@/shared/types";
import type { ReviewPayload } from "../../types";
import { Link } from "@tanstack/react-router";

interface OrderItemCardProps {
  item: OrderItem;
  onReview: (payload: ReviewPayload) => void;
}

const OrderItemCard = ({ item, onReview }: OrderItemCardProps) => {
  return (
    <div className="flex items-start gap-3 py-3">
      <img
        src={item.product_image_url}
        alt={item.product_name}
        className="h-14 w-14 rounded-md object-cover bg-secondary shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {item.product_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.attributes} · {item.quantity} × ${item.unit_price}
            </p>
            {!item.in_stock && (
              <Badge
                variant="outline"
                className="mt-1 text-[10px] text-destructive border-destructive/20"
              >
                Out of Stock
              </Badge>
            )}
            {item.is_reviewed && (
              <Badge
                variant="outline"
                className="mt-1 text-[10px] text-status-success border-status-success/20"
              >
                Reviewed
              </Badge>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground whitespace-nowrap">
            ${item.line_total}
          </p>
        </div>

        {/* Item-level actions */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {item.in_stock && (
            <Link
              to={`/product/${item.product_slug}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary hover:text-white hover:shadow-sm active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Buy Again
            </Link>
          )}
          {item.can_review && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                onReview({
                  orderItemId: item.id,
                  productItemId: item.product_item_id,
                  productItemImage: item.product_image_url,
                  productName: item.product_name,
                });
              }}
              className="h-7 text-xs gap-1 px-2 cursor-pointer text-status-pending"
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
