import type { UserAddress } from "@/features/address/types";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { Check, MapPin, Phone, User } from "lucide-react";

interface AddressListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addresses: UserAddress[];
  onSetDefault: (id: number) => void;
  isLoading: boolean;
}

export function AddressListModal({
  open,
  isLoading,
  onOpenChange,
  addresses,
  onSetDefault,
}: AddressListModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Saved Addresses</DialogTitle>
          <DialogDescription>
            Manage your delivery addresses and set a default.
          </DialogDescription>
        </DialogHeader>

        {addresses.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No addresses available.
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <ul className="space-y-3">
              {addresses.map((addr) => (
                <li
                  key={addr.id}
                  className={cn(
                    "rounded-lg border-2 p-4 transition-colors",
                    addr.is_default
                      ? "border-selection bg-selection-light"
                      : "border-border bg-card",
                  )}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="font-semibold text-card-foreground">
                          {addr.first_name} {addr.last_name}
                        </span>
                        {addr.is_default && (
                          <span className="rounded bg-selection/10 px-1.5 py-0.5 text-xs font-medium text-selection">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{addr.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-card-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span>
                          {addr.city.name}, {addr.country.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant={addr.is_default ? "secondary" : "default"}
                    disabled={addr.is_default || isLoading}
                    onClick={() => onSetDefault(addr.id)}
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    {addr.is_default ? (
                      <>
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Default Address
                      </>
                    ) : (
                      "Set as Default"
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
