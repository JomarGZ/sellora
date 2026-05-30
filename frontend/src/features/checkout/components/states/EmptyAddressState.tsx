import { MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";

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
      <Link
        to="/account/addresses"
        className="mt-4 border-selection border py-2 px-3 rounded-sm hover:bg-gray-300 text-selection hover:bg-selection-light"
      >
        Add Address
      </Link>
    </div>
  );
}
