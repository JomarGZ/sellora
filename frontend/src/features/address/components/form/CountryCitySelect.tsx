import { useEffect, useState } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from "react-hook-form";

import { useCities } from "@/features/location/api/city.queries";
import { useCountries } from "@/features/location/api/country.queries";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useDebouncedCallback } from "use-debounce";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/components/ui/combobox";

type Props<T extends FieldValues> = {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  disabled?: boolean;
};
type Country = {
  label: string;
  value: string;
};

export function CountryCitySelect<T extends FieldValues>({
  control,
  setValue,
  disabled,
}: Props<T>) {
  const [citySearch, setCitySearch] = useState("");
  const selectedCountryId = useWatch({
    control,
    name: "country_id" as Path<T>,
  });
  const cityId = useWatch({
    control,
    name: "city_id" as Path<T>,
  });

  // ← seed the internal state

  const [debouncedCitySearch, setDebouncedCitySearch] = useState("");
  const debounceCitySearch = useDebouncedCallback((value: string) => {
    setDebouncedCitySearch(value);
  }, 400);

  const { data: countriesData, isLoading: isLoadingCountries } = useCountries();

  const { data: citiesData, isLoading: isLoadingCities } = useCities(
    selectedCountryId,
    debouncedCitySearch,
    cityId,
  );

  const countries: Country[] = (countriesData?.data ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const cities = citiesData?.data ?? [];

  const citySearchTrimmed = citySearch.trim();
  const showCityPrompt = !citySearchTrimmed || citySearchTrimmed.length < 2;
  const showNoCities =
    !showCityPrompt && !isLoadingCities && cities.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Country Select */}
      <Controller
        name={"country_id" as Path<T>}
        control={control}
        render={({ field, fieldState }) => {
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required>Country</FieldLabel>
              <Combobox<Country>
                items={countries}
                itemToStringValue={(country) => country.label}
                onValueChange={(country) =>
                  field.onChange(country?.value ?? null)
                }
              >
                <ComboboxInput placeholder="Select a framework" showClear />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />

      {/* City Select */}
      <Controller
        name={"city_id" as Path<T>}
        control={control}
        render={({ field, fieldState }) => {
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required>City</FieldLabel>

              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) =>
                  field.onChange(value ? Number(value) : undefined)
                }
                disabled={disabled || !selectedCountryId}
              >
                <SelectTrigger className="h-12">
                  <SelectValue
                    placeholder={
                      !selectedCountryId
                        ? "Select a country first"
                        : "Select a city"
                    }
                  />
                </SelectTrigger>

                <SelectContent position="popper">
                  <div className="px-2 py-1.5">
                    <Input
                      placeholder="Type to search cities..."
                      value={citySearch}
                      onChange={(e) => {
                        setCitySearch(e.target.value); // updates input immediately
                        debounceCitySearch(e.target.value); // triggers query after 400ms
                      }}
                      className="h-8"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>

                  {showCityPrompt ? (
                    <SelectItem value="prompt" disabled>
                      Type at least 2 characters to search
                    </SelectItem>
                  ) : isLoadingCities ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : showNoCities ? (
                    <SelectItem value="empty" disabled>
                      No cities found
                    </SelectItem>
                  ) : (
                    cities.map((city: { id: number; name: string }) => (
                      <SelectItem key={city.id} value={String(city.id)}>
                        {city.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    </div>
  );
}
