import fs from 'node:fs/promises';
import path from 'node:path';

export async function writeDatasets(outDir, datasets) {
  await fs.mkdir(outDir, { recursive: true });

  for (const dataset of datasets) {
    const outputPath = path.join(outDir, dataset.file);
    await fs.writeFile(outputPath, JSON.stringify(dataset.entries, null, 2) + '\n');
  }
}
