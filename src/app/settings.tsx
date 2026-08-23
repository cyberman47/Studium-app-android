import { SettingsHubScreen } from '@/features/settings/SettingsHubScreen';

// Now the top-level Settings hub (App / Reader / Review) rather than a
// direct jump into profile editing — that editor lives on at
// Settings > App > Account (features/settings/AccountScreen.tsx). The old
// avatar/bio-only editor this route used to render
// (features/profile/SettingsScreen.tsx) is superseded and unlinked, not
// deleted.
export default function Settings() {
  return <SettingsHubScreen />;
}
