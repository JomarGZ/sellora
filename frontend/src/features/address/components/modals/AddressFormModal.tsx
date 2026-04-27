import { useForm, Controller, useWatch } from "react-hook-form";
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

import { useCreateUserAddress } from "../../api/address.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  type AddressFormInput,
} from "../../validation/address.schema";
import { useCountries } from "@/features/location/api/country.queries";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CityComboBox } from "../sections/CityComboBox";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressId?: number | null;
}

const AddressFormModal = ({ isOpen, onClose }: AddressFormModalProps) => {
  const { mutate: createAddress, isPending } = useCreateUserAddress();
  const [countrySearch, setCountrySearch] = useState("");

  const form = useForm<AddressFormInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      country_id: "",
      city_id: "",
      street_address: "",
      is_default: false,
    },
  });

  const selectedCountryId = useWatch({
    control: form.control,
    name: "country_id",
  });

  const { data: countriesData, isLoading: isLoadingCountries } =
    useCountries(countrySearch);

  const countries = countriesData?.data ?? [];

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

            {/* Country */}
            <Controller
              name="country_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Country</FieldLabel>
                  <Select
                    value={field.value as string}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("city_id", "");
                    }}
                    disabled={isPending || isLoadingCountries}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5">
                        <Input
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="h-8"
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>

                      {isLoadingCountries ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : countries.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No countries found
                        </SelectItem>
                      ) : (
                        countries.map(
                          (country: { id: number; name: string }) => (
                            <SelectItem
                              key={country.id}
                              value={String(country.id)}
                            >
                              {country.name}
                            </SelectItem>
                          ),
                        )
                      )}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* City */}
            <Controller
              name="city_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>City</FieldLabel>
                  <CityComboBox
                    value={field.value as string}
                    onChange={field.onChange}
                    countryId={selectedCountryId as string}
                    disabled={isPending}
                    invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
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
