#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { GENERATED_FILES, GENERATOR_NOTES } from './unicode-ingest/config.mjs';
import { readUnicodeData, readEmojiData } from './unicode-ingest/parsers.mjs';
import { buildDatasets } from './unicode-ingest/transformers.mjs';
import { writeDatasets } from './unicode-ingest/writer.mjs';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'scripts', 'unicode-sources');
const SAMPLE_SOURCE_DIR = path.join(SOURCE_DIR, 'sample');
const OUT_DIR = path.join(ROOT, 'data', 'generated');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const MANUAL_OVERRIDES_PATH = path.join(ROOT, 'data', 'manual-overrides.json');

async function resolveSourceFile(fileName) {
  const candidates = [
    path.join(SOURCE_DIR, fileName),
    path.join(SAMPLE_SOURCE_DIR, fileName),
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Keep looking.
    }
  }

  return null;
}

async function readManualOverrides(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function main() {
  const unicodeDataPath = await resolveSourceFile('UnicodeData.txt');
  const emojiDataPath = await resolveSourceFile('emoji-data.txt');

  if (!unicodeDataPath) {
    throw new Error('UnicodeData.txt is required in scripts/unicode-sources/ or scripts/unicode-sources/sample/.');
  }

  const unicodeRecords = await readUnicodeData(unicodeDataPath);
  const emojiProperties = emojiDataPath ? await readEmojiData(emojiDataPath) : [];
  const manualOverrides = await readManualOverrides(MANUAL_OVERRIDES_PATH);
  const datasets = buildDatasets(unicodeRecords, emojiProperties, manualOverrides);

  await writeDatasets(OUT_DIR, datasets);

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceMode: unicodeDataPath.includes(`${path.sep}sample${path.sep}`) ? 'bundled-sample-files' : 'unicode-text-files',
    sourceFiles: {
      unicodeData: path.relative(ROOT, unicodeDataPath),
      emojiData: emojiDataPath ? path.relative(ROOT, emojiDataPath) : null,
      manualOverrides: path.relative(ROOT, MANUAL_OVERRIDES_PATH),
    },
    parsedCounts: {
      unicodeRecords: unicodeRecords.length,
      emojiProperties: emojiProperties.length,
      manualOverrides: Object.keys(manualOverrides).length,
    },
    outputs: datasets.map(({ id, file, generatedCount, sampleLimit }) => ({
      id,
      file,
      generatedCount,
      sampleLimit,
    })),
    notes: [
      'This staged generator intentionally emits only small deterministic samples.',
      'Expand categories by adding more Unicode source files and raising sample limits in scripts/unicode-ingest/config.mjs.',
      `Expected generated files: ${GENERATED_FILES.map(({ file }) => file).join(', ')}`,
      ...GENERATOR_NOTES,
    ],
  };

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`Generated ${datasets.length} dataset shards in ${path.relative(ROOT, OUT_DIR)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
