import { formatAttributeDescription } from "@/shared/lib/utils";

interface OrderItemCardProps {
  item: any;
}

export function OrderItemCard({ item }: OrderItemCardProps) {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={item.product_item_image_url}
          alt={item.product_name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="font-medium text-card-foreground truncate">
            {item.product_name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.attributes}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {item.unit_price}
          </span>
          <span className="font-semibold text-card-foreground">
            ${item.line_total}
          </span>
        </div>
      </div>
    </div>
  );
}
