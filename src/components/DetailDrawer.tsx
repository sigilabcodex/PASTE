import { useMemo } from 'react';
import type { SymbolEntry } from '../types';

interface DetailDrawerProps {
  selected?: SymbolEntry;
  copiedId?: string;
}

const categoryLabel: Record<NonNullable<SymbolEntry['primaryCategory']>, string> = {
  punctuation: 'Punctuation',
  'quotation-marks': 'Quotation Marks',
  arrows: 'Arrows',
  'math-symbols': 'Math Symbols',
  currency: 'Currency',
  'check-marks': 'Check Marks',
  crosses: 'Crosses',
  stars: 'Stars',
  'geometric-shapes': 'Geometric Shapes',
  'box-drawing': 'Box Drawing',
  'technical-computing': 'Technical / Computing',
  'whitespace-invisible': 'Whitespace / Invisible',
  'emoji-smileys': 'Emoji: Smileys',
  'emoji-people': 'Emoji: People',
  'emoji-nature': 'Emoji: Nature',
  'emoji-food': 'Emoji: Food',
  'emoji-travel': 'Emoji: Travel',
  'emoji-objects': 'Emoji: Objects',
  flags: 'Flags',
  'political-ideological': 'Political / Ideological',
  'religious-spiritual': 'Religious / Spiritual'
};

export function DetailDrawer({ selected, copiedId }: DetailDrawerProps) {
  const statusText = useMemo(() => {
    if (!selected) return 'Select any symbol to preview details and copy instantly.';
    return copiedId === selected.id ? 'Copied ✓' : 'Tap or click a card to copy.';
  }, [selected, copiedId]);

  const activeCategory = selected ? selected.primaryCategory ?? selected.category : undefined;

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
              <dt>Codepoint(s)</dt>
              <dd>{selected.codepoints.join(' ')}</dd>
              <dt>Category</dt>
              <dd>{activeCategory ? categoryLabel[activeCategory] : 'Uncategorized'}</dd>
              {!!selected.tags.length && (
                <>
                  <dt>Tags</dt>
                  <dd>{selected.tags.join(', ')}</dd>
                </>
              )}
              {selected.contextualNote || selected.note ? (
                <>
                  <dt>Note</dt>
                  <dd>{selected.contextualNote ?? selected.note}</dd>
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
