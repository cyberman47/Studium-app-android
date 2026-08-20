/**
 * Studium's brand tokens, ported from the web app (studium-website) so the
 * phone app looks like the same product, not a generic template. Every
 * screen should read colors from here — never a hardcoded hex in a
 * component — so light/dark mode and any future brand tweak stay
 * consistent app-wide.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Base surfaces
    text: '#0F172A', // matches the web's "heading" ink
    textSecondary: '#64748B', // slate-500
    background: '#F8FAFC', // the web dashboard's own page background
    backgroundElement: '#FFFFFF', // card surface
    backgroundSelected: '#ECFDF5', // teal-tinted selected/active background
    border: 'rgba(15, 23, 42, 0.08)',

    // Brand
    primary: '#0F8B8D', // Studium teal — icons, badges, links, secondary CTAs
    primaryMuted: '#E6F4F1', // teal-tinted card/badge background
    accent: '#047857', // primary CTA buttons ("Resume", "Start Studying")

    // Status
    amber: '#D97706', // streak/flame
    amberMuted: '#FEF3C7',
    rose: '#E11D48', // unfamiliar / needs-review / destructive
    roseMuted: '#FFE4E6',

    white: '#FFFFFF',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#94A3B8', // slate-400
    background: '#070D0C',
    backgroundElement: '#0D1917',
    backgroundSelected: 'rgba(15, 139, 141, 0.15)',
    border: 'rgba(255, 255, 255, 0.10)',

    primary: '#2DD4BF', // teal-400 — lighter than light-mode primary for contrast on near-black
    primaryMuted: 'rgba(15, 139, 141, 0.16)',
    accent: '#34D399', // emerald-400

    amber: '#FBBF24',
    amberMuted: 'rgba(217, 119, 6, 0.16)',
    rose: '#FB7185',
    roseMuted: 'rgba(225, 29, 72, 0.16)',

    white: '#FFFFFF',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// 8dp-rhythm radii, used the same way across every card/pill/button so
// rounding reads as one consistent system rather than ad-hoc per component.
// `lg` is the standard card radius app-wide (14px), matching every
// dashboard widget (Card, ContinueCard, DailyCaseCard, RecommendedTodayCard).
export const Radius = {
  sm: 10,
  md: 12,
  lg: 14,
  pill: 999,
} as const;

// Cross-platform elevation so cards read as raised surfaces instead of flat
// color swatches — Android uses `elevation`, iOS uses the shadow* props.
// Kept deliberately light: cards lean on their `border` color for
// separation, and shadow is just a soft assist rather than the primary
// affordance. `card` is for standard white/dark surfaces; `raised` is for
// the hero cards (gradient, daily case) that should read as slightly
// elevated, not heavily so.
export const Shadow = {
  card: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },
    android: { elevation: 1 },
    default: {},
  }),
  raised: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 14,
    },
    android: { elevation: 3 },
    default: {},
  }),
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
