import { useForm, Controller } from "react-hook-form";
import { MapPin, Phone, User, UserCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";

import {
  useCreateUserAddress,
  useUserAddress,
} from "../../api/address.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  type AddressFormInput,
} from "../../validation/address.schema";
import { useEffect } from "react";

import { CountryCitySelect } from "../form/CountryCitySelect";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressId?: number | null;
}

const AddressFormModal = ({
  isOpen,
  onClose,
  addressId,
}: AddressFormModalProps) => {
  const { mutate: createAddress, isPending } = useCreateUserAddress();
  const isEditMode = !!addressId;
  const { data: addressData } = useUserAddress(
    addressId!, // non-null since enabled guards it
    { enabled: isEditMode && isOpen },
  );

  const address = addressData?.data;
  const form = useForm<AddressFormInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      country_id: "",
      city_id: "",
      street_address: "",
    },
  });

  useEffect(() => {
    if (address) {
      form.reset({
        first_name: address.first_name,
        last_name: address.last_name,
        phone: address.phone,
        country_id: address.country_id,
        city_id: address.city_id,
        street_address: address.street_address,
      });
    }
  }, [address, form]);

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        first_name: "",
        last_name: "",
        phone: "",
        country_id: "",
        city_id: "",
        street_address: "",
      });
    }
  }, [isOpen, form]);

  const handleSubmit = (data: AddressFormInput) => {
    const parsed = addressSchema.parse(data);
    createAddress(parsed, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Address</DialogTitle>
          <DialogDescription>
            Share your experience with this product.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <Controller
              name="first_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>First name</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      className="h-12 pl-10"
                      placeholder="John"
                      disabled={isPending}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Last Name */}
            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Last name</FieldLabel>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      className="h-12 pl-10"
                      placeholder="Doe"
                      disabled={isPending}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Phone */}
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Phone</FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      className="h-12 pl-10"
                      placeholder="09xxxxxxxxx"
                      disabled={isPending}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <CountryCitySelect
              control={form.control}
              setValue={form.setValue}
              disabled={isPending}
            />

            {/* Street Address (FULL WIDTH) */}
            <div className="md:col-span-2">
              <Controller
                name="street_address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Street address</FieldLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        className="h-12 pl-10"
                        placeholder="Street, building, etc."
                        disabled={isPending}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full cursor-pointer disabled:opacity-70"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export { AddressFormModal };
