// In your AddressFormModal, replace the city Controller with this:

import { useCities } from "@/features/location/api/city.queries";
import { Input } from "@/shared/components/ui/input";
import { MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Add this new component above AddressFormModal:
interface CityComboboxProps {
  value: string;
  onChange: (value: string) => void;
  countryId?: string;
  disabled?: boolean;
  invalid?: boolean;
}

export function CityComboBox({
  value,
  onChange,
  countryId,
  disabled,
  invalid,
}: CityComboboxProps) {
  const [search, setCitySearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: citiesData, isLoading: isLoadingCities } = useCities(
    countryId ? Number(countryId) : undefined,
    search,
  );
  const cities = citiesData?.data ?? [];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset when country changes
  useEffect(() => {
    setCitySearch("");
    setSelectedLabel("");
    onChange("");
  }, [countryId]);

  const handleSelect = (cityId: string, cityName: string) => {
    onChange(cityId);
    setSelectedLabel(cityName);
    setCitySearch(cityName);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        className="h-12 pl-10"
        placeholder={
          !countryId ? "Select a country first" : "Type to search city..."
        }
        value={search}
        disabled={disabled || !countryId}
        data-invalid={invalid}
        onChange={(e) => {
          setCitySearch(e.target.value);
          setOpen(true);
          // Clear selected value if user edits the text
          if (value && e.target.value !== selectedLabel) {
            onChange("");
          }
        }}
        onFocus={() => search.length >= 2 && setOpen(true)}
      />
      {open && search.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-y-auto">
          {isLoadingCities ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Searching...
            </div>
          ) : cities.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No cities found
            </div>
          ) : (
            cities.map((city: { id: number; name: string }) => (
              <button
                key={city.id}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => handleSelect(String(city.id), city.name)}
              >
                {city.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
