import { useMemo, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { detectTerms } from '@/lib/termDetection';
import { type TermEntry } from '@/features/terminology/data';
import { TermDetailSheet } from '@/features/terminology/components/TermDetailSheet';
import { useTermProgressMap } from '@/features/terminology/store';
import { type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Term-rating colors, not Studium's existing brand tokens (teal/amber/
// rose) — these are specifically the "1 / 2" underline colors the
// feedback asked for, kept local to this file since nothing else in the
// app uses them.
//
// React Native's textDecorationStyle ('dashed', for a squiggly-style
// underline) is iOS-only — confirmed live on Android: a term rated
// "2 / Somewhat" rendered with a perfectly solid line, identical to
// "1 / Don't know", despite the dashed style being set. Since Android
// can't tell the two apart by line style, color is the real
// differentiator here on both platforms; dashed is still requested for
// the iOS users who do get it as a bonus, not the load-bearing part.
const RATING_BLUE = '#3B82F6';
const RATING_PURPLE = '#8B5CF6';

// Drop-in replacement for plain text content, mirroring the web app's own
// InteractiveText (components/interactive-text.tsx there): detects real
// Terminology terms in the string and highlights each one by its real,
// per-term confidence rating — tapping any of them (in any state) opens
// the same real definition/rating popup Review > Terminology uses.
//
// Four visual states, one per real rating plus "never touched":
// - untouched (never pressed, not in the library yet): solid yellow
//   highlight — "you haven't looked at this yet."
// - pressed but not yet rated, or rated "1 / Don't know": a solid blue
//   underline.
// - rated "2 / Somewhat": a purple underline, dashed on iOS (Android
//   can't render a dashed/squiggly line here — see the color constants
//   above) — a different color from "1" is what actually distinguishes
//   them on Android.
// - rated "✓ / Know well": renders as fully plain text — no highlight,
//   no underline, blending into normal reading — but the onPress handler
//   is still attached, so it stays real and tappable, re-opening the
//   same popup with "Know well" shown as the saved rating.
export function InteractiveText({
  text,
  style,
  themeColor = 'text',
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  themeColor?: ThemeColor;
}) {
  const theme = useTheme();
  const progressMap = useTermProgressMap();
  const [openTerm, setOpenTerm] = useState<TermEntry | null>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const segments = useMemo(() => detectTerms(text), [text]);

  return (
    <>
      <Text style={[{ color: theme[themeColor] }, style]}>
        {segments.map((seg, i) => {
          if (seg.type === 'text') return seg.value;
          const progress = progressMap[seg.term.id];
          let termStyle: TextStyle;
          if (!progress?.inLibrary) {
            termStyle = { backgroundColor: theme.amberMuted, color: theme.text, fontWeight: '700' };
          } else if (progress.confidence === 'know-well') {
            termStyle = { color: theme.text };
          } else if (progress.confidence === 'somewhat') {
            termStyle = { color: theme.text, textDecorationLine: 'underline', textDecorationStyle: 'dashed', textDecorationColor: RATING_PURPLE };
          } else {
            // Covers both an explicit "1 / Don't know" rating and the
            // brief in-between moment right after pressing a term but
            // before choosing any of the three ratings.
            termStyle = { color: theme.text, textDecorationLine: 'underline', textDecorationColor: RATING_BLUE };
          }
          return (
            <Text
              key={i}
              onPress={(e) => {
                setAnchor({ x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
                setOpenTerm(seg.term);
              }}
              suppressHighlighting
              style={termStyle}>
              {seg.value}
            </Text>
          );
        })}
      </Text>
      <TermDetailSheet term={openTerm} visible={openTerm !== null} anchor={anchor} onClose={() => setOpenTerm(null)} />
    </>
  );
}
