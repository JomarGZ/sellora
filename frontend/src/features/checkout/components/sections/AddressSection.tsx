import type { Address } from "@/types/checkout";
import { AddressCard } from "../ui/AddressCard";
import { AddressSkeleton } from "../states/AddressSkeleton";
import { EmptyAddressState } from "../states/EmptyAddressState";
import { ErrorFallback } from "../states/ErrorFallback";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";

interface AddressSectionProps {
  addresses: Address[];
  loading: boolean;
  error: Error | null;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onRetry: () => void;
}

export function AddressSection({
  addresses,
  loading,
  error,
  selectedId,
  onSelect,
  onDelete,
  onRetry,
}: AddressSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Delivery Address
        </h2>
        {addresses.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-selection hover:text-selection"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Address
          </Button>
        )}
      </div>

      {loading ? (
        <AddressSkeleton />
      ) : error ? (
        <ErrorFallback message="Failed to load addresses" onRetry={onRetry} />
      ) : addresses.length === 0 ? (
        <EmptyAddressState />
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              selected={selectedId === addr.id}
              onSelect={() => onSelect(addr.id)}
              onDelete={() => onDelete(addr.id)}
              canDelete={!(addr.is_default && addresses.length === 1)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
