import { useMemo, useState } from 'react';
import symbolsData from './data/symbols.json';
import featuredData from './data/featured.v1.json';
import { CategoryFilters } from './components/CategoryFilters';
import { DetailDrawer } from './components/DetailDrawer';
import { SearchBar } from './components/SearchBar';
import { SymbolGrid } from './components/SymbolGrid';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import type { CategoryFilterId, CategoryOption, CuratedSetId, SymbolEntry } from './types';
import { copyText } from './utils/clipboard';

const symbols = symbolsData as SymbolEntry[];
const featuredIds = new Set((featuredData as { featuredIds: string[] }).featuredIds);
const RECENT_STORAGE_KEY = 'unicode-map:recent-symbols';
const FAVORITES_STORAGE_KEY = 'unicode-map:favorites';
const RECENT_LIMIT = 24;

const symbolById = new Map(symbols.map((symbol) => [symbol.id, symbol]));

const categoryOptions: CategoryOption[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'all', label: 'All' },
  { id: 'curated:based-codex-pack', label: 'Based Codex' },
  { id: 'punctuation', label: 'Punctuation' },
  { id: 'quotation-marks', label: 'Quotation Marks' },
  { id: 'arrows', label: 'Arrows' },
  { id: 'math-symbols', label: 'Math Symbols' },
  { id: 'currency', label: 'Currency' },
  { id: 'check-marks', label: 'Check Marks' },
  { id: 'crosses', label: 'Crosses' },
  { id: 'stars', label: 'Stars' },
  { id: 'geometric-shapes', label: 'Geometric Shapes' },
  { id: 'box-drawing', label: 'Box Drawing' },
  { id: 'technical-computing', label: 'Technical / Computing' },
  { id: 'whitespace-invisible', label: 'Whitespace / Invisible' },
  { id: 'emoji-smileys', label: 'Emoji: Smileys' },
  { id: 'emoji-people', label: 'Emoji: People' },
  { id: 'emoji-nature', label: 'Emoji: Nature' },
  { id: 'emoji-food', label: 'Emoji: Food' },
  { id: 'emoji-travel', label: 'Emoji: Travel' },
  { id: 'emoji-objects', label: 'Emoji: Objects' },
  { id: 'flags', label: 'Flags' },
  { id: 'political-ideological', label: 'Political / Ideological' },
  { id: 'religious-spiritual', label: 'Religious / Spiritual' }
];


