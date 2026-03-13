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

export interface SymbolEntry {
  id: string;
  char: string;
  name: string;
  codepoints: string[];
  category: SymbolCategory;
  tags: string[];
  searchKeywords: string[];
  note?: string;
  featured?: boolean;
  flags?: SymbolFlags;
}

export interface CategoryOption {
  id: 'all' | SymbolCategory;
  label: string;
}
