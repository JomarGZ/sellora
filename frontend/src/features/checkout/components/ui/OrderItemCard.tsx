import { formatAttributeDescription } from "@/shared/lib/utils";
import type { OrderItem } from "@/shared/types";

interface OrderItemCardProps {
  item: OrderItem;
}

export function OrderItemCard({ item }: OrderItemCardProps) {
  const attributeDescription = formatAttributeDescription(
    item.product_item.attribute_values,
  );
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={item.product_item.images[0].url}
          alt={item.product_item.product?.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="font-medium text-card-foreground truncate">
            {item.product_item.product?.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {attributeDescription}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Qty: {item.qty}</span>
          <span className="font-semibold text-card-foreground">
            ${(item.price * item.qty).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
