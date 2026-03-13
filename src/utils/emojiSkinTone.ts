import type { SymbolEntry } from '../types';

export const SKIN_TONE_MODIFIERS = ['🏻', '🏼', '🏽', '🏾', '🏿'] as const;

export type SkinToneModifier = (typeof SKIN_TONE_MODIFIERS)[number];

const EMOJI_MODIFIER_BASE_REGEX = /\p{Emoji_Modifier_Base}/u;

function isSkinToneModifier(codePoint: number): boolean {
  return codePoint >= 0x1f3fb && codePoint <= 0x1f3ff;
}

export function stripSkinToneModifiers(value: string): string {
  return Array.from(value)
    .filter((char) => {
      const codePoint = char.codePointAt(0);
      return codePoint ? !isSkinToneModifier(codePoint) : true;
    })
    .join('');
}

export function supportsSkinToneFromText(value: string): boolean {
  const normalized = stripSkinToneModifiers(value);
  return Array.from(normalized).some((char) => EMOJI_MODIFIER_BASE_REGEX.test(char));
}

export function generateSkinToneVariants(value: string, preferredTone?: SkinToneModifier): string[] {
  const normalized = stripSkinToneModifiers(value);
  const parts = Array.from(normalized);
  const indexes = parts
    .map((char, index) => (EMOJI_MODIFIER_BASE_REGEX.test(char) ? index : -1))
    .filter((index) => index >= 0);

  if (indexes.length === 0) {
    return [];
  }

  const modifiers = preferredTone
    ? [preferredTone, ...SKIN_TONE_MODIFIERS.filter((tone) => tone !== preferredTone)]
    : [...SKIN_TONE_MODIFIERS];

  return modifiers.map((tone) =>
    parts
      .map((char, index) => (indexes.includes(index) ? `${char}${tone}` : char))
      .join('')
  );
}

export interface EmojiVariantMetadata {
  supportsSkinTone: boolean;
  generatedVariants: string[];
}

export function getEmojiVariantMetadata(entry: SymbolEntry): EmojiVariantMetadata {
  const supportsSkinTone =
    entry.supportsSkinTone !== undefined ? entry.supportsSkinTone : supportsSkinToneFromText(entry.char);

  const generatedVariants = supportsSkinTone
    ? entry.generatedVariants ?? generateSkinToneVariants(entry.char, entry.preferredDefaultSkinTone)
    : [];

  return {
    supportsSkinTone,
    generatedVariants
  };
}
