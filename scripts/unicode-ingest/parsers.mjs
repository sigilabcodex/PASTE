import fs from 'node:fs/promises';

function parseEmojiComment(comment) {
  if (!comment) {
    return { sample: '', commentName: '' };
  }

  const cleaned = comment.trim();
  const match = cleaned.match(/^(?<sample>\S+(?:\.\.\S+)?)\s+(?<name>.+)$/u);
  if (!match?.groups) {
    return { sample: '', commentName: cleaned };
  }

  return {
    sample: match.groups.sample ?? '',
    commentName: match.groups.name?.trim() ?? '',
  };
}

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
      const [content, comment = ''] = line.split('#');
      const [left, right] = content.split(';').map((part) => part.trim());
      const [startHex, endHex = startHex] = left.split('..');
      const { sample, commentName } = parseEmojiComment(comment);

      return {
        start: Number.parseInt(startHex, 16),
        end: Number.parseInt(endHex, 16),
        property: right,
        sample,
        commentName,
      };
    });
}
