import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

// 5 tabs matching the web mobile dashboard's bottom nav
// (components/mobile-dashboard.tsx on studium-website): Home, Learn,
// Practice, Studium AI, Profile. Only Home has real content built out so
// far; the other four route to ComingSoonScreen placeholders
// (src/app/learn.tsx, practice.tsx, ai.tsx, profile.tsx) so the nav itself
// is fully wired now, and each tab's real screen can be swapped in later
// without touching this file.
export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="home-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="home" />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="learn">
        <NativeTabs.Trigger.Label>Learn</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="map-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="map" />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="practice">
        <NativeTabs.Trigger.Label>Practice</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="layers-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="layers" />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="ai">
        <NativeTabs.Trigger.Label>Studium AI</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="sparkles-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="sparkles" />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="person-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="person" />,
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
