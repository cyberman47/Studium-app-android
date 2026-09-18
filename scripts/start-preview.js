// Expo CLI has no built-in support for the PORT environment variable —
// only an explicit `-p/--port` flag (default 8081, confirmed via
// `npx expo start --help`; there's no `process.env.PORT` handling
// anywhere in @expo/cli's source). Tooling that assigns a dev-server port
// via PORT (like this project's .claude/launch.json preview wrapper)
// needs that bridged manually, which is all this script does — the real
// `npm run start` used for actual device/emulator development is left
// completely untouched and still always binds the standard 8081.
const { spawnSync } = require('child_process');

const port = process.env.PORT || '8081';
const result = spawnSync('npx', ['expo', 'start', '--port', port], {
  stdio: 'inherit',
  shell: true,
});
process.exit(result.status ?? 1);
