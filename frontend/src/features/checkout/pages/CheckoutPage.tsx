import { ErrorBoundary } from "react-error-boundary";
import { CheckoutContent } from "@/features/checkout/components/sections/CheckoutContent";
import { ErrorFallback } from "@/features/checkout/components/states/ErrorFallback";
import {
  useCurrentCheckoutPreview,
  usePlaceOrder,
} from "../api/checkout.queries";
import type { OrderSummary } from "../types";
import { AddressListModal } from "../components/modals/AddressListModal";
import { useState } from "react";
import {
  useSetDefaultUserAddress,
  useUserAddresses,
} from "@/features/address/api/address.queries";

export default function CheckoutPage() {
  const { data: checkoutPreviewData, isLoading } = useCurrentCheckoutPreview();
  const placeOrder = usePlaceOrder({
    onSuccess(response: any) {
      window.location.assign(response.data.checkout_url);
    },
  });
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const { data: addresses } = useUserAddresses(addressModalOpen);
  const setDefaultAddress = useSetDefaultUserAddress();

  const preview = checkoutPreviewData?.data;
  if (!preview) {
    return null;
  }
  const orderItems = preview.order_items ?? [];
  const orderId = preview.id;

  const orderSummary: OrderSummary = {
    items_count: preview.order_items.length,
    subtotal: Number(preview.subtotal),
    shipping_fee: Number(preview.shipping_fee),
    total: Number(preview.order_total),
  };
  const handlePlaceOrder = () => {
    if (!orderId) return;
    placeOrder.mutate(orderId);
  };
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <ErrorFallback
            message="Something went wrong"
            onRetry={resetErrorBoundary}
          />
        </div>
      )}
    >
      <div className="min-h-screen bg-background">
        <CheckoutContent
          onChangeAddress={() => setAddressModalOpen(true)}
          onPlaceOrder={handlePlaceOrder}
          placingOrder={placeOrder.isPending}
          orderSummary={orderSummary}
          items={orderItems}
          isOrderItemsLoading={isLoading}
        />
        <AddressListModal
          open={addressModalOpen}
          isLoading={setDefaultAddress.isPending}
          onOpenChange={setAddressModalOpen}
          addresses={addresses?.data ?? []}
          onSetDefault={(id) => setDefaultAddress.mutate(id)}
        />
      </div>
    </ErrorBoundary>
  );
}
