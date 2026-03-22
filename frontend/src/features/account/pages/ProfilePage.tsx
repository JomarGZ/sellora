import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

import { ProfileHeader } from "@/features/account/components/ui/ProfileHeader";
import { ProfileOverviewCard } from "@/features/account/components/sections/ProfileOverviewCard";
import OrderHistorySection from "@/features/order/components/sections/OrderHistorySection";
import { AddressSection } from "@/components/profile/AddressSection";
import { WishlistSection } from "@/features/wishlist/components/sections/WishlistSection";
import { SettingsSection } from "@/features/account/components/sections/SettingsSection";
import { useCartUI } from "@/features/cart/hooks/useCartUI";
import { CartSection } from "@/features/cart/components/sections/CartSection";

type Tab =
  | "overview"
  | "orders"
  | "addresses"
  | "wishlist"
  | "settings"
  | "cart";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Order History", icon: ShoppingBag },
  { id: "cart", label: "Cart", icon: ShoppingCart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/10">
      <h2 className="text-xl font-bold text-destructive mb-2">
        Something went wrong
      </h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { items } = useCartUI();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <ProfileOverviewCard />
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold text-foreground">
                  Recent Orders
                </h3>
                <Button
                  variant="link"
                  onClick={() => setActiveTab("orders")}
                  className="text-primary p-0"
                >
                  View All
                </Button>
              </div>
              <OrderHistorySection />
            </div>
          </motion.div>
        );
      case "orders":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              Order History
            </h2>
            <OrderHistorySection />
          </motion.div>
        );
      case "cart":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CartSection />
          </motion.div>
        );
      case "addresses":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <AddressSection />
          </motion.div>
        );
      case "wishlist":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              Your Wishlist
            </h2>
            <WishlistSection />
          </motion.div>
        );
      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              Account Settings
            </h2>
            <SettingsSection />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Profile Header (Top) */}
        <div className="mb-8">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ProfileHeader />
          </ErrorBoundary>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation (Desktop) */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white dark:bg-card rounded-2xl border border-border/50 p-4 sticky top-8">
              <nav className="space-y-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon
                        className={`w-5 h-5 ${activeTab === tab.id ? "opacity-100" : "opacity-70"}`}
                      />
                      {tab.label}
                    </div>
                    {tab.id === "cart" && cartItemCount > 0 && (
                      <Badge
                        variant={activeTab === tab.id ? "secondary" : "default"}
                        className="ml-auto px-2 py-0.5 min-w-5 justify-center"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-border/40 px-2">
                <button className="flex items-center gap-3 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors w-full px-2 py-2">
                  <LogOut className="w-5 h-5 opacity-70" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Tab Navigation (Horizontal Scroll) */}
          <div className="lg:hidden -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar mb-2 pb-2">
            <div className="flex gap-2 w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-white dark:bg-card text-muted-foreground border border-border/50 hover:bg-muted"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === "cart" && cartItemCount > 0 && (
                    <Badge
                      variant={activeTab === tab.id ? "secondary" : "default"}
                      className="ml-1.5 px-1.5 py-0 min-w-4 text-[10px] h-4 justify-center"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => setActiveTab("overview")}
            >
              <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
