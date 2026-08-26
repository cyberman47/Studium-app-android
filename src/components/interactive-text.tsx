import { useMemo, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { detectTerms } from '@/lib/termDetection';
import { type TermEntry } from '@/features/terminology/data';
import { TermDetailSheet } from '@/features/terminology/components/TermDetailSheet';
import { getMasteryTier, useTermProgressMap } from '@/features/terminology/store';
import { type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Drop-in replacement for plain text content, mirroring the web app's own
// InteractiveText (components/interactive-text.tsx there): detects real
// Terminology terms in the string and highlights each one by its real
// mastery tier — tapping any of them (in any tier) opens the same real
// definition/rating sheet Review > Terminology uses.
//
// Three tiers, matching the web version:
// - unknown (never pressed): solid yellow highlight — "you haven't looked
//   at this yet."
// - learning (pressed/in library, not rated "know-well"): a visible but
//   quieter rose underline — still worth another look.
// - mastered (rated "know-well"): blends into normal reading text, but
//   per feedback must never become inert or disappear — it keeps a faint
//   dotted underline as a discoverability cue and stays fully tappable,
//   re-opening the same sheet with its saved rating shown as active.
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
  const segments = useMemo(() => detectTerms(text), [text]);

  return (
    <>
      <Text style={[{ color: theme[themeColor] }, style]}>
        {segments.map((seg, i) => {
          if (seg.type === 'text') return seg.value;
          const tier = getMasteryTier(progressMap[seg.term.id]);
          let termStyle: TextStyle;
          if (tier === 'unknown') {
            termStyle = { backgroundColor: theme.amberMuted, color: theme.text, fontWeight: '700' };
          } else if (tier === 'learning') {
            termStyle = {
              color: theme.rose,
              fontWeight: '700',
              textDecorationLine: 'underline',
              textDecorationColor: theme.rose,
            };
          } else {
            termStyle = {
              color: theme.text,
              textDecorationLine: 'underline',
              textDecorationStyle: 'dotted',
              textDecorationColor: theme.textSecondary,
            };
          }
          return (
            <Text key={i} onPress={() => setOpenTerm(seg.term)} suppressHighlighting style={termStyle}>
              {seg.value}
            </Text>
          );
        })}
      </Text>
      <TermDetailSheet term={openTerm} visible={openTerm !== null} onClose={() => setOpenTerm(null)} />
    </>
  );
}
