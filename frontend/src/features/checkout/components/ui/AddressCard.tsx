import { Check, MapPin, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/checkout";

interface AddressCardProps {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

export function AddressCard({
  address,
  selected,
  onSelect,
  onDelete,
  canDelete,
}: AddressCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-lg border-2 p-4 text-left transition-all duration-150",
        selected
          ? "border-selection bg-selection-light"
          : "border-border bg-card hover:border-muted-foreground/30",
      )}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-selection">
          <Check className="h-3 w-3 text-accent-foreground" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-card-foreground">
              {address.full_name}
            </span>
            {address.is_default && (
              <span className="rounded bg-selection/10 px-1.5 py-0.5 text-xs font-medium text-selection">
                Default
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {address.phone}
          </p>
          <p className="mt-1 text-sm text-card-foreground">
            {address.address_line}
          </p>
        </div>
      </div>

      {canDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute bottom-3 right-3 rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
          aria-label="Delete address"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </button>
  );
}
