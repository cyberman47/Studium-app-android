// Real streaming client for the same /api/tutor endpoint studium-website's
// own AI Tutor calls (lib/tutorChat.ts there) — same Gemini backend, same
// request/response contract. Uses `expo/fetch` rather than the global
// `fetch`: Hermes/React Native's built-in fetch doesn't expose a readable
// `response.body` stream, so a plain `await res.text()` would only ever
// resolve once the whole reply is done, no live typing effect. `expo/fetch`
// (bundled with Expo SDK, confirmed present in this project's installed
// expo package) implements the standard body ReadableStream instead.
import { fetch as expoFetch } from 'expo/fetch';

import { WEBSITE_URL } from './config';

export type TutorMode = 'tutor' | 'deepdive' | 'simplify';

export type TutorContext = {
  sectionName: string;
  subjectName: string;
  lessonTitle: string;
  lessonId: string;
  currentStep: string;
  currentFlashcard?: { front: string; back: string } | null;
  currentPracticeQuestion?: { question: string; studentAnswer: string | null } | null;
  recentMistakes: string[];
  studentLevel: string;
  currentTrack?: string;
  currentOnScreenText?: string | null;
};

export type TutorHistoryTurn = { role: 'user' | 'assistant'; text: string };

export type StreamTutorReplyResult = { ok: true } | { ok: false; error: string };

// Streams a reply for one message, calling `onChunk` with the accumulated
// text so far every ~60ms (same throttle the website uses — frequent
// enough to read as live typing, infrequent enough not to thrash React
// state on every few-byte chunk). Resolves once the stream ends or fails;
// never throws — failures come back as a real, honest error string via
// the result, same as every other AI call in this app.
export async function streamTutorReply(params: {
  message: string;
  mode: TutorMode;
  context: TutorContext;
  history: TutorHistoryTurn[];
  onChunk: (textSoFar: string) => void;
}): Promise<StreamTutorReplyResult> {
  const { message, mode, context, history, onChunk } = params;

  let res: Awaited<ReturnType<typeof expoFetch>>;
  try {
    res = await expoFetch(`${WEBSITE_URL}/api/tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, mode, context, history }),
    });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "The AI Tutor couldn't reply just now—check your connection and try again." };
  }

  if (!res.ok || !res.body) {
    let errorText = "The AI Tutor couldn't reply just now. Please try again.";
    try {
      const data = await res.json();
      if (typeof data?.error === 'string') errorText = data.error;
    } catch {
      // Non-JSON error body — fall back to the generic message above.
    }
    return { ok: false, error: errorText };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let lastFlush = 0;
  const FLUSH_INTERVAL_MS = 60;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      const now = Date.now();
      if (now - lastFlush >= FLUSH_INTERVAL_MS) {
        onChunk(text);
        lastFlush = now;
      }
    }
    text += decoder.decode();
    onChunk(text);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'The response was interrupted—please try again.' };
  }
}
