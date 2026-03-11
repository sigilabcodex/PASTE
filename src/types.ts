export type SymbolCategory =
  | 'emoji-smileys'
  | 'emoji-gestures'
  | 'emoji-animals'
  | 'emoji-food'
  | 'emoji-travel'
  | 'symbols-math'
  | 'symbols-currency'
  | 'symbols-arrows'
  | 'symbols-technical'
  | 'symbols-punctuation'
  | 'flags'
  | 'misc';

export interface SymbolEntry {
  id: string;
  char: string;
  name: string;
  keywords: string[];
  category: SymbolCategory;
  unicode: string;
  version?: string;
  controversial?: boolean;
  description?: string;
}

export interface CategoryOption {
  id: 'all' | SymbolCategory;
  label: string;
}
