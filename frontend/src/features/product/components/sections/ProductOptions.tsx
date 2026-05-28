import { cn } from "@/shared/lib/utils";
import type { ProductDetails } from "../../types";
import type { ProductItem } from "@/shared/types";

interface ProductOptionsProps {
  product: ProductDetails;
  items: ProductItem[];
  selectedAttributes: Record<string, string>;
  onAttributeSelect: (attributeName: string, value: string) => void;
}

export function ProductOptions({
  product,
  items,
  selectedAttributes,
  onAttributeSelect,
}: ProductOptionsProps) {
  if (!product.attributes || product.attributes.length === 0) return null;
  const getVariantImage = (colorValue: string) => {
    const variant = items.find((item) =>
      item.attribute_values.some(
        (av) => av.attribute_name === "color" && av.value === colorValue,
      ),
    );

    return variant?.images?.[0]?.url;
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {product.attributes.map((group) => {
        const isColor = group.name.toLowerCase().includes("color");

        return (
          <div key={group.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                {group.name}
              </h3>

              <span className="text-sm text-muted-foreground">
                {selectedAttributes[group.name] ?? "Select an option"}
              </span>
            </div>

            <div
              className={cn(
                "flex flex-wrap gap-3",
                isColor ? "items-center" : "",
              )}
            >
              {group.values.map((val) => {
                const isSelected = selectedAttributes[group.name] === val.value;

                const isAvailable = items.some((item) => {
                  const hasThisValue = item.attribute_values.some(
                    (av) =>
                      av.attribute_name === group.name &&
                      av.value === val.value,
                  );

                  if (!hasThisValue) return false;

                  return (
                    Object.entries(selectedAttributes).every(
                      ([key, selectedVal]) => {
                        if (key === group.name) return true;

                        return item.attribute_values.some(
                          (av) =>
                            av.attribute_name === key &&
                            av.value === selectedVal,
                        );
                      },
                    ) && item.qty_in_stock > 0
                  );
                });

                const exists = items.some((item) =>
                  item.attribute_values.some(
                    (av) =>
                      av.attribute_name === group.name &&
                      av.value === val.value,
                  ),
                );

                if (!exists) return null;

                if (isColor) {
                  const image = getVariantImage(val.value);
                  const hasImageSwatch = !!image;

                  const hasHex = !!val.hex_color;

                  const hex = val.hex_color ?? "#e5e7eb";

                  return (
                    <button
                      key={val.id}
                      disabled={!isAvailable && !isSelected}
                      onClick={() => onAttributeSelect(group.name, val.value)}
                      title={`${val.label}${!isAvailable ? " (Out of Stock)" : ""}`}
                      className={cn(
                        "relative flex items-center cursor-pointer gap-2 rounded-xl border p-2 transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isSelected
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border hover:border-primary/40",
                        !isAvailable &&
                          !isSelected &&
                          "opacity-40 cursor-not-allowed",
                      )}
                    >
                      {hasImageSwatch ? (
                        <>
                          <img
                            src={image}
                            alt={val.label}
                            className="h-12 w-12 rounded-lg border object-cover"
                          />

                          <span className="text-sm font-medium">
                            {val.label}
                          </span>
                        </>
                      ) : hasHex ? (
                        <>
                          <span
                            className="h-8 w-8 rounded-full border border-black/10 shadow-inner"
                            style={{
                              backgroundColor: hex,
                            }}
                          />

                          <span className="text-sm font-medium">
                            {val.label}
                          </span>
                        </>
                      ) : (
                        <span className="rounded-md bg-muted px-3 py-1 text-sm font-medium">
                          {val.value}
                        </span>
                      )}

                      {!isAvailable && (
                        <div className="absolute inset-0 flex rotate-45 items-center justify-center">
                          <div className="h-px w-full bg-red-500/80" />
                        </div>
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={val.id}
                    onClick={() => onAttributeSelect(group.name, val.value)}
                    disabled={!isAvailable && !isSelected}
                    className={cn(
                      "min-w-12 cursor-pointer uppercase rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted",
                      !isAvailable &&
                        !isSelected &&
                        "cursor-not-allowed bg-muted/50 opacity-40",
                    )}
                  >
                    {val.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
