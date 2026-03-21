import type { ReactNode } from "react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  icon,
  title = "No orders found",
  description = "You haven't placed any orders yet, or your filters returned no results.",
  actionLabel = "Start Shopping",
  onAction,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="mb-4 text-muted-foreground/40">
      {icon ?? <Package className="h-16 w-16" />}
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
    {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
  </div>
);

export default EmptyState;
