import AsyncStorage from '@react-native-async-storage/async-storage';

// Tiny, generic AsyncStorage read/write pair — the small piece every
// local-only settings store in this app (features/settings/*) builds on,
// so persistence is one shared, tested code path instead of four
// hand-rolled copies.
export async function loadPersisted<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function savePersisted<T>(key: string, value: T): void {
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
}
