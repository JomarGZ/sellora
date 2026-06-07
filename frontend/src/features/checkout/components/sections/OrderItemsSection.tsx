import { OrderItemCard } from "../ui/OrderItemCard";
import { Package } from "lucide-react";

interface OrderItemsSectionProps {
  items: any[];
}

export function OrderItemsSection({ items }: OrderItemsSectionProps) {
  if (items.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Order Items
        </h2>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-10">
          <Package className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium text-card-foreground">
            No items selected
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Go back to your cart to select items
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        Order Items ({items.length})
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <OrderItemCard key={item.product_item_id} item={item} />
        ))}
      </div>
    </section>
  );
}
