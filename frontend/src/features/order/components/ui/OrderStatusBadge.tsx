import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrderStatus } from "../../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  [OrderStatus.Delivered]:
    "bg-status-success/10 text-status-success border-status-success/20",
  [OrderStatus.Shipped]: "bg-primary/10 text-primary border-primary/20",
  [OrderStatus.OutForDelivery]: "bg-primary/10 text-primary border-primary/20",
  [OrderStatus.Processing]:
    "bg-status-pending/10 text-status-pending border-status-pending/20",
  [OrderStatus.PreparingToShip]:
    "bg-status-pending/10 text-status-pending border-status-pending/20",
  [OrderStatus.Pending]:
    "bg-status-pending/10 text-status-pending border-status-pending/20",
  [OrderStatus.Cancelled]:
    "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20",
};

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <Badge
    variant="outline"
    className={cn("text-xs font-medium", statusStyles[status])}
  >
    {status}
  </Badge>
);

export default OrderStatusBadge;
