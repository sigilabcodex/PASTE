import { GENERATED_FILES, KEYWORD_HINTS, SCRIPT_HINTS } from './config.mjs';

function codepointToHex(codepoint) {
  return `U+${codepoint.toString(16).toUpperCase().padStart(4, '0')}`;
}

function inferScript(name) {
  for (const hint of SCRIPT_HINTS) {
    if (name.startsWith(hint.prefix)) {
      return hint.script;
    }
  }
  return 'Common';
}

function createKeywords(record, categoryId) {
  const base = record.name.toLowerCase().split(/[^a-z0-9]+/u).filter(Boolean);
  const hinted = KEYWORD_HINTS[categoryId]?.[record.codepoint] ?? [];
  return Array.from(new Set([...base, ...hinted, categoryId]));
}

function inRanges(codepoint, ranges) {
  return ranges.some(([start, end]) => codepoint >= start && codepoint <= end);
}

function compareRecords(a, b) {
  return a.codepoint - b.codepoint || a.name.localeCompare(b.name);
}

function toDatasetEntry(record, fileConfig) {
  const keywords = createKeywords(record, fileConfig.id);
  return {
    char: record.char,
    name: record.name,
    codepoints: [codepointToHex(record.codepoint)],
    category: fileConfig.schemaCategory,
    tags: [...(fileConfig.tags ?? []), record.generalCategory.toLowerCase()],
    keywords,
    searchKeywords: keywords,
    script: inferScript(record.name),
  };
}

export function buildDatasets(unicodeRecords) {
  return GENERATED_FILES.map((fileConfig) => {
    if (fileConfig.sampleLimit === 0) {
      return {
        ...fileConfig,
        generatedCount: 0,
        entries: [],
      };
    }

    const entries = unicodeRecords
      .filter((record) => inRanges(record.codepoint, fileConfig.ranges))
      .sort(compareRecords)
      .slice(0, fileConfig.sampleLimit)
      .map((record) => toDatasetEntry(record, fileConfig));

    return {
      ...fileConfig,
      generatedCount: entries.length,
      entries,
    };
  });
}
