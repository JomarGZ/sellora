import { create } from "zustand";

interface CartSelectionStore {
  selectedIds: Set<number>;

  selectItem: (id: number, checked: boolean) => void;

  isSelected: (id: number) => boolean;

  clear: () => void;

  toggleAll: (ids: number[], checked: boolean) => void;
}

export const useCartSelection = create<CartSelectionStore>((set, get) => ({
  selectedIds: new Set(),

  selectItem: (id, checked) => {
    set((state) => {
      const next = new Set(state.selectedIds);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return { selectedIds: next };
    });
  },

  isSelected: (id) => {
    return get().selectedIds.has(id);
  },

  clear: () => {
    set({ selectedIds: new Set() });
  },

  toggleAll: (ids, checked) => {
    set((state) => {
      const next = new Set(state.selectedIds);

      if (checked) {
        ids.forEach((id) => next.add(id));
      } else {
        ids.forEach((id) => next.delete(id));
      }

      return { selectedIds: next };
    });
  },
}));
