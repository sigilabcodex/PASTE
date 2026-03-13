import { useMemo } from 'react';
import type { SymbolEntry } from '../types';

interface DetailDrawerProps {
  selected?: SymbolEntry;
  copiedId?: string;
}

const categoryLabel: Record<SymbolEntry['category'], string> = {
  'emoji-smileys': 'Smileys',
  'emoji-gestures': 'Gestures',
  'emoji-animals': 'Animals',
  'emoji-food': 'Food',
  'emoji-travel': 'Travel',
  'symbols-math': 'Math',
  'symbols-currency': 'Currency',
  'symbols-arrows': 'Arrows',
  'symbols-technical': 'Technical',
  flags: 'Flags',
  'political-ideological': 'Political / Ideological',
  'religious-spiritual': 'Religious / Spiritual',
  misc: 'Misc'
};

export function DetailDrawer({ selected, copiedId }: DetailDrawerProps) {
  const statusText = useMemo(() => {
    if (!selected) return 'Select any symbol to preview details and copy instantly.';
    return copiedId === selected.id ? 'Copied ✓' : 'Tap or click a card to copy.';
  }, [selected, copiedId]);

  return (
    <aside className="detail-panel" aria-live="polite">
      <details className="detail-panel__mobile" open>
        <summary>Details</summary>
        {!selected ? (
          <p>{statusText}</p>
        ) : (
          <div className="detail-panel__body">
            <div className="detail-panel__char">{selected.char}</div>
            <h2>{selected.name}</h2>
            <dl>
              <dt>Unicode</dt>
              <dd>{selected.unicode}</dd>
              <dt>Category</dt>
              <dd>{categoryLabel[selected.category]}</dd>
              {selected.tags?.length ? (
                <>
                  <dt>Tags</dt>
                  <dd>{selected.tags.join(', ')}</dd>
                </>
              ) : null}
              {selected.contextNote ? (
                <>
                  <dt>Context</dt>
                  <dd>{selected.contextNote}</dd>
                </>
              ) : null}
            </dl>
            <p className="copy-status">{statusText}</p>
          </div>
        )}
      </details>
    </aside>
  );
}
