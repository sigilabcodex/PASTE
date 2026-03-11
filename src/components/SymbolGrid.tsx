import type { SymbolEntry } from '../types';

interface SymbolGridProps {
  items: SymbolEntry[];
  onSelect: (entry: SymbolEntry) => void;
  selectedId?: string;
}

export function SymbolGrid({ items, onSelect, selectedId }: SymbolGridProps) {
  if (items.length === 0) {
    return <p className="empty-state">No matches. Try broader keywords.</p>;
  }

  return (
    <div className="symbol-grid" aria-live="polite">
      {items.map((item) => (
        <button
          key={item.id}
          className={`symbol-card ${selectedId === item.id ? 'symbol-card--selected' : ''}`}
          onClick={() => onSelect(item)}
          title={`Copy ${item.name}`}
        >
          <span className="symbol-card__char">{item.char}</span>
          <span className="symbol-card__name">{item.name}</span>
        </button>
      ))}
    </div>
  );
}
