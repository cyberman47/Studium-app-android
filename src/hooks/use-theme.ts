/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useAppearanceMode } from '@/features/settings/appearanceStore';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  // Settings > App > General > Appearance — 'system' (the default) falls
  // through to the OS scheme exactly as before; 'light'/'dark' overrides
  // it outright, app-wide, the moment it's changed.
  const mode = useAppearanceMode();
  const resolved = mode === 'system' ? (scheme === 'unspecified' || !scheme ? 'light' : scheme) : mode;

  return Colors[resolved];
}
