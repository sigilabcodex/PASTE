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
  | 'flags'
  | 'political-ideological'
  | 'religious-spiritual'
  | 'misc';

export interface SymbolFlags {
  sensitive?: boolean;
  contextual?: boolean;
}

export interface SymbolEntry {
  id: string;
  char: string;
  name: string;
  keywords: string[];
  category: SymbolCategory;
  tags?: string[];
  flags?: SymbolFlags;
  unicode: string;
  version?: string;
  contextNote?: string;
  description?: string;
}

export interface CategoryOption {
  id: 'all' | SymbolCategory;
  label: string;
}
