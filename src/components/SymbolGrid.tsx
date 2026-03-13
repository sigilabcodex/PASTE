import type { SymbolEntry } from '../types';

interface SymbolGridProps {
  items: SymbolEntry[];
  onSelect: (entry: SymbolEntry) => void;
  onToggleFavorite: (entry: SymbolEntry) => void;
  favoriteIds: Set<string>;
  selectedId?: string;
}

export function SymbolGrid({
  items,
  onSelect,
  onToggleFavorite,
  favoriteIds,
  selectedId
}: SymbolGridProps) {
  if (items.length === 0) {
    return <p className="empty-state">No matches. Try broader keywords.</p>;
  }

  return (
    <div className="symbol-grid" aria-live="polite">
      {items.map((item) => {
        const isFavorite = favoriteIds.has(item.id);

        return (
          <article
            key={item.id}
            className={`symbol-card ${selectedId === item.id ? 'symbol-card--selected' : ''}`}
          >
            <button className="symbol-card__main" onClick={() => onSelect(item)} title={`Copy ${item.name}`}>
              <span className="symbol-card__char">{item.char}</span>
              <span className="symbol-card__name">{item.name}</span>
            </button>
            <button
              className={`favorite-toggle ${isFavorite ? 'favorite-toggle--active' : ''}`}
              onClick={() => onToggleFavorite(item)}
              title={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
              aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
              aria-pressed={isFavorite}
            >
              ★
            </button>
          </article>
        );
      })}
    </div>
  );
}
