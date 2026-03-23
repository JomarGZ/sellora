import OrderHistorySection from "@/features/order/components/sections/OrderHistorySection";
import { ProfileOverviewCard } from "../components/sections/ProfileOverviewCard";

export function AccountOverviewPage() {
  return (
    <>
      <ProfileOverviewCard />
      <OrderHistorySection />
    </>
  );
}
