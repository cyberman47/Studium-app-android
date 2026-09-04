import { useSyncExternalStore } from 'react';

/**
 * The small slice of the profile that Settings can actually edit —
 * display name and avatar color (there's no camera/photo-library access
 * wired up yet, so "profile picture" here means picking a color for the
 * initial-letter avatar, not a real photo upload). A plain module-level
 * store with useSyncExternalStore rather than Context, since only two
 * screens (Profile, Settings) ever need to read or write it.
 *
 * `name` starts empty rather than seeded from any mock value — it used to
 * default to a hardcoded mock name, which meant Profile showed that same
 * fake name for every real account until the student happened to visit
 * Account and hit Save once. ProfileScreen now syncs this from the real
 * profiles.name column (via features/dashboard/remote.ts's
 * useRealDashboardStats) the moment that fetch resolves, and
 * AccountScreen's own save flow keeps updating it from there on, same as
 * before — this file only stops pretending to already know a name before
 * either of those has actually happened.
 */

export const avatarColorOptions = ['#0F8B8D', '#7C3AED', '#DB2777', '#D97706', '#0369A1', '#B91C1C'];

type EditableProfile = {
  name: string;
  bio: string;
  avatarColor: string;
};

let state: EditableProfile = {
  name: '',
  bio: '',
  avatarColor: avatarColorOptions[0],
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getEditableProfile(): EditableProfile {
  return state;
}

export function updateEditableProfile(patch: Partial<EditableProfile>) {
  state = { ...state, ...patch };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useEditableProfile(): EditableProfile {
  return useSyncExternalStore(subscribe, getEditableProfile);
}
