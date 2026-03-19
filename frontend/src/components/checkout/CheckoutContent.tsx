import { useState, useEffect } from "react";
import type { CheckoutItem } from "@/types/checkout";
import { useAddresses } from "@/hooks/useAddresses";
import { useShippingMethods } from "@/hooks/useShippingMethods";
import { useCheckout } from "@/hooks/useCheckout";
import { AddressSection } from "./AddressSection";
import { ShippingMethodSection } from "./ShippingMethodSection";
import { OrderItemsSection } from "./OrderItemsSection";
import { OrderSummarySection } from "./OrderSummarySection";

interface CheckoutContentProps {
  items: CheckoutItem[];
}

export function CheckoutContent({ items }: CheckoutContentProps) {
  const {
    addresses,
    loading: addrLoading,
    error: addrError,
    retry: addrRetry,
    deleteAddress,
  } = useAddresses();
  const {
    methods,
    loading: shipLoading,
    error: shipError,
    retry: shipRetry,
  } = useShippingMethods();
  const { placing, placeOrder } = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(
    null,
  );

  // Auto-select default address
  useEffect(() => {
    if (!addrLoading && addresses.length > 0 && selectedAddressId === null) {
      const def = addresses.find((a) => a.is_default);
      setSelectedAddressId(def?.id ?? addresses[0].id);
    }
  }, [addresses, addrLoading, selectedAddressId]);

  const selectedShipping =
    methods.find((m) => m.id === selectedShippingId) ?? null;
  const canPlaceOrder =
    !!selectedAddressId && !!selectedShippingId && items.length > 0;

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) return;
    placeOrder({
      address_id: selectedAddressId!,
      shipping_method_id: selectedShippingId!,
      items: items.map((i) => ({
        product_item_id: i.product_item_id,
        quantity: i.quantity,
      })),
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
      <h1 className="mb-6 text-2xl font-bold text-foreground lg:mb-8 lg:text-3xl">
        Checkout
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Left column */}
        <div className="flex-1 space-y-6 lg:space-y-8">
          <AddressSection
            addresses={addresses}
            loading={addrLoading}
            error={addrError}
            selectedId={selectedAddressId}
            onSelect={setSelectedAddressId}
            onDelete={deleteAddress}
            onRetry={addrRetry}
          />
          <ShippingMethodSection
            methods={methods}
            loading={shipLoading}
            error={shipError}
            selectedId={selectedShippingId}
            onSelect={setSelectedShippingId}
            onRetry={shipRetry}
          />
          <OrderItemsSection items={items} />
        </div>

        {/* Right column - sticky summary */}
        <div className="lg:w-[380px]">
          <div className="lg:sticky lg:top-6">
            <OrderSummarySection
              items={items}
              shippingMethod={selectedShipping}
              canPlaceOrder={canPlaceOrder}
              placing={placing}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
