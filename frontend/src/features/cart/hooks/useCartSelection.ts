// features/cart/hooks/useCartSelection.ts
import { useState, useCallback } from "react";

export function useCartSelection(initialIds: number[] = []) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(
    () => new Set(initialIds),
  );

  const selectItem = useCallback((id: number, checked: boolean) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: number[]) => {
    setSelectedItems((prev) => new Set([...prev, ...ids]));
  }, []);

  const deselectAll = useCallback((ids: number[]) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const isSelected = useCallback(
    (id: number) => selectedItems.has(id),
    [selectedItems],
  );

  const selectedCount = selectedItems.size;
  const selectedArray = [...selectedItems];

  return {
    selectedItems,
    selectedArray,
    selectedCount,
    isSelected,
    selectItem,
    selectAll,
    deselectAll,
  };
}
