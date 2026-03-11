import type { CategoryOption } from '../types';

interface CategoryFiltersProps {
  options: CategoryOption[];
  selected: CategoryOption['id'];
  onChange: (category: CategoryOption['id']) => void;
}

export function CategoryFilters({ options, selected, onChange }: CategoryFiltersProps) {
  return (
    <div className="chip-row" role="tablist" aria-label="Symbol categories">
      {options.map((option) => (
        <button
          key={option.id}
          className={`chip ${selected === option.id ? 'chip--active' : ''}`}
          onClick={() => onChange(option.id)}
          role="tab"
          aria-selected={selected === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
