import { useMemo, useState } from 'react';
import symbolsData from './data/symbols.json';
import { CategoryFilters } from './components/CategoryFilters';
import { DetailDrawer } from './components/DetailDrawer';
import { SearchBar } from './components/SearchBar';
import { SymbolGrid } from './components/SymbolGrid';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import type { CategoryOption, SymbolEntry } from './types';
import { copyText } from './utils/clipboard';

const symbols = symbolsData as SymbolEntry[];

const categoryOptions: CategoryOption[] = [
  { id: 'all', label: 'All' },
  { id: 'emoji-smileys', label: 'Smileys' },
  { id: 'emoji-gestures', label: 'Gestures' },
  { id: 'emoji-animals', label: 'Animals' },
  { id: 'emoji-food', label: 'Food' },
  { id: 'emoji-travel', label: 'Travel' },
  { id: 'symbols-math', label: 'Math' },
  { id: 'symbols-currency', label: 'Currency' },
  { id: 'symbols-arrows', label: 'Arrows' },
  { id: 'symbols-technical', label: 'Technical' },
  { id: 'flags', label: 'Flags' },
  { id: 'misc', label: 'Misc' }
];

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function matches(entry: SymbolEntry, query: string): boolean {
  if (!query) return true;
  const haystack = `${entry.char} ${entry.name} ${entry.unicode} ${entry.keywords.join(' ')}`.toLowerCase();
  return haystack.includes(query);
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption['id']>('all');
  const [selected, setSelected] = useState<SymbolEntry | undefined>();
  const [copiedId, setCopiedId] = useState<string>();

  const query = normalize(search);

  const featured = useMemo(
    () => symbols.filter((item) => !item.controversial).slice(0, 12),
    []
  );

  const filtered = useMemo(() => {
    const byCategory =
      selectedCategory === 'all'
        ? symbols
        : symbols.filter((entry) => entry.category === selectedCategory);

    return byCategory.filter((entry) => matches(entry, query));
  }, [query, selectedCategory]);

  const display = query || selectedCategory !== 'all' ? filtered : featured;

  const handleSelect = async (entry: SymbolEntry) => {
    setSelected(entry);
    const copied = await copyText(entry.char);
    if (copied) {
      setCopiedId(entry.id);
      window.setTimeout(() => setCopiedId(undefined), 1200);
    }
  };

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

      {!query && selectedCategory === 'all' ? <h2 className="section-title">Featured</h2> : null}
      <section className="layout">
        <SymbolGrid items={display} onSelect={handleSelect} selectedId={selected?.id} />
        <DetailDrawer selected={selected} copiedId={copiedId} />
      </section>
    </main>
  );
}
