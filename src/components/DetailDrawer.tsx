import type { SymbolEntry } from '../types';

interface DetailDrawerProps {
  selected?: SymbolEntry;
  copiedId?: string;
}

export function DetailDrawer({ selected, copiedId }: DetailDrawerProps) {
  if (!selected) {
    return (
      <aside className="detail-panel">
        <p>Select any symbol to preview details and copy instantly.</p>
      </aside>
    );
  }

  return (
    <aside className="detail-panel">
      <div className="detail-panel__char">{selected.char}</div>
      <h2>{selected.name}</h2>
      <p className="muted">{selected.description ?? 'No description available.'}</p>
      <dl>
        <dt>Unicode</dt>
        <dd>{selected.unicode}</dd>
        <dt>Category</dt>
        <dd>{selected.category}</dd>
        {selected.version ? (
          <>
            <dt>Version</dt>
            <dd>{selected.version}</dd>
          </>
        ) : null}
      </dl>
      <p className="copy-status">{copiedId === selected.id ? 'Copied ✓' : 'Tap or click card to copy.'}</p>
    </aside>
  );
}
