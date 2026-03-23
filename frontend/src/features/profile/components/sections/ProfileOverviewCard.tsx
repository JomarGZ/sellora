import Skeleton from "react-loading-skeleton";
import { Package, Heart, MapPin, CreditCard } from "lucide-react";
import {
  useAddresses,
  useOrders,
  useRemoveFromWishlist,
} from "../../api/account.queries";

export function ProfileOverviewCard() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const { data: wishlist, isLoading: wishlistLoading } =
    useRemoveFromWishlist();

  const totalSpent = orders?.reduce((acc, order) => acc + order.total, 0) || 0;

  const stats = [
    {
      label: "Total Orders",
      value: orders?.length || 0,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      loading: ordersLoading,
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: CreditCard,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      loading: ordersLoading,
    },
    {
      label: "Wishlist Items",
      value: wishlist?.length || 0,
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      loading: wishlistLoading,
    },
    {
      label: "Saved Addresses",
      value: addresses?.length || 0,
      icon: MapPin,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      loading: addressesLoading,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white dark:bg-card p-5 rounded-2xl shadow-sm border border-border/40 hover:shadow-md transition-shadow flex flex-col group"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            {stat.loading ? (
              <>
                <Skeleton width={80} height={28} className="mb-1" />
                <Skeleton width={100} height={16} />
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-foreground font-display">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {stat.label}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
