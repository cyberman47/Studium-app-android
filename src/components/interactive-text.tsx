import { useMemo, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { detectTerms } from '@/lib/termDetection';
import { type TermEntry } from '@/features/terminology/data';
import { TermDetailSheet } from '@/features/terminology/components/TermDetailSheet';
import { useLearnedTermIds } from '@/features/terminology/store';
import { type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Drop-in replacement for plain text content, mirroring the web app's own
// InteractiveText (components/interactive-text.tsx there): detects real
// Terminology terms in the string and highlights each one still marked
// "not learned" in yellow — tapping it opens the term's real definition
// sheet, the same one Review > Terminology uses, where "Mark as learned"
// both clears the highlight everywhere it appears and adds the term to
// the student's real terminology progress. Once learned, a term blends
// back into normal text — mirrors the web version's "mastered terms
// don't stay highlighted forever" behavior, simplified from its 3-tier
// unknown/learning/mastered scheme to this app's simpler 2-state
// learned/not-learned model (features/terminology/store.ts has no
// separate "learning" tier yet).
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
  const learnedIds = useLearnedTermIds();
  const [openTerm, setOpenTerm] = useState<TermEntry | null>(null);
  const segments = useMemo(() => detectTerms(text), [text]);

  return (
    <>
      <Text style={[{ color: theme[themeColor] }, style]}>
        {segments.map((seg, i) => {
          if (seg.type === 'text') return seg.value;
          const learned = learnedIds.includes(seg.term.id);
          return (
            <Text
              key={i}
              onPress={() => setOpenTerm(seg.term)}
              suppressHighlighting
              style={
                learned
                  ? undefined
                  : {
                      backgroundColor: theme.amberMuted,
                      color: theme.text,
                      fontWeight: '700',
                    }
              }>
              {seg.value}
            </Text>
          );
        })}
      </Text>
      <TermDetailSheet term={openTerm} visible={openTerm !== null} onClose={() => setOpenTerm(null)} />
    </>
  );
}
