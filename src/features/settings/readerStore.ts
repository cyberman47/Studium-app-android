import { useSyncExternalStore } from 'react';

import { loadPersisted, savePersisted } from '@/lib/persistedState';

/**
 * Every Reader setting the spec asks for, genuinely persisted (survives
 * an app restart) — but there's no real reading view or text-to-speech
 * engine in this app yet for any of it to actually govern. This exists so
 * the full UI/interaction can be built and tested now, with a real typed
 * shape and a single update function ready for whoever builds the actual
 * reader to read from, rather than a second settings system bolted on
 * later. Same honesty as every other local-only store in this app.
 */

export type TextSize = 'Small' | 'Medium' | 'Large' | 'Extra Large';
// "Only show options that are technically supported" (the spec's own
// qualifier for this one setting) — Default and Serif both map to real
// font tokens already defined in constants/theme.ts's Fonts; Sans Serif
// is a real, distinct token too. Dyslexia-friendly is deliberately
// omitted: it needs a real bundled typeface (e.g. OpenDyslexic) this app
// doesn't ship, so claiming to support it would be the one actually fake
// control in this screen — add it back the day that font ships.
export type TextStyle = 'Default' | 'Serif' | 'Sans Serif';
export type LineSpacing = 'Compact' | 'Normal' | 'Relaxed' | 'Extra spacious';
export type ParagraphSpacing = 'Compact' | 'Normal' | 'Spacious';
export type ReadingWidth = 'Narrow' | 'Comfortable' | 'Wide';
export type TTSLanguage = 'English' | 'Spanish' | 'Dutch';

export type ReaderSettings = {
  textSize: TextSize;
  textStyle: TextStyle;
  lineSpacing: LineSpacing;
  paragraphSpacing: ParagraphSpacing;
  readingWidth: ReadingWidth;
  ttsEnabled: boolean;
  ttsVoice: string;
  ttsLanguage: TTSLanguage;
  ttsSpeed: number;
  autoPlay: boolean;
  highlightWhileReading: boolean;
  rememberPosition: boolean;
  keepScreenAwake: boolean;
  autoScroll: boolean;
  showProgress: boolean;
};

export const textSizeOptions: TextSize[] = ['Small', 'Medium', 'Large', 'Extra Large'];
export const textStyleOptions: TextStyle[] = ['Default', 'Serif', 'Sans Serif'];
export const lineSpacingOptions: LineSpacing[] = ['Compact', 'Normal', 'Relaxed', 'Extra spacious'];
export const paragraphSpacingOptions: ParagraphSpacing[] = ['Compact', 'Normal', 'Spacious'];
export const readingWidthOptions: ReadingWidth[] = ['Narrow', 'Comfortable', 'Wide'];
export const ttsLanguageOptions: TTSLanguage[] = ['English', 'Spanish', 'Dutch'];
export const speechSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
// No TTS provider connected yet, so no real voice list to fetch — these
// are placeholder names in the right shape (id + display name) for
// whoever wires the real API to swap in a live list without changing the
// screen that renders them.
export const ttsVoiceOptions = ['Default', 'Aria', 'Guy', 'Jenny', 'Sonia'];

const KEY = 'studium_reader_settings';

export const defaultReaderSettings: ReaderSettings = {
  textSize: 'Medium',
  textStyle: 'Default',
  lineSpacing: 'Normal',
  paragraphSpacing: 'Normal',
  readingWidth: 'Comfortable',
  ttsEnabled: false,
  ttsVoice: 'Default',
  ttsLanguage: 'English',
  ttsSpeed: 1,
  autoPlay: false,
  highlightWhileReading: true,
  rememberPosition: true,
  keepScreenAwake: true,
  autoScroll: false,
  showProgress: true,
};

let state: ReaderSettings = defaultReaderSettings;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

loadPersisted(KEY, defaultReaderSettings).then((loaded) => {
  state = { ...defaultReaderSettings, ...loaded };
  emit();
});

export function useReaderSettings(): ReaderSettings {
  return useSyncExternalStore(subscribe, () => state);
}

export function updateReaderSettings(patch: Partial<ReaderSettings>) {
  state = { ...state, ...patch };
  emit();
  savePersisted(KEY, state);
}
