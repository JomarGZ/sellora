import { AddressSection } from "./AddressSection";
import { ShippingMethodSection } from "./ShippingMethodSection";
import { OrderItemsSection } from "./OrderItemsSection";
import { OrderSummarySection } from "./OrderSummarySection";
import type { OrderItem } from "@/shared/types";
import { useShippingOption } from "../../api/checkout.queries";
import type { OrderSummary } from "../../types";

interface CheckoutContentProps {
  items: OrderItem[];
  orderSummary: OrderSummary;
  onPlaceOrder: () => void;
  placingOrder: boolean;
  isOrderItemsLoading: boolean;
  onChangeAddress: () => void;
}

export function CheckoutContent({
  items,
  orderSummary,
  placingOrder,
  onChangeAddress,
  onPlaceOrder,
  isOrderItemsLoading,
}: CheckoutContentProps) {
  const {
    data: defaultShippingMethod,
    isLoading,
    refetch,
    error,
  } = useShippingOption();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
      <h1 className="mb-6 text-2xl font-bold text-foreground lg:mb-8 lg:text-3xl">
        Checkout
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Left column */}
        <div className="flex-1 space-y-6 lg:space-y-8">
          <AddressSection onChange={onChangeAddress} />
          <ShippingMethodSection
            shippingOption={defaultShippingMethod}
            isLoading={isLoading}
            refetch={refetch}
            error={error}
          />
          <OrderItemsSection items={items} isloading={isOrderItemsLoading} />
        </div>

        {/* Right column - sticky summary */}
        <div className="lg:w-95">
          <div className="lg:sticky lg:top-6">
            <OrderSummarySection
              orderSummary={orderSummary}
              placing={placingOrder}
              onPlaceOrder={onPlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
