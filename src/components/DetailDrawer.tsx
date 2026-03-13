import { useMemo, useState } from 'react';
import type { SymbolEntry } from '../types';
import { copyText } from '../utils/clipboard';
import { getEmojiVariantMetadata } from '../utils/emojiSkinTone';

interface DetailDrawerProps {
  selected?: SymbolEntry;
  copiedId?: string;
  favoriteIds: Set<string>;
  onToggleFavorite: (entry: SymbolEntry) => void;
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


const curatedSetLabel: Record<string, string> = {
  'author-signal-pack': 'Author Signal Pack',
  'based-codex-pack': 'Based Codex'
};

export function DetailDrawer({ selected, copiedId, favoriteIds, onToggleFavorite }: DetailDrawerProps) {
  const [copiedVariant, setCopiedVariant] = useState<string>();

  const statusText = useMemo(() => {
    if (!selected) return 'Select any symbol to preview details and copy instantly.';
    if (copiedVariant) return 'Variant copied ✓';
    return copiedId === selected.id ? 'Copied ✓' : 'Tap or click a card to copy.';
  }, [selected, copiedId, copiedVariant]);

  const activeCategory = selected ? selected.primaryCategory ?? selected.category : undefined;
  const variants = selected ? getEmojiVariantMetadata(selected) : undefined;

  const handleCopyVariant = async (variant: string) => {
    const copied = await copyText(variant);
    if (copied) {
      setCopiedVariant(variant);
      window.setTimeout(() => setCopiedVariant(undefined), 1200);
    }
  };

  return (
    <aside className="detail-panel" aria-live="polite">
      <details className="detail-panel__mobile" open>
        <summary>Details</summary>
        {!selected ? (
          <p>{statusText}</p>
        ) : (
          <div className="detail-panel__body">
            <div className="detail-panel__header">
              <div className="detail-panel__char">{selected.char}</div>
              <button
                className={`favorite-toggle ${favoriteIds.has(selected.id) ? 'favorite-toggle--active' : ''}`}
                onClick={() => onToggleFavorite(selected)}
                aria-label={favoriteIds.has(selected.id) ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={favoriteIds.has(selected.id)}
                title={favoriteIds.has(selected.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                ★
              </button>
            </div>
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
              {selected.curatedSets?.length ? (
                <>
                  <dt>Curated Packs</dt>
                  <dd>{selected.curatedSets.map((setId) => curatedSetLabel[setId] ?? setId).join(', ')}</dd>
                </>
              ) : null}
              {selected.knowledge?.description ? (
                <>
                  <dt>Description</dt>
                  <dd>{selected.knowledge.description}</dd>
                </>
              ) : null}
              {selected.knowledge?.history ? (
                <>
                  <dt>History</dt>
                  <dd>{selected.knowledge.history}</dd>
                </>
              ) : null}
              {selected.knowledge?.culturalContext || selected.contextualNote || selected.note ? (
                <>
                  <dt>Context</dt>
                  <dd>{selected.knowledge?.culturalContext ?? selected.contextualNote ?? selected.note}</dd>
                </>
              ) : null}
              {selected.knowledge?.notes ? (
                <>
                  <dt>Notes</dt>
                  <dd>{selected.knowledge.notes}</dd>
                </>
              ) : null}
              {selected.knowledge?.sourceLabels?.length ? (
                <>
                  <dt>Sources</dt>
                  <dd>{selected.knowledge.sourceLabels.join(', ')}</dd>
                </>
              ) : null}
            </dl>
            {variants?.supportsSkinTone && variants.generatedVariants.length > 0 ? (
              <div className="emoji-variants" aria-label="Skin tone variants">
                <p className="emoji-variants__label">Variants</p>
                <div className="emoji-variants__list">
                  {variants.generatedVariants.map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      className="emoji-variant"
                      onClick={() => handleCopyVariant(variant)}
                      title="Copy variant"
                      aria-label={`Copy ${selected.name} variant ${variant}`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {selected.knowledge?.externalLinks?.length ? (
              <div className="detail-links">
                <p className="detail-links__label">Read more</p>
                <ul>
                  {selected.knowledge.externalLinks.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="copy-status">{statusText}</p>
          </div>
        )}
      </details>
    </aside>
  );
}
