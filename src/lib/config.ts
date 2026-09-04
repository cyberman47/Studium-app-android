// The one deployed studium-website origin — real Terms/Privacy pages,
// and the real Gemini-backed API routes (study-plan, tutor) this app
// calls. Was duplicated as a local constant in three separate files
// (AuthScreen, studyPlanner, aichat) before this; centralized here so a
// future domain change (e.g. once the custom domain lands) is a one-line
// edit instead of a grep-and-replace.
export const WEBSITE_URL = 'https://studium-website-three.vercel.app';
