import { useState } from "react";
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
type ComboboxProp = {
  label: string;
  value: string;
};

interface Country extends ComboboxProp {}
interface City extends ComboboxProp {}

export function CountryCitySelect<T extends FieldValues>({
  control,
  setValue,
  disabled,
}: Props<T>) {
  const selectedCountryId = useWatch({
    control,
    name: "country_id" as Path<T>,
  });
  const cityId = useWatch({
    control,
    name: "city_id" as Path<T>,
  });

  const [debouncedCitySearch, setDebouncedCitySearch] = useState("");
  const debounceCitySearch = useDebouncedCallback((value: string) => {
    if (!value) return;
    console.log("trigger");
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

  const cities: City[] = (citiesData?.data ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Country Select */}
      <Controller
        name={"country_id" as Path<T>}
        control={control}
        render={({ field, fieldState }) => {
          const selectedCountry =
            countries.find((c) => c.value === field.value) ?? null;
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required>Country</FieldLabel>
              <Combobox<Country>
                items={countries}
                value={selectedCountry}
                itemToStringValue={(country) => country.label}
                onValueChange={(country) => {
                  const countryId = country?.value;
                  field.onChange(country?.value ?? null);
                  if (countryId !== selectedCountryId) {
                    setValue("city_id" as Path<T>, undefined as any);
                  }
                }}
              >
                <ComboboxInput placeholder="Select a country" showClear />
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
          const selectedCity =
            cities.find((c) => c.value === field.value) ?? null;
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required>City</FieldLabel>
              <Combobox<City>
                items={cities}
                value={selectedCity}
                disabled={!selectedCountryId}
                itemToStringValue={(city) => city.label}
                onInputValueChange={(value) => {
                  debounceCitySearch(value);
                }}
                onValueChange={(city) => {
                  field.onChange(city?.value ?? null);
                }}
              >
                <ComboboxInput
                  disabled={!selectedCountryId}
                  placeholder="Select a city"
                  showClear
                />
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
    </div>
  );
}
