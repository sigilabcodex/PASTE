import fs from 'node:fs/promises';

export async function readUnicodeData(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return raw
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const fields = line.split(';');
      if (fields.length < 3) {
        throw new Error(`Invalid UnicodeData line: ${line}`);
      }

      const codepoint = Number.parseInt(fields[0], 16);
      return {
        codepoint,
        char: String.fromCodePoint(codepoint),
        name: fields[1],
        generalCategory: fields[2],
      };
    });
}

export async function readEmojiData(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return raw
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [left, right] = line.split('#', 1)[0].split(';').map((part) => part.trim());
      const [startHex, endHex = startHex] = left.split('..');
      return {
        start: Number.parseInt(startHex, 16),
        end: Number.parseInt(endHex, 16),
        property: right,
      };
    });
}
