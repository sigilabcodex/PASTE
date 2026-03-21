import { GENERATED_FILES, KEYWORD_HINTS, SCRIPT_HINTS } from './config.mjs';
import { normalizeNameMetadata } from './normalizers.mjs';

function codepointToHex(codepoint) {
  return `U+${codepoint.toString(16).toUpperCase().padStart(4, '0')}`;
}

function inferScript(name) {
  for (const hint of SCRIPT_HINTS) {
    if (name.toUpperCase().startsWith(hint.prefix)) {
      return hint.script;
    }
  }
  return 'Common';
}

function dedupe(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function createKeywords({ name, aliases = [], hinted = [], categoryId }) {
  const tokens = [name, ...aliases]
    .flatMap((value) => value.toLowerCase().split(/[^a-z0-9]+/u).filter(Boolean));

  return dedupe([...tokens, ...hinted, categoryId]);
}

function inRanges(codepoint, ranges) {
  return ranges.some(([start, end]) => codepoint >= start && codepoint <= end);
}

function compareRecords(a, b) {
  return a.codepoint - b.codepoint || a.name.localeCompare(b.name);
}

function mergeArrays(...values) {
  return dedupe(values.flatMap((value) => value ?? []));
}

function buildOverrideMap(manualOverrides = {}) {
  return new Map(Object.entries(manualOverrides));
}

function getOverride(overrideMap, codepoints) {
  return overrideMap.get(codepoints[0]) ?? null;
}

function applyMetadata({ record, fileConfig, overrideMap }) {
  const codepoints = record.codepoints ?? [codepointToHex(record.codepoint)];
  const override = getOverride(overrideMap, codepoints);
  const { name, aliases } = normalizeNameMetadata({
    rawName: record.name,
    emojiCommentName: record.emojiCommentName,
    fallbackCodepoints: codepoints,
    preferredName: override?.name,
  });
  const mergedAliases = mergeArrays(aliases, override?.aliases);
  const keywords = createKeywords({
    name,
    aliases: mergedAliases,
    hinted: mergeArrays(KEYWORD_HINTS[fileConfig.id]?.[record.codepoint], override?.tags),
    categoryId: fileConfig.id,
  });
  const tags = mergeArrays(fileConfig.tags, override?.tags, [record.generalCategory?.toLowerCase()].filter(Boolean));

  return {
    char: record.char,
    name,
    ...(mergedAliases.length ? { aliases: mergedAliases } : {}),
    codepoints,
    category: fileConfig.schemaCategory,
    tags,
    keywords,
    searchKeywords: keywords,
    script: inferScript(name),
    ...(override?.description ? { description: override.description } : {}),
  };
}

function buildUnicodeEntries(unicodeRecords, fileConfig, overrideMap) {
  return unicodeRecords
    .filter((record) => inRanges(record.codepoint, fileConfig.ranges))
    .sort(compareRecords)
    .slice(0, fileConfig.sampleLimit)
    .map((record) => applyMetadata({ record, fileConfig, overrideMap }));
}

function buildEmojiEntries(emojiProperties, fileConfig, overrideMap) {
  const entries = [];

  for (const property of emojiProperties) {
    for (let codepoint = property.start; codepoint <= property.end; codepoint += 1) {
      entries.push(applyMetadata({
        record: {
          codepoint,
          char: String.fromCodePoint(codepoint),
          name: '',
          emojiCommentName: property.commentName,
          generalCategory: 'So',
          codepoints: [codepointToHex(codepoint)],
        },
        fileConfig,
        overrideMap,
      }));

      if (entries.length >= fileConfig.sampleLimit) {
        return entries;
      }
    }
  }

  return entries;
}

export function buildDatasets(unicodeRecords, emojiProperties = [], manualOverrides = {}) {
  const overrideMap = buildOverrideMap(manualOverrides);

  return GENERATED_FILES.map((fileConfig) => {
    let entries = [];

    if (fileConfig.sampleLimit > 0) {
      entries = fileConfig.id === 'emoji-core'
        ? buildEmojiEntries(emojiProperties, fileConfig, overrideMap)
        : buildUnicodeEntries(unicodeRecords, fileConfig, overrideMap);
    }

    return {
      ...fileConfig,
      generatedCount: entries.length,
      entries,
    };
  });
}
