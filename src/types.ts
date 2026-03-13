export type SymbolCategory =
  | 'punctuation'
  | 'quotation-marks'
  | 'arrows'
  | 'math-symbols'
  | 'currency'
  | 'check-marks'
  | 'crosses'
  | 'stars'
  | 'geometric-shapes'
  | 'box-drawing'
  | 'technical-computing'
  | 'whitespace-invisible'
  | 'emoji-smileys'
  | 'emoji-people'
  | 'emoji-nature'
  | 'emoji-food'
  | 'emoji-travel'
  | 'emoji-objects'
  | 'flags'
  | 'political-ideological'
  | 'religious-spiritual';

export interface SymbolFlags {
  sensitive?: boolean;
}

export type CuratedSetType = 'featured' | 'author-curated';

export interface CuratedSet {
  id: string;
  type: CuratedSetType;
  name: string;
  description: string;
  symbolIds: string[];
}

export interface CuratedSetsFile {
  version: string;
  sets: CuratedSet[];
}

export interface SymbolEntry {
  id: string;
  char: string;
  name: string;
  codepoints: string[];
  primaryCategory: SymbolCategory;
  category?: SymbolCategory;
  tags: string[];
  searchKeywords: string[];
  curatedSets?: string[];
  contextualNote?: string;
  note?: string;
  featured?: boolean;
  flags?: SymbolFlags;
}

export interface CategoryOption {
  id: 'featured' | 'all' | SymbolCategory | `curated:${string}`;
  label: string;
}
