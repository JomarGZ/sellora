import Skeleton from "react-loading-skeleton";
import { MapPin, Plus, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  useAddresses,
  useDeleteAddress,
} from "@/features/account/api/account.queries";

export function AddressSection() {
  const { data: addresses, isLoading } = useAddresses();
  const deleteMutation = useDeleteAddress();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        // toast({ title: "Address deleted successfully" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-card p-6 rounded-2xl border border-border/50"
          >
            <Skeleton height={24} width={100} className="mb-4" />
            <Skeleton count={3} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-display font-bold text-foreground">
          Saved Addresses
        </h3>
        <Button className="rounded-xl shadow-sm hover-elevate">
          <Plus className="w-4 h-4 mr-2" /> Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {addresses?.map((address) => (
          <div
            key={address.id}
            className="bg-white dark:bg-card relative p-6 rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-all group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-foreground">
                  {address.label}
                </h4>
                {address.isDefault && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none"
                  >
                    Default
                  </Badge>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg">
                    <Edit2 className="w-4 h-4" /> Edit
                  </DropdownMenuItem>
                  {!address.isDefault && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg">
                      <MapPin className="w-4 h-4" /> Set as Default
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg"
                    onClick={() => handleDelete(address.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="text-muted-foreground text-sm leading-relaxed flex-1">
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
            </div>
          </div>
        ))}

        {/* Add New Placeholder Card */}
        <button className="border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 rounded-2xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Add New Address</span>
        </button>
      </div>
    </div>
  );
}
