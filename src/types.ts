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

export type KnowledgeSourceType =
  | 'editorial'
  | 'unicode'
  | 'cldr'
  | 'wikidata'
  | 'dbpedia'
  | 'open-data'
  | 'other';

export interface ExternalLink {
  label: string;
  url: string;
  sourceType?: KnowledgeSourceType;
}

export interface SymbolKnowledge {
  description?: string;
  history?: string;
  culturalContext?: string;
  notes?: string;
  externalLinks?: ExternalLink[];
  sourceLabels?: string[];
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
  knowledge?: SymbolKnowledge;
  featured?: boolean;
  flags?: SymbolFlags;
}

export interface CategoryOption {
  id: 'featured' | 'all' | SymbolCategory;
  label: string;
}
