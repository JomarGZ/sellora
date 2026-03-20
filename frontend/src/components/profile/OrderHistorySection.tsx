import { useState, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import {
  ExternalLink,
  Package,
  AlertCircle,
  Search,
  RefreshCw,
  Star,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RatingModal } from "./RatingModal";
import type { Order, OrderItem } from "@/data/mockProfile";
import { useOrders } from "@/hooks/useProfile";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "Shipped":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "Pending":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Cancelled":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "Unpaid":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Refunded":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
};

export function OrderHistorySection() {
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingOrder, setRatingOrder] = useState<{
    id: string;
    items: OrderItem[];
  } | null>(null);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let filtered = orders.filter((order) => {
      const matchesSearch =
        search === "" ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "All" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    filtered.sort((a, b) => {
      if (sortBy === "Latest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "Oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "Highest Price") return b.total - a.total;
      if (sortBy === "Lowest Price") return a.total - b.total;
      return 0;
    });

    return filtered;
  }, [orders, search, statusFilter, paymentFilter, sortBy]);

  const openRatingModal = (orderId: string, items: OrderItem[]) => {
    setRatingOrder({ id: orderId, items });
    setRatingModalOpen(true);
  };

  if (isError) {
    return (
      <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/10">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground">
          Failed to load orders
        </h3>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-card p-6 rounded-2xl border border-border/50"
          >
            <Skeleton height={24} width={150} className="mb-4" />
            <Skeleton count={2} className="mb-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="text-center p-12 bg-white dark:bg-card rounded-2xl border border-border/50">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground">No orders yet</h3>
        <p className="text-muted-foreground mt-2">
          When you place an order, it will appear here.
        </p>
        <Button className="mt-6 rounded-xl">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-card p-4 rounded-2xl border border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders or items..."
            className="pl-9 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All">All Payments</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Latest">Latest</SelectItem>
            <SelectItem value="Oldest">Oldest</SelectItem>
            <SelectItem value="Highest Price">Highest Price</SelectItem>
            <SelectItem value="Lowest Price">Lowest Price</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-card rounded-2xl border border-border/50">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">
            No matching orders
          </h3>
          <p className="text-muted-foreground mt-2">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {filteredOrders.map((order) => (
            <AccordionItem
              key={order.id}
              value={order.id}
              className="bg-white dark:bg-card rounded-2xl border border-border/50 px-2 sm:px-6 overflow-hidden data-[state=open]:shadow-md transition-all"
            >
              <AccordionTrigger className="hover:no-underline py-4 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-4">
                  <div className="text-left">
                    <div className="font-semibold text-foreground">
                      {order.id}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(order.date), "MMM dd, yyyy")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      {order.paymentStatus}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`font-medium border ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                    <div className="font-bold font-display ml-2">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-2 pb-6 border-t border-border/40 mt-2">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Order Items
                  </h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-2">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-wrap items-center justify-end gap-3 mt-6 pt-4 border-t border-border/30">
                    {(order.status === "Delivered" ||
                      order.status === "Cancelled") && (
                      <Button
                        variant="outline"
                        className="rounded-xl shadow-sm hover-elevate"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" /> Buy Again
                      </Button>
                    )}

                    {order.status === "Delivered" && (
                      <Button
                        variant="default"
                        className="rounded-xl shadow-sm hover-elevate"
                        onClick={() => openRatingModal(order.id, order.items)}
                      >
                        <Star className="w-4 h-4 mr-2" /> Rate
                      </Button>
                    )}

                    {order.status === "Shipped" && (
                      <Button
                        variant="default"
                        className="rounded-xl shadow-sm hover-elevate"
                      >
                        <Truck className="w-4 h-4 mr-2" /> Track Order
                      </Button>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {ratingOrder && (
        <RatingModal
          isOpen={ratingModalOpen}
          onClose={() => setRatingModalOpen(false)}
          orderId={ratingOrder.id}
          orderItems={ratingOrder.items}
        />
      )}
    </div>
  );
}
