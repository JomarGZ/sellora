import { useUserDefaultAddress } from "@/features/address/api/address.queries";
import { AddressSkeleton } from "../states/AddressSkeleton";
import { MapPin } from "lucide-react";
import { ErrorFallback } from "../states/ErrorFallback";
import { EmptyAddressState } from "../states/EmptyAddressState";

export function AddressSection({ onChange }: { onChange: () => void }) {
  const {
    data: defaultAddress,
    isLoading,
    refetch,
    error,
  } = useUserDefaultAddress();
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Delivery Address
        </h2>
        <button
          onClick={onChange}
          className="cursor-pointer border rounded-2xl px-3 hover:bg-gray-300 py-1"
        >
          Change
        </button>
      </div>
      {isLoading ? (
        <AddressSkeleton />
      ) : error ? (
        <ErrorFallback message="Failed to load addresses" onRetry={refetch} />
      ) : !defaultAddress || Object.keys(defaultAddress.data).length === 0 ? (
        <EmptyAddressState />
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-card-foreground">
                  {defaultAddress.data.first_name}{" "}
                  {defaultAddress.data.last_name}
                </span>
                {defaultAddress.data.is_default && (
                  <span className="rounded bg-selection/10 px-1.5 py-0.5 text-xs font-medium text-selection">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {defaultAddress.data.phone}
              </p>
              <p className="mt-1 text-sm text-card-foreground">
                {defaultAddress.data.city.name}{" "}
                {defaultAddress.data.country.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
