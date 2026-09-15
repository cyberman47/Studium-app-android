# Studium Mobile

**The Android/iOS companion app for [Studium](https://studium-website-three.vercel.app)** — an AI-assisted study platform for medical, nursing, and pre-health students, built with Expo and React Native.

This app shares its Supabase backend with the [Studium web app](https://github.com/cyberman47/studium-website) — the same accounts, progress, and content, on your phone.

![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?logo=supabase&logoColor=white)

---

## What it does

A mobile-native front end onto the same real Studium backend — sign in with your existing account and pick up right where the web app left off.

- **Study** — lesson content, courses, and a track-aware Study Planner
- **Practice & Review** — on-demand question drills and spaced-repetition flashcard review
- **Anatomy** — the standalone anatomy flashcard library
- **Terminology & Vocabulary** — medical term lookup and review
- **Daily Case** — the applied clinical-reasoning case of the day
- **Progress & Leaderboard** — Knowledge Points, streaks, and real cross-student rankings
- **Community** — Forum, Challenges, Study Groups, and a public student Passport profile
- **Studium AI** — an in-app AI chat assistant
- **Create** — build your own study content on the go

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev/) 57, [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing), React 19, React Native 0.86 |
| Language | TypeScript (strict) |
| Backend | [Supabase](https://supabase.com/) — shared with the Studium web app (Postgres, Auth, Row-Level Security) |
| Local storage | `@react-native-async-storage/async-storage` |
| UI | `expo-image`, `expo-linear-gradient`, `expo-glass-effect`, `react-native-reanimated`, `react-native-svg` |

## Getting started

```bash
git clone https://github.com/cyberman47/Studium-app-android.git
cd Studium-app-android
npm install
```

Create a `.env.local` with the same Supabase project the web app uses:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Then start the app:

```bash
npx expo start
```

From the Expo CLI output you can open the project in:
- an Android emulator (`npm run android`)
- an iOS simulator (`npm run ios`, macOS only)
- [Expo Go](https://expo.dev/go) on a physical device
- a web browser (`npm run web`)

## Project structure

```
src/
  app/            Expo Router routes (file-based) — tabs, track, student, library screens
  features/       One folder per feature area: dashboard, learn, practice, review,
                   terminology, anatomy, forum, challenges, study-groups,
                   study-planner, leaderboard, passport, aichat, dailycase...
  components/     Shared UI components
  lib/            Supabase client and shared data/business logic
  hooks/          Shared React hooks
  constants/      App-wide constants
android/          Native Android project (generated/managed by Expo)
```

## License

MIT