function getCuratedSetId(categoryId: CategoryFilterId): CuratedSetId | undefined {
  if (!categoryId.startsWith('curated:')) return undefined;
  return categoryId.slice('curated:'.length) as CuratedSetId;
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function normalizeCodepoint(value: string): string {
  return value.toLowerCase().replace(/[^a-f0-9]/g, '');
}

function scoreMatch(entry: SymbolEntry, query: string): number {
  if (!query) return 0;

  const normalizedName = normalize(entry.name);
  const aliases = (entry.aliases ?? []).map(normalize);
  const tags = entry.tags.map(normalize);
  const keywords = entry.searchKeywords.map(normalize);
  const codepoints = entry.codepoints.map((point) => point.toLowerCase());
  const normalizedCodepoints = codepoints.map(normalizeCodepoint);
  const normalizedQueryCodepoint = normalizeCodepoint(query);

  if (entry.char === query) return 1000;
  if (normalizedName === query) return 950;
  if (aliases.includes(query)) return 900;
  if (tags.includes(query)) return 850;
  if (keywords.includes(query)) return 800;
  if (codepoints.includes(query)) return 780;
  if (normalizedQueryCodepoint && normalizedCodepoints.includes(normalizedQueryCodepoint)) return 760;

  const category = entry.primaryCategory ?? entry.category;
  const links = entry.knowledge?.externalLinks?.map((item) => `${item.label} ${item.sourceType ?? ''}`).join(' ') ?? '';
  const haystack = [
    normalizedName,
    aliases.join(' '),
    codepoints.join(' '),
    normalizedCodepoints.join(' '),
    category,
    keywords.join(' '),
    tags.join(' '),
    entry.contextualNote ?? '',
    entry.note ?? '',
    entry.knowledge?.description ?? '',
    entry.knowledge?.history ?? '',
    entry.knowledge?.culturalContext ?? '',
    entry.knowledge?.notes ?? '',
    entry.knowledge?.sourceLabels?.join(' ') ?? '',
    links
  ]
    .join(' ')
    .toLowerCase();

  if (normalizedName.startsWith(query)) return 720;
  if (aliases.some((alias) => alias.startsWith(query))) return 700;
  if (keywords.some((keyword) => keyword.startsWith(query))) return 680;
  if (tags.some((tag) => tag.startsWith(query))) return 660;
  if (haystack.includes(query)) return 620;

  const queryTokens = query.split(/\s+/).filter(Boolean);
  if (!queryTokens.length) return 0;

  const tokenMatches = queryTokens.filter((token) => haystack.includes(token)).length;
  if (tokenMatches === queryTokens.length) return 580;
  if (tokenMatches > 0) return 540;

  return 0;
}

function readStoredSymbolIds(key: string): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

function writeStoredSymbolIds(key: string, ids: string[]): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(key, JSON.stringify(ids));
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption['id']>('featured');
  const [selected, setSelected] = useState<SymbolEntry | undefined>();
  const [copiedId, setCopiedId] = useState<string>();
  const [recentSymbolIds, setRecentSymbolIds] = useState<string[]>(() => readStoredSymbolIds(RECENT_STORAGE_KEY));
  const [favoriteSymbolIds, setFavoriteSymbolIds] = useState<string[]>(() =>
    readStoredSymbolIds(FAVORITES_STORAGE_KEY)
  );

  const query = normalize(search);

  const featured = useMemo(
    () => symbols.filter((item) => featuredIds.has(item.id) || item.featured).slice(0, 24),
    []
  );

  const recent = useMemo(
    () =>
      recentSymbolIds
        .map((id) => symbolById.get(id))
        .filter((entry): entry is SymbolEntry => Boolean(entry)),
    [recentSymbolIds]
  );

  const favorites = useMemo(
    () =>
      favoriteSymbolIds
        .map((id) => symbolById.get(id))
        .filter((entry): entry is SymbolEntry => Boolean(entry)),
    [favoriteSymbolIds]
  );

  const filtered = useMemo(() => {
    const curatedSetId = getCuratedSetId(selectedCategory);
    const byCategory = curatedSetId
      ? symbols.filter((entry) => entry.curatedSets?.includes(curatedSetId))
      : selectedCategory === 'featured'
        ? query
          ? symbols
          : featured
        : selectedCategory === 'all'
          ? symbols
          : symbols.filter((entry) => (entry.primaryCategory ?? entry.category) === selectedCategory);

    if (!query) return byCategory;

    return byCategory
      .map((entry) => ({ entry, score: scoreMatch(entry, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
      .map((item) => item.entry);
  }, [featured, query, selectedCategory]);

  const favoriteIdSet = useMemo(() => new Set(favoriteSymbolIds), [favoriteSymbolIds]);

  const rememberRecentSymbol = (entry: SymbolEntry) => {
    setRecentSymbolIds((current) => {
      const next = [entry.id, ...current.filter((id) => id !== entry.id)].slice(0, RECENT_LIMIT);
      writeStoredSymbolIds(RECENT_STORAGE_KEY, next);
      return next;
    });
  };

  const handleToggleFavorite = (entry: SymbolEntry) => {
    setFavoriteSymbolIds((current) => {
      const isFavorite = current.includes(entry.id);
      const next = isFavorite ? current.filter((id) => id !== entry.id) : [entry.id, ...current.filter((id) => id !== entry.id)];
      writeStoredSymbolIds(FAVORITES_STORAGE_KEY, next);
      return next;
    });
  };

  const handleSelect = async (entry: SymbolEntry) => {
    setSelected(entry);
    const copied = await copyText(entry.char);
    if (copied) {
      rememberRecentSymbol(entry);
      setCopiedId(entry.id);
      window.setTimeout(() => setCopiedId(undefined), 1200);
    }
  };

  const shouldShowRecentSection = selectedCategory === 'featured' && !query && recent.length > 0;
  const shouldShowFavoritesSection = selectedCategory === 'featured' && !query && favorites.length > 0;

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>Unicode & Emoji Map</h1>
          <p>Tap any symbol to copy instantly.</p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilters
        options={categoryOptions}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      <section className="layout">
        <div className="content-stack">
          {shouldShowFavoritesSection ? (
            <section>
              <h2 className="section-title">Favorites</h2>
              <SymbolGrid
                items={favorites}
                onSelect={handleSelect}
                onToggleFavorite={handleToggleFavorite}
                favoriteIds={favoriteIdSet}
                selectedId={selected?.id}
              />
            </section>
          ) : null}

          {shouldShowRecentSection ? (
            <section>
              <h2 className="section-title">Recently Used</h2>
              <SymbolGrid
                items={recent}
                onSelect={handleSelect}
                onToggleFavorite={handleToggleFavorite}
                favoriteIds={favoriteIdSet}
                selectedId={selected?.id}
              />
            </section>
          ) : null}

          <section>
            <h2 className="section-title">{selectedCategory === 'featured' && !query ? 'Featured' : 'Results'}</h2>
            <SymbolGrid
              items={filtered}
              onSelect={handleSelect}
              onToggleFavorite={handleToggleFavorite}
              favoriteIds={favoriteIdSet}
              selectedId={selected?.id}
            />
          </section>
        </div>
        <DetailDrawer
          selected={selected}
          copiedId={copiedId}
          favoriteIds={favoriteIdSet}
          onToggleFavorite={handleToggleFavorite}
        />
      </section>
    </main>
  );
}
