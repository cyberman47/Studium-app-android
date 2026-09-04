import { useSyncExternalStore } from 'react';

/**
 * Chat sessions (history) and the small set of Chat/AI settings that
 * actually affect chat behavior — same plain useSyncExternalStore pattern
 * as features/profile/store.ts and features/mycontent/store.ts. A
 * "session" is created the moment a conversation gets its first message
 * (an empty, not-yet-started chat isn't saved), and re-saved after every
 * reply so the clock icon's history list always reflects real
 * conversations, not placeholders.
 */

export type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  // True while a reply is still streaming in from the real /api/tutor
  // call — lets the bubble show a live typing indicator (empty text) or
  // growing text instead of popping in atomically.
  streaming?: boolean;
  // True if `text` is a genuine failure notice (network/rate-limit/server
  // error), not a model reply — kept visually distinct so it's never
  // mistaken for real tutoring content.
  error?: boolean;
};

export type ChatSession = {
  id: string;
  title: string;
  lessonTitle?: string;
  messages: ChatMessage[];
  updatedAt: number;
};

export type ResponseStyle = 'concise' | 'detailed';

type AISettings = {
  responseStyle: ResponseStyle;
  autoAttachLesson: boolean;
};

type ChatSettings = {
  saveHistory: boolean;
};

type State = {
  sessions: ChatSession[];
  aiSettings: AISettings;
  chatSettings: ChatSettings;
};

let state: State = {
  sessions: [],
  aiSettings: { responseStyle: 'detailed', autoAttachLesson: false },
  chatSettings: { saveHistory: true },
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useChatSessions(): ChatSession[] {
  return useSyncExternalStore(subscribe, () => state.sessions);
}

export function useAISettings(): AISettings {
  return useSyncExternalStore(subscribe, () => state.aiSettings);
}

export function useChatSettings(): ChatSettings {
  return useSyncExternalStore(subscribe, () => state.chatSettings);
}

export function getSession(id: string): ChatSession | undefined {
  return state.sessions.find((s) => s.id === id);
}

export function upsertSession(session: ChatSession) {
  const exists = state.sessions.some((s) => s.id === session.id);
  state = {
    ...state,
    sessions: exists
      ? state.sessions.map((s) => (s.id === session.id ? session : s))
      : [session, ...state.sessions],
  };
  emit();
}

export function deleteSession(id: string) {
  state = { ...state, sessions: state.sessions.filter((s) => s.id !== id) };
  emit();
}

export function clearAllSessions() {
  state = { ...state, sessions: [] };
  emit();
}

export function updateAISettings(patch: Partial<AISettings>) {
  state = { ...state, aiSettings: { ...state.aiSettings, ...patch } };
  emit();
}

export function updateChatSettings(patch: Partial<ChatSettings>) {
  state = { ...state, chatSettings: { ...state.chatSettings, ...patch } };
  emit();
}
