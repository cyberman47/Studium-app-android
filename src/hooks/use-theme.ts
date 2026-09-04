/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useAppearanceMode } from '@/features/settings/appearanceStore';
import { useColorScheme } from '@/hooks/use-color-scheme';

// 'system' (the default, Settings > General > Appearance) falls
// through to the OS scheme exactly as before; 'light'/'dark' overrides it
// outright, app-wide, the moment it's changed.
export function useResolvedThemeName(): 'light' | 'dark' {
  const scheme = useColorScheme();
  const mode = useAppearanceMode();
  return mode === 'system' ? (scheme === 'unspecified' || !scheme ? 'light' : scheme) : mode;
}

export function useTheme() {
  return Colors[useResolvedThemeName()];
}
