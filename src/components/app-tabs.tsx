import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

// 5 tabs matching the desktop web app's own STUDY/REVIEW/TOOLS grouping,
// translated into a mobile-appropriate hierarchy: Home ("what should I
// study right now"), Learn (Learning Paths + Study Planner + Library —
// "what am I learning"), Review (Flashcards + Quizzes + Terminology —
// "what do I need to review"), Create ("what can I make/import"), Profile
// ("how am I doing" — also where Progress and Passport now live).
// Studium AI stays off this bar entirely, reached instead through the
// floating "Ask AI" button on Home (see HomeFabs) so it's globally
// reachable without spending a tab slot on it.
//
// Study Paths, Library, and Progress are no longer tabs — they moved to
// plain pushed routes (/study-paths, /library, /progress, registered in
// app/_layout.tsx) reached from inside Learn/Profile instead. Nothing
// about those three screens changed; only how you get to them did.
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
            default: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="school-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="school" />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="review">
        <NativeTabs.Trigger.Label>Review</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="repeat-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="repeat" />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="create">
        <NativeTabs.Trigger.Label>Create</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="add-circle-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={Ionicons} name="add-circle" />,
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
