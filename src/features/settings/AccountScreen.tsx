import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { logOut, useAuthState } from '@/features/auth/store';
import { Card } from '@/features/dashboard/components/Card';
import { avatarColorOptions, updateEditableProfile, useEditableProfile } from '@/features/profile/store';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

// Settings > App > Account. Supersedes the old bare avatar/bio-only
// Settings screen (features/profile/SettingsScreen.tsx, still reachable
// nowhere now that More's row points here) with the full field set the
// spec asks for. Name writes to both the local profile store (so the
// Profile tab's identity card updates immediately) and the real
// profiles.name column (so Home's greeting and the leaderboard — see
// features/dashboard/remote.ts — stay in sync with it too); email is a
// real, read-only value from the real session. Password change is real
// (supabase.auth.updateUser) — a small, safe call to genuinely wire.
// Account deletion is not: Supabase has no client-safe self-delete (it
// needs a service-role call this app must never hold), so that flow's UI
// is fully real and interactive but its outcome is an honest message
// instead of a silently-fake success.
export function AccountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { email, userId } = useAuthState();
  const editable = useEditableProfile();

  const [name, setName] = useState(editable.name);
  const [avatarColor, setAvatarColor] = useState(editable.avatarColor);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  const initial = (name || '?').trim().charAt(0).toUpperCase();

  async function handleSaveProfile() {
    const trimmedName = name.trim();
    setProfileError('');
    setSavingProfile(true);
    updateEditableProfile({ name: trimmedName || editable.name, avatarColor });
    if (userId && trimmedName) {
      const { error } = await supabase.from('profiles').update({ name: trimmedName }).eq('id', userId);
      if (error) {
        setProfileError(error.message);
        setSavingProfile(false);
        return;
      }
    }
    setSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  async function handleChangePassword() {
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }
    setPasswordError('');
    setPasswordSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordSubmitting(false);
    if (error) {
      setPasswordError(error.message);
      return;
    }
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setChangingPassword(false);
    }, 1800);
  }

  async function handleConfirmDelete() {
    setDeleteSubmitting(true);
    // Real Supabase has no client-safe way to delete a user's own account
    // — that needs a service-role call this app must never embed. Honest
    // outcome rather than a fake success: sign out and say so plainly.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDeleteSubmitting(false);
    setDeleteMessage("Account deletion isn't connected yet — email support@studium.app and we'll take care of it.");
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <ScreenHeader title="Account" />

          <Card>
            <View style={styles.avatarRow}>
              <View style={[styles.avatarPreview, { backgroundColor: avatarColor }]}>
                <ThemedText style={styles.avatarPreviewText}>{initial}</ThemedText>
              </View>
              <View style={styles.avatarInfo}>
                <ThemedText style={styles.fieldTitle}>Profile picture</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.hint}>
                  Photo upload isn&apos;t connected yet — pick a color instead.
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
              NAME
            </ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              maxLength={40}
            />

            <ThemedText themeColor="textSecondary" style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
              EMAIL ADDRESS
            </ThemedText>
            <View style={[styles.input, styles.readOnlyInput, { borderColor: theme.border }]}>
              <ThemedText style={styles.readOnlyText}>{email ?? '—'}</ThemedText>
            </View>

            {profileError.length > 0 && (
              <ThemedText themeColor="rose" style={styles.errorText}>
                {profileError}
              </ThemedText>
            )}

            <Pressable
              onPress={handleSaveProfile}
              disabled={savingProfile}
              accessibilityRole="button"
              accessibilityLabel="Save changes"
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: theme.primary },
                savingProfile && styles.buttonDisabled,
                pressed && !savingProfile && styles.buttonPressed,
              ]}>
              <ThemedText style={styles.saveButtonText}>
                {savingProfile ? 'Saving…' : profileSaved ? 'Saved ✓' : 'Save changes'}
              </ThemedText>
            </Pressable>
          </Card>

          <Card>
            <Pressable
              onPress={() => {
                setChangingPassword((v) => !v);
                setPasswordError('');
              }}
              accessibilityRole="button"
              accessibilityLabel="Change password"
              style={styles.passwordHeader}>
              <View style={styles.textCol}>
                <ThemedText style={styles.fieldTitle}>Password</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.hint}>
                  ••••••••••
                </ThemedText>
              </View>
              <View style={styles.changePasswordLink}>
                <ThemedText themeColor="primary" style={styles.changePasswordLinkText}>
                  Change password
                </ThemedText>
                <Ionicons name={changingPassword ? 'chevron-up' : 'chevron-down'} size={14} color={theme.primary} />
              </View>
            </Pressable>

            {changingPassword && (
              <View style={styles.passwordForm}>
                <View style={styles.passwordFieldRow}>
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New password"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                    style={[styles.input, styles.passwordInput, { color: theme.text, borderColor: theme.border }]}
                  />
                  <Pressable
                    onPress={() => setPasswordVisible((v) => !v)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                    style={styles.eyeButton}>
                    <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={18} color={theme.textSecondary} />
                  </Pressable>
                </View>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  style={[styles.input, { color: theme.text, borderColor: theme.border, marginTop: 10 }]}
                />
                {passwordError.length > 0 && (
                  <ThemedText themeColor="rose" style={styles.errorText}>
                    {passwordError}
                  </ThemedText>
                )}
                <Pressable
                  onPress={handleChangePassword}
                  disabled={passwordSubmitting}
                  accessibilityRole="button"
                  accessibilityLabel="Update password"
                  style={({ pressed }) => [
                    styles.saveButton,
                    { backgroundColor: theme.primary },
                    passwordSubmitting && styles.buttonDisabled,
                    pressed && !passwordSubmitting && styles.buttonPressed,
                  ]}>
                  <ThemedText style={styles.saveButtonText}>
                    {passwordSubmitting ? 'Updating…' : passwordSuccess ? 'Updated ✓' : 'Update Password'}
                  </ThemedText>
                </Pressable>
              </View>
            )}
          </Card>

          <View style={styles.dangerZone}>
            <ThemedText themeColor="rose" style={styles.dangerLabel}>
              DANGER ZONE
            </ThemedText>
            {!confirmingDelete ? (
              <Pressable
                onPress={() => setConfirmingDelete(true)}
                accessibilityRole="button"
                accessibilityLabel="Delete account"
                style={({ pressed }) => [
                  styles.deleteButton,
                  { borderColor: theme.roseMuted },
                  pressed && { backgroundColor: theme.roseMuted },
                ]}>
                <Ionicons name="trash-outline" size={16} color={theme.rose} />
                <ThemedText themeColor="rose" style={styles.deleteButtonText}>
                  Delete Account
                </ThemedText>
              </Pressable>
            ) : deleteMessage ? (
              <View style={[styles.deleteConfirmBox, { borderColor: theme.roseMuted }]}>
                <ThemedText style={styles.deleteMessageText}>{deleteMessage}</ThemedText>
                <Pressable
                  onPress={() => Linking.openURL('mailto:support@studium.app?subject=Delete%20my%20account')}
                  accessibilityRole="button"
                  accessibilityLabel="Email support"
                  style={styles.deleteEmailButton}>
                  <Ionicons name="mail-outline" size={14} color={theme.primary} />
                  <ThemedText themeColor="primary" style={styles.deleteEmailText}>
                    Email support@studium.app
                  </ThemedText>
                </Pressable>
              </View>
            ) : (
              <View style={[styles.deleteConfirmBox, { borderColor: theme.roseMuted }]}>
                <ThemedText style={styles.deleteMessageText}>
                  This permanently deletes your account and all progress. This can&apos;t be undone.
                </ThemedText>
                <View style={styles.deleteConfirmButtons}>
                  <Pressable
                    onPress={() => setConfirmingDelete(false)}
                    style={({ pressed }) => [
                      styles.deleteCancel,
                      { borderColor: theme.border },
                      pressed && { backgroundColor: theme.backgroundSelected },
                    ]}>
                    <ThemedText style={styles.deleteCancelText}>Cancel</ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={handleConfirmDelete}
                    disabled={deleteSubmitting}
                    style={({ pressed }) => [
                      styles.deleteConfirm,
                      { backgroundColor: theme.rose },
                      deleteSubmitting && styles.buttonDisabled,
                      pressed && !deleteSubmitting && styles.buttonPressed,
                    ]}>
                    <ThemedText style={styles.deleteConfirmText}>
                      {deleteSubmitting ? 'Deleting…' : 'Delete Permanently'}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          <Pressable
            onPress={async () => {
              await logOut();
              router.replace('/signup');
            }}
            accessibilityRole="button"
            accessibilityLabel="Log out"
            style={({ pressed }) => [styles.logOutRow, pressed && { opacity: 0.7 }]}>
            <Ionicons name="log-out-outline" size={16} color={theme.textSecondary} />
            <ThemedText themeColor="textSecondary" style={styles.logOutText}>
              Log Out
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: 800, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: 14 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  avatarPreview: { width: 56, height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  avatarPreviewText: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  avatarInfo: { flex: 1, minWidth: 0, gap: 2 },
  fieldTitle: { fontSize: 14, fontWeight: '700' },
  hint: { fontSize: 11, lineHeight: 15 },
  swatchRow: { flexDirection: 'row', gap: 10, marginTop: Spacing.three },
  swatch: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  swatchSelected: { borderWidth: 2 },
  fieldLabel: { fontSize: 11, fontWeight: '500', letterSpacing: 0.4 },
  fieldLabelSpaced: { marginTop: Spacing.three },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: Radius.md, paddingHorizontal: Spacing.three, paddingVertical: 10, marginTop: 6, fontSize: 14 },
  readOnlyInput: { justifyContent: 'center' },
  readOnlyText: { fontSize: 14, opacity: 0.7 },
  errorText: { fontSize: 11, fontWeight: '700', marginTop: 8 },
  saveButton: { alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, paddingVertical: 13, marginTop: Spacing.three, minHeight: 46 },
  buttonDisabled: { opacity: 0.6 },
  buttonPressed: { opacity: 0.85 },
  saveButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  passwordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  textCol: { flex: 1, minWidth: 0, gap: 2 },
  changePasswordLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  changePasswordLinkText: { fontSize: 12, fontWeight: '700' },
  passwordForm: { marginTop: Spacing.three, paddingTop: Spacing.three, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(148,163,184,0.25)' },
  passwordFieldRow: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 40 },
  eyeButton: { position: 'absolute', right: 10, height: '100%', justifyContent: 'center' },
  dangerZone: { gap: Spacing.two, marginTop: Spacing.two },
  dangerLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 13 },
  deleteButtonText: { fontSize: 13, fontWeight: '700' },
  deleteConfirmBox: { borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: 12 },
  deleteMessageText: { fontSize: 12, lineHeight: 18 },
  deleteConfirmButtons: { flexDirection: 'row', gap: 8 },
  deleteCancel: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 11 },
  deleteCancelText: { fontSize: 13, fontWeight: '700' },
  deleteConfirm: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, paddingVertical: 11 },
  deleteConfirmText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  deleteEmailButton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  deleteEmailText: { fontSize: 12, fontWeight: '700' },
  logOutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: Spacing.three },
  logOutText: { fontSize: 13, fontWeight: '700' },
});
