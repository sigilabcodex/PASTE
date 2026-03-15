#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'scripts', 'unicode-sources');
const OUT_DIR = path.join(ROOT, 'src', 'data', 'generated');
const EXISTING_SYMBOLS = path.join(ROOT, 'src', 'data', 'symbols.json');

const toHex = (n) => `U+${n.toString(16).toUpperCase().padStart(4, '0')}`;
const slug = (name, cp) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `u-${cp.toString(16)}`;

const GROUPS = [
  { id: 'punctuation', category: 'punctuation', file: 'punctuation.generated.json', ranges: [[0x2000, 0x206F], [0x2E00, 0x2E7F], [0x3000, 0x303F]], gc: ['Pc', 'Pd', 'Pe', 'Pf', 'Pi', 'Po', 'Ps'] },
  { id: 'arrows', category: 'arrows', file: 'arrows.generated.json', ranges: [[0x2190, 0x21FF], [0x27F0, 0x27FF], [0x2900, 0x297F], [0x2B00, 0x2BFF]] },
  { id: 'math-symbols', category: 'math-symbols', file: 'math-symbols.generated.json', ranges: [[0x2200, 0x22FF], [0x27C0, 0x27EF], [0x2980, 0x29FF], [0x2A00, 0x2AFF]], gc: ['Sm'] },
  { id: 'geometric-shapes', category: 'geometric-shapes', file: 'geometric-shapes.generated.json', ranges: [[0x25A0, 0x25FF], [0x1F780, 0x1F7FF]] },
  { id: 'box-drawing', category: 'box-drawing', file: 'box-drawing.generated.json', ranges: [[0x2500, 0x257F]] },
  { id: 'currency', category: 'currency', file: 'currency.generated.json', ranges: [[0x20A0, 0x20CF], [0x0024, 0x00A5]], gc: ['Sc'] },
  { id: 'technical-computing', category: 'technical-computing', file: 'technical-symbols.generated.json', ranges: [[0x2300, 0x23FF], [0x2400, 0x243F], [0x2440, 0x245F]] },
];

const EMOJI_RANGES = [[0x1F300, 0x1F5FF], [0x1F600, 0x1F64F], [0x1F680, 0x1F6FF], [0x1F700, 0x1F77F], [0x1F900, 0x1F9FF], [0x1FA70, 0x1FAFF], [0x2600, 0x26FF], [0x2700, 0x27BF]];

async function getLocalUnicodeSources() {
  const need = ['UnicodeData.txt', 'Blocks.txt', 'Scripts.txt', 'emoji-data.txt', 'emoji-test.txt'];
  const found = await Promise.all(need.map(async (f) => {
    try { await fs.access(path.join(SOURCE_DIR, f)); return f; } catch { return null; }
  }));
  return found.filter(Boolean);
}

async function loadPythonUnicodeIndex() {
  const py = `import json,unicodedata\nout={}\nfor cp in range(0x110000):\n c=chr(cp)\n n=unicodedata.name(c,'')\n if not n: continue\n out[cp]={'name':n,'gc':unicodedata.category(c)}\nprint(json.dumps(out,separators=(',',':')))\n`;
  const { stdout } = await run('python3', ['-c', py], { maxBuffer: 200 * 1024 * 1024 });
  const parsed = JSON.parse(stdout);
  return new Map(Object.entries(parsed).map(([cp, v]) => [Number(cp), v]));
}

function inRanges(cp, ranges) { return ranges.some(([s, e]) => cp >= s && cp <= e); }
function scriptForName(name) {
  if (name.startsWith('CJK')) return 'Han';
  if (name.startsWith('GREEK')) return 'Greek';
  if (name.startsWith('CYRILLIC')) return 'Cyrillic';
  if (name.startsWith('LATIN')) return 'Latin';
  return 'Common';
}

