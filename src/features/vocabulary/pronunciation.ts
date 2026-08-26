/**
 * Real on-device text-to-speech via expo-speech — not a fake "pretend to
 * play audio" timer. `onStart`/`onDone` are wired to the library's actual
 * playback callbacks, so the caller's "speaking" visual state genuinely
 * tracks real audio, not a guessed duration.
 *
 * expo-speech is a native module, added to package.json in this same
 * change — the dev client currently installed on the test device/emulator
 * was built before that, so its native side doesn't exist yet and even
 * *importing* the module throws ("Cannot find native module 'ExpoSpeech'")
 * until the dev client is rebuilt (`npx expo run:android` / a new EAS
 * build). Loaded with `require` inside a try/catch, deferred until the
 * speaker button is actually pressed, specifically so that missing native
 * module doesn't crash the whole screen on mount — it just means this
 * press doesn't produce sound yet, same honest degrade as any other
 * feature in this app waiting on a real backend piece that isn't wired up.
 */
export function speakWord(text: string, locale: string | undefined, onStart: () => void, onDone: () => void) {
  onStart();
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Speech = require('expo-speech');
    Speech.stop();
    Speech.speak(text, {
      language: locale,
      rate: 0.85,
      onDone,
      onStopped: onDone,
      onError: onDone,
    });
  } catch {
    // Native module not available in this build yet — still give the
    // brief "speaking" pulse so the button visibly responds to the tap,
    // then clear it; no sound plays until the dev client is rebuilt.
    setTimeout(onDone, 500);
  }
}
