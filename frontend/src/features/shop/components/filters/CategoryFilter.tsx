import type { Category } from "../../types";

interface CategoryFilterProps {
  categories: Category[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  function toggle(cat: string) {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Category</h3>
      <ul className="space-y-1.5">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(cat.slug)}
                onChange={() => toggle(cat.slug)}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
