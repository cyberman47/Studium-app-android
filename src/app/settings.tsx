import { SettingsHubScreen } from '@/features/settings/SettingsHubScreen';

// The one real Settings destination — Account, Subscription, General,
// Reader, Review, Feedback, Help, About, and Log Out, all one level deep
// (see SettingsHubScreen.tsx for why this used to be split three ways).
// Profile editing (name/avatar) lives at Settings > Account
// (features/settings/AccountScreen.tsx); the old avatar/bio-only editor
// this route used to render (features/profile/SettingsScreen.tsx) has
// been removed — nothing pointed to it any more.
export default function Settings() {
  return <SettingsHubScreen />;
}
