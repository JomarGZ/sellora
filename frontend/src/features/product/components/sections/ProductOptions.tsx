import { cn } from "@/shared/lib/utils";
import type { ProductDetail, ProductItem } from "../../types";

interface ProductOptionsProps {
  product: ProductDetail;
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
                  const hasThisValue = item.attributeValues.some(
                    (av) =>
                      av.attributeName === group.name && av.value === val.value,
                  );
                  if (!hasThisValue) return false;
                  return (
                    Object.entries(selectedAttributes).every(
                      ([key, selectedVal]) => {
                        if (key === group.name) return true;
                        return item.attributeValues.some(
                          (av) =>
                            av.attributeName === key &&
                            av.value === selectedVal,
                        );
                      },
                    ) && item.qtyInStock > 0
                  );
                });

                const exists = items.some((item) =>
                  item.attributeValues.some(
                    (av) =>
                      av.attributeName === group.name && av.value === val.value,
                  ),
                );

                if (!exists) return null;

                if (isColor) {
                  const colorMap: Record<string, string> = {
                    Black: "#111827",
                    White: "#f9fafb",
                    Red: "#ef4444",
                    Blue: "#3b82f6",
                    Green: "#10b981",
                    Navy: "#1e3a8a",
                    Gray: "#6b7280",
                    Silver: "#9ca3af",
                  };
                  const namePart = val.value.split("/")[0].trim();
                  const hex = colorMap[namePart] ?? "#e5e7eb";

                  return (
                    <button
                      key={val.id}
                      onClick={() => onAttributeSelect(group.name, val.value)}
                      title={`${val.value}${!isAvailable ? " (Out of Stock)" : ""}`}
                      className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isSelected
                          ? "ring-2 ring-primary ring-offset-2"
                          : "ring-1 ring-border hover:ring-primary/40",
                        !isAvailable && !isSelected && "opacity-40",
                      )}
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: hex }}
                      />
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center rotate-45">
                          <div className="w-full h-[1px] bg-red-500/80" />
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
                      "min-w-[3rem] px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted",
                      !isAvailable &&
                        !isSelected &&
                        "opacity-40 cursor-not-allowed bg-muted/50",
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
