import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { type TermEntry } from '../data';
import { recordTermPressed, setTermConfidence, type TermConfidence, useTermProgress } from '../store';
import { ExpandedTermPanel } from './ExpandedTermPanel';

// The definition sheet a term opens into — shared by Review > Terminology
// and InteractiveText (components/interactive-text.tsx), so a term tapped
// from a case narrative and a term tapped from the Terminology browse list
// are the exact same progress state, not two parallel systems.
//
// Matches the web app's own pattern (components/interactive-text.tsx there):
// opening the sheet alone adds the term to your library, before any rating —
// then three "Understanding" buttons (1 / 2 / checkmark) record how well you
// actually know it. Rating is optional and re-settable; it never removes the
// term from the library or hides the button again.
//
// Renders as a centered card, not a bottom sheet — per feedback, a
// definition popping up from the bottom read as an odd place to look for
// it. A dedicated "×" close button replaces the old drag-down grabber
// since there's no longer a bottom edge to swipe.
const LEVELS: { level: TermConfidence; label: string; symbol: string | null; icon?: 'checkmark' }[] = [
  { level: 'dont-know', label: "Don't know", symbol: '1' },
  { level: 'somewhat', label: 'Somewhat', symbol: '2' },
  { level: 'know-well', label: 'Know well', symbol: null, icon: 'checkmark' },
];

export function TermDetailSheet({ term, visible, onClose }: { term: TermEntry | null; visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  const progress = useTermProgress(term?.id ?? '');
  const confidence = progress?.confidence ?? null;
  const [expanded, setExpanded] = useState(false);

  // The "press moment" — matches web's togglePopup() → learnTerm(). Fires
  // whenever a term's sheet becomes visible, independent of any rating.
  useEffect(() => {
    if (visible && term) {
      recordTermPressed(term.id);
    }
    if (!visible) {
      setExpanded(false);
    }
  }, [visible, term]);

  const levelColor = (level: TermConfidence) => {
    if (level === 'dont-know') return theme.amber;
    if (level === 'somewhat') return theme.rose;
    return theme.primary;
  };
  const levelMutedColor = (level: TermConfidence) => {
    if (level === 'dont-know') return theme.amberMuted;
    if (level === 'somewhat') return theme.roseMuted;
    return theme.primaryMuted;
  };

  // Two independent top-level Modals, not one nested inside the other:
  // React Native's <Modal> renders nothing at all while its own `visible`
  // is false, including any child Modal inside it — nesting ExpandedTermPanel's
  // Modal inside this one would mean toggling this Modal off (to hide the
  // quick card while expanded) also unmounts the expanded panel before it
  // ever gets a chance to show.
  return (
    <>
      <Modal visible={visible && !expanded} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}>
          {term && (
            <>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                style={({ pressed }) => [styles.closeButton, { backgroundColor: theme.backgroundSelected }, pressed && styles.pressed]}>
                <Ionicons name="close" size={16} color={theme.textSecondary} />
              </Pressable>
              <View style={[styles.tag, { backgroundColor: theme.primaryMuted }]}>
                <ThemedText themeColor="primary" style={styles.tagText}>
                  {term.category}
                </ThemedText>
              </View>
              <ThemedText style={styles.termTitle}>{term.term}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.termDefinition}>
                {term.definition}
              </ThemedText>

              <ThemedText themeColor="textSecondary" style={styles.understandingLabel}>
                HOW WELL DO YOU KNOW THIS?
              </ThemedText>
              <View style={styles.levelsRow}>
                {LEVELS.map(({ level, label, symbol, icon }) => {
                  const active = confidence === level;
                  const color = levelColor(level);
                  return (
                    <Pressable
                      key={level}
                      onPress={() => setTermConfidence(term.id, level)}
                      accessibilityRole="button"
                      accessibilityLabel={label}
                      accessibilityState={{ selected: active }}
                      style={({ pressed }) => [
                        styles.levelButton,
                        {
                          backgroundColor: active ? color : levelMutedColor(level),
                          borderColor: color,
                        },
                        pressed && styles.pressed,
                      ]}>
                      {icon === 'checkmark' ? (
                        <Ionicons name="checkmark" size={18} color={active ? '#FFFFFF' : color} />
                      ) : (
                        <ThemedText style={[styles.levelSymbol, { color: active ? '#FFFFFF' : color }]}>{symbol}</ThemedText>
                      )}
                      <ThemedText style={[styles.levelLabel, { color: active ? '#FFFFFF' : color }]}>{label}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                onPress={() => setExpanded(true)}
                accessibilityRole="button"
                accessibilityLabel="Expand for more detail"
                style={({ pressed }) => [styles.expandButton, pressed && styles.pressed]}>
                <ThemedText themeColor="primary" style={styles.expandButtonText}>
                  Expand for more detail
                </ThemedText>
                <Ionicons name="arrow-forward" size={13} color={theme.primary} />
              </Pressable>
            </>
          )}
        </Pressable>
        </Pressable>
      </Modal>

      {term && (
        <ExpandedTermPanel
          initialTermId={term.id}
          visible={visible && expanded}
          onClose={() => {
            setExpanded(false);
            onClose();
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    gap: 4,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    // Leaves room so a long category name never runs under the close
    // button sitting absolutely-positioned in the top-right corner.
    maxWidth: '80%',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  termTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: Spacing.two,
  },
  termDefinition: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: Spacing.two,
  },
  understandingLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  levelsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    paddingVertical: 12,
    minHeight: 48,
  },
  pressed: {
    opacity: 0.85,
  },
  levelSymbol: {
    fontSize: 15,
    fontWeight: '800',
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: Spacing.three,
    paddingVertical: 8,
  },
  expandButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
