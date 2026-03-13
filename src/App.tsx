import { useMemo, useState } from 'react';
import symbolsData from './data/symbols.json';
import featuredData from './data/featured.v1.json';
import { CategoryFilters } from './components/CategoryFilters';
import { DetailDrawer } from './components/DetailDrawer';
import { SearchBar } from './components/SearchBar';
import { SymbolGrid } from './components/SymbolGrid';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import type { CategoryOption, SymbolEntry } from './types';
import { copyText } from './utils/clipboard';

const symbols = symbolsData as SymbolEntry[];
const featuredIds = new Set((featuredData as { featuredIds: string[] }).featuredIds);
const RECENT_STORAGE_KEY = 'unicode-map:recent-symbols';
const RECENT_LIMIT = 24;

const symbolById = new Map(symbols.map((symbol) => [symbol.id, symbol]));

const categoryOptions: CategoryOption[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'all', label: 'All' },
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

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function matches(entry: SymbolEntry, query: string): boolean {
  if (!query) return true;
  const category = entry.primaryCategory ?? entry.category;
  const haystack = [
    entry.char,
    entry.name,
    entry.codepoints.join(' '),
    category,
    entry.searchKeywords.join(' '),
    entry.tags.join(' '),
    entry.contextualNote ?? '',
    entry.note ?? ''
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

function readRecentSymbolIds(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

function writeRecentSymbolIds(ids: string[]): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(ids));
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption['id']>('featured');
  const [selected, setSelected] = useState<SymbolEntry | undefined>();
  const [copiedId, setCopiedId] = useState<string>();
  const [recentSymbolIds, setRecentSymbolIds] = useState<string[]>(() => readRecentSymbolIds());

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

  const filtered = useMemo(() => {
    const byCategory =
      selectedCategory === 'featured'
        ? featured
        : selectedCategory === 'all'
          ? symbols
          : symbols.filter((entry) => (entry.primaryCategory ?? entry.category) === selectedCategory);

    return byCategory.filter((entry) => matches(entry, query));
  }, [featured, query, selectedCategory]);

  const display = filtered;

  const rememberRecentSymbol = (entry: SymbolEntry) => {
    setRecentSymbolIds((current) => {
      const next = [entry.id, ...current.filter((id) => id !== entry.id)].slice(0, RECENT_LIMIT);
      writeRecentSymbolIds(next);
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
          {shouldShowRecentSection ? (
            <section>
              <h2 className="section-title">Recently Used</h2>
              <SymbolGrid items={recent} onSelect={handleSelect} selectedId={selected?.id} />
            </section>
          ) : null}

          <section>
            <h2 className="section-title">{selectedCategory === 'featured' && !query ? 'Featured' : 'Results'}</h2>
            <SymbolGrid items={display} onSelect={handleSelect} selectedId={selected?.id} />
          </section>
        </div>
        <DetailDrawer selected={selected} copiedId={copiedId} />
      </section>
    </main>
  );
}
