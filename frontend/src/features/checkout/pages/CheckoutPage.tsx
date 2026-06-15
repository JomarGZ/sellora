import { ErrorBoundary } from "react-error-boundary";
import { CheckoutContent } from "@/features/checkout/components/sections/CheckoutContent";
import { ErrorFallback } from "@/features/checkout/components/states/ErrorFallback";
import { usePlaceOrder } from "../api/checkout.queries";
import { AddressListModal } from "../components/modals/AddressListModal";
import { useState } from "react";
import {
  useSetDefaultUserAddress,
  useUserAddresses,
} from "@/features/address/api/address.queries";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAppToast } from "@/shared/components/feedback/AppToast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const queryClient = useQueryClient();
  const checkoutPreviewData = queryClient.getQueryData(["checkout-preview"]);
  if (!checkoutPreviewData) {
    navigate({ to: "/account/cart" });
  }
  const placeOrder = usePlaceOrder({
    onSuccess(response: any) {
      const url = response?.data.stripe_checkout_url;
      if (!url) {
        showToast({
          severity: "error",
          summary: "Checkout failed",
          detail: "Missing Stripe checkout URL.",
        });
        return;
      }
      window.location.assign(url);
    },
  });
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const { data: addresses } = useUserAddresses(addressModalOpen);
  const setDefaultAddress = useSetDefaultUserAddress();

  const handlePlaceOrder = () => {
    const idempotencyKey = crypto.randomUUID();

    placeOrder.mutate(idempotencyKey);
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
          previewData={checkoutPreviewData}
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
