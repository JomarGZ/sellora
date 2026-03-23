import OrderHistorySection from "@/features/order/components/sections/OrderHistorySection";
import { Button } from "@/shared/components/ui/button";
import { ProfileOverviewCard } from "../components/sections/ProfileOverviewCard";

export function AccountOverviewPage() {
  return (
    <>
      <ProfileOverviewCard />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold text-foreground">
            Recent Orders
          </h3>
          <Button variant="link" className="text-primary p-0">
            View All
          </Button>
        </div>
        <OrderHistorySection />
      </div>
    </>
  );
}
