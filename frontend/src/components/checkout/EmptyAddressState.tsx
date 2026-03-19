import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyAddressState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <MapPin className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="mt-3 font-medium text-card-foreground">No address found</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a delivery address to continue
      </p>
      <Button
        variant="outline"
        className="mt-4 border-selection text-selection hover:bg-selection-light"
      >
        Add Address
      </Button>
    </div>
  );
}
