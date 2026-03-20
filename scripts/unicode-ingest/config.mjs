export const GENERATED_FILES = [
  { id: 'arrows', file: 'arrows.json', schemaCategory: 'arrows', sampleLimit: 24, ranges: [[0x2190, 0x21FF]], tags: ['unicode', 'arrows'] },
  { id: 'math', file: 'math.json', schemaCategory: 'math-symbols', sampleLimit: 24, ranges: [[0x2200, 0x22FF]], tags: ['unicode', 'math'] },
  { id: 'currency', file: 'currency.json', schemaCategory: 'currency', sampleLimit: 0, ranges: [] },
  { id: 'shapes', file: 'shapes.json', schemaCategory: 'geometric-shapes', sampleLimit: 0, ranges: [] },
  { id: 'punctuation', file: 'punctuation.json', schemaCategory: 'punctuation', sampleLimit: 0, ranges: [] },
  { id: 'emoji-core', file: 'emoji-core.json', schemaCategory: 'emoji-objects', sampleLimit: 0, ranges: [] },
  { id: 'latin-extended', file: 'latin-extended.json', schemaCategory: 'technical-computing', sampleLimit: 0, ranges: [] },
  { id: 'greek', file: 'greek.json', schemaCategory: 'technical-computing', sampleLimit: 0, ranges: [] },
  { id: 'cyrillic', file: 'cyrillic.json', schemaCategory: 'technical-computing', sampleLimit: 0, ranges: [] },
];

export const KEYWORD_HINTS = {
  arrows: {
    0x2190: ['left', 'west', 'direction'],
    0x2191: ['up', 'north', 'direction'],
    0x2192: ['right', 'east', 'direction'],
    0x2193: ['down', 'south', 'direction'],
    0x2194: ['left-right', 'bidirectional', 'swap'],
    0x2195: ['up-down', 'vertical', 'swap'],
    0x2196: ['northwest', 'diagonal', 'direction'],
    0x2197: ['northeast', 'diagonal', 'direction'],
    0x2198: ['southeast', 'diagonal', 'direction'],
    0x2199: ['southwest', 'diagonal', 'direction'],
    0x21A9: ['return', 'undo', 'hook'],
    0x21AA: ['enter', 'redo', 'hook'],
  },
  math: {
    0x2200: ['logic', 'universal quantifier', 'set theory'],
    0x2202: ['calculus', 'derivative', 'analysis'],
    0x2203: ['logic', 'existential quantifier', 'set theory'],
    0x2205: ['empty set', 'set theory', 'null set'],
    0x2208: ['member of', 'set theory', 'belongs to'],
    0x2209: ['not member of', 'set theory'],
    0x220B: ['contains as member', 'set theory'],
    0x2211: ['sum', 'sigma', 'series'],
    0x221A: ['square root', 'radical'],
    0x221E: ['infinity', 'limit'],
    0x222B: ['integral', 'calculus'],
    0x2248: ['approximate', 'almost equal'],
    0x2260: ['not equal', 'comparison'],
    0x2264: ['less than or equal', 'comparison'],
    0x2265: ['greater than or equal', 'comparison'],
  },
};

export const SCRIPT_HINTS = [
  { prefix: 'LATIN', script: 'Latin' },
  { prefix: 'GREEK', script: 'Greek' },
  { prefix: 'CYRILLIC', script: 'Cyrillic' },
];