function buildEntry(cp, record, group, existing) {
  const base = {
    id: slug(record.name, cp),
    char: String.fromCodePoint(cp),
    name: record.name,
    codepoints: [toHex(cp)],
    category: group.category,
    primaryCategory: group.category,
    tags: [group.id, `gc:${record.gc.toLowerCase()}`],
    searchKeywords: [group.id.replace(/-/g, ' '), record.name.toLowerCase(), record.gc],
    script: scriptForName(record.name),
    curatedSets: [`unicode-${group.id}-core`],
    knowledge: {
      description: `Unicode ${group.id} character.`,
      history: 'Generated at build-time from Unicode character properties.',
      sourceLabels: ['Unicode'],
      externalLinks: [{ label: 'Unicode code charts', url: 'https://www.unicode.org/charts/', sourceType: 'unicode' }],
    },
  };
  if (!existing) return base;
  return { ...base, ...Object.fromEntries(Object.entries(existing).filter(([k]) => !['char', 'name', 'codepoints', 'category', 'primaryCategory', 'script'].includes(k))) };
}

async function main() {
  const existing = JSON.parse(await fs.readFile(EXISTING_SYMBOLS, 'utf8'));
  const existingMap = new Map(existing.map((e) => [e.codepoints.join('-'), e]));
  await fs.mkdir(OUT_DIR, { recursive: true });

  const localSources = await getLocalUnicodeSources();
  const index = await loadPythonUnicodeIndex();
  const outputs = [];

  for (const group of GROUPS) {
    const rows = [];
    for (const [cp, record] of index) {
      if (!inRanges(cp, group.ranges)) continue;
      if (group.gc && !group.gc.includes(record.gc)) continue;
      const key = [toHex(cp)].join('-');
      rows.push(buildEntry(cp, record, group, existingMap.get(key)));
    }
    rows.sort((a, b) => a.codepoints[0].localeCompare(b.codepoints[0]));
    await fs.writeFile(path.join(OUT_DIR, group.file), JSON.stringify(rows, null, 2) + '\n');
    outputs.push({ group: group.id, count: rows.length, file: group.file });
  }

  const emojiRows = [];
  for (const [cp, record] of index) {
    if (!inRanges(cp, EMOJI_RANGES)) continue;
    const ch = String.fromCodePoint(cp);
    if (!(/\p{Extended_Pictographic}/u.test(ch) || /\p{Emoji_Presentation}/u.test(ch))) continue;
    const category = cp >= 0x1f600 && cp <= 0x1f64f ? 'emoji-smileys' : cp >= 0x1f680 && cp <= 0x1f6ff ? 'emoji-travel' : cp >= 0x1f900 ? 'emoji-objects' : 'emoji-objects';
    const key = [toHex(cp)].join('-');
    const base = {
      id: slug(record.name, cp),
      char: ch,
      name: record.name,
      codepoints: [toHex(cp)],
      category,
      primaryCategory: category,
      tags: ['emoji'],
      searchKeywords: ['emoji', record.name.toLowerCase()],
      script: 'Common',
      curatedSets: ['unicode-emoji-core'],
      supportsSkinTone: false,
      knowledge: {
        description: 'Emoji generated from Unicode emoji-capable code point ranges.',
        history: 'Generated at build-time from Unicode character properties.',
        sourceLabels: ['Unicode'],
        externalLinks: [{ label: 'Unicode emoji charts', url: 'https://unicode.org/emoji/charts/', sourceType: 'unicode' }],
      },
    };
    emojiRows.push(buildEntry(cp, { ...record, gc: record.gc }, { id: 'emoji', category, }, existingMap.get(key)) || base);
  }
  const dedup = Array.from(new Map(emojiRows.map((e) => [e.codepoints.join('-'), { ...e, category: e.category || 'emoji-objects', primaryCategory: e.primaryCategory || e.category || 'emoji-objects' }])).values());
  dedup.sort((a, b) => a.codepoints[0].localeCompare(b.codepoints[0]));
  await fs.writeFile(path.join(OUT_DIR, 'emoji.generated.json'), JSON.stringify(dedup, null, 2) + '\n');
  outputs.push({ group: 'emoji', count: dedup.length, file: 'emoji.generated.json' });

  const manifest = { generatedAt: new Date().toISOString(), sourceMode: localSources.length === 5 ? 'local-unicode-text-files' : 'python-unicodedata-fallback', localSources, outputs };
  await fs.writeFile(path.join(OUT_DIR, 'manifest.generated.json'), JSON.stringify(manifest, null, 2) + '\n');

  console.log('Generated datasets:', outputs.map((o) => `${o.group}=${o.count}`).join(', '));
}

main().catch((e) => { console.error(e); process.exit(1); });
