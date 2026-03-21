function titleCaseWord(word) {
  return word
    .split('-')
    .map((part) => {
      if (!part) return part;
      if (/^u\+[0-9a-f]{2,6}$/iu.test(part)) {
        return part.toUpperCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('-');
}

function titleCaseName(value) {
  return value
    .split(/\s+/u)
    .filter(Boolean)
    .map(titleCaseWord)
    .join(' ')
    .trim();
}

function humanizeCommentName(commentName) {
  return titleCaseName(
    commentName
      .replace(/^[^\p{L}\p{N}]+/gu, '')
      .replace(/\.{2,}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function dedupe(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeDirectionalName(name) {
  return name
    .replace(/\bLeftwards\b/gu, 'Left')
    .replace(/\bRightwards\b/gu, 'Right')
    .replace(/\bUpwards\b/gu, 'Up')
    .replace(/\bDownwards\b/gu, 'Down')
    .replace(/\bNorth West\b/gu, 'Northwest')
    .replace(/\bNorth East\b/gu, 'Northeast')
    .replace(/\bSouth West\b/gu, 'Southwest')
    .replace(/\bSouth East\b/gu, 'Southeast')
    .replace(/\bLeft Right\b/gu, 'Left-Right')
    .replace(/\bUp Down\b/gu, 'Up-Down')
    .replace(/\s+/gu, ' ')
    .trim();
}

function normalizeUnicodeDisplayName(rawName) {
  if (!rawName) return '';

  const cleaned = rawName
    .replace(/[_]+/gu, ' ')
    .replace(/^SYMBOL\s+/u, '')
    .replace(/\s+/gu, ' ')
    .trim();

  const titled = /[a-z]/u.test(cleaned) ? cleaned.trim() : titleCaseName(cleaned);
  return normalizeDirectionalName(titled);
}

export function buildReadableFallback(codepoints) {
  const [firstCodepoint] = codepoints;
  return `Unknown Symbol (${firstCodepoint})`;
}

export function normalizeNameMetadata({ rawName, fallbackCodepoints, emojiCommentName, preferredName }) {
  const normalizedRawName = normalizeUnicodeDisplayName(rawName);
  const normalizedCommentName = emojiCommentName ? humanizeCommentName(emojiCommentName) : '';
  const preferred = normalizeUnicodeDisplayName(preferredName ?? '') || normalizedCommentName || normalizedRawName || buildReadableFallback(fallbackCodepoints);

  const aliases = dedupe([
    normalizedCommentName && normalizedCommentName !== preferred ? normalizedCommentName : '',
    normalizedRawName && normalizedRawName !== preferred ? normalizedRawName : '',
  ]);

  return {
    name: preferred,
    aliases,
  };
}
