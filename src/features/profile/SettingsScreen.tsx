import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/features/dashboard/components/Card';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { avatarColorOptions, updateEditableProfile, useEditableProfile } from './store';

// A real, working settings screen — not a placeholder. There's no
// camera/photo-library access wired up yet, so "profile picture" here
// means an avatar color for the initial letter rather than a real photo
// upload; name and bio are plain editable text. Saves to the shared
// profile store, which the Profile tab reads from directly, so a change
// here is visible there immediately on navigating back.
export function SettingsScreen() {
  const theme = useTheme();
  const editable = useEditableProfile();
  const [name, setName] = useState(editable.name);
  const [bio, setBio] = useState(editable.bio);
  const [avatarColor, setAvatarColor] = useState(editable.avatarColor);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateEditableProfile({ name: name.trim() || editable.name, bio: bio.trim(), avatarColor });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const initial = (name || '?').trim().charAt(0).toUpperCase();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Settings" />

          <Card>
            <View style={styles.avatarRow}>
              <View style={[styles.avatarPreview, { backgroundColor: avatarColor }]}>
                <ThemedText style={styles.avatarPreviewText}>{initial}</ThemedText>
              </View>
              <View style={styles.avatarInfo}>
                <ThemedText style={styles.avatarLabel}>Avatar color</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.avatarHint}>
                  Photo upload isn't wired up yet — pick a color instead.
                </ThemedText>
              </View>
            </View>
            <View style={styles.swatchRow}>
              {avatarColorOptions.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setAvatarColor(color)}
                  accessibilityRole="button"
                  accessibilityLabel={`Use ${color} avatar color`}
                  accessibilityState={{ selected: color === avatarColor }}
                  style={[
                    styles.swatch,
                    { backgroundColor: color },
                    color === avatarColor && [styles.swatchSelected, { borderColor: theme.text }],
                  ]}>
                  {color === avatarColor && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </Pressable>
              ))}
            </View>
          </Card>

          <Card>
            <ThemedText themeColor="textSecondary" style={styles.fieldLabel}>
              USERNAME
            </ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your username"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              maxLength={30}
            />

            <ThemedText themeColor="textSecondary" style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
              BIO
            </ThemedText>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell other students what you're studying for."
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, styles.textArea, { color: theme.text, borderColor: theme.border }]}
              maxLength={280}
              multiline
              numberOfLines={3}
            />
            <ThemedText themeColor="textSecondary" style={styles.charCount}>
              {bio.length}/280
            </ThemedText>
          </Card>

          <Pressable
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save changes"
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: theme.primary },
              pressed && styles.saveButtonPressed,
            ]}>
            <ThemedText style={styles.saveButtonText}>{saved ? 'Saved ✓' : 'Save changes'}</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  inner: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatarPreview: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPreviewText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  avatarInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  avatarHint: {
    fontSize: 11,
    lineHeight: 15,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.three,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderWidth: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  fieldLabelSpaced: {
    marginTop: Spacing.three,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    marginTop: 6,
    fontSize: 14,
  },
  textArea: {
    minHeight: 76,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 4,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    paddingVertical: 14,
    marginTop: Spacing.two,
    minHeight: 48,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
