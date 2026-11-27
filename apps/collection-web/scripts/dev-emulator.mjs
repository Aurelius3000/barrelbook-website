// Explicit local-test entry point; never selected automatically by the production app.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const child = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url)), 'dev', '--port', '4180', '--hostname', '127.0.0.1'], {
  cwd: fileURLToPath(new URL('..', import.meta.url)), stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_FIREBASE_API_KEY: 'local-emulator-key',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'demo-barrelbook-web.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'demo-barrelbook-web',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'demo-barrelbook-web.appspot.com',
    NEXT_PUBLIC_FIREBASE_APP_ID: '1:123456:web:local-tests',
    NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION: 'us-central1',
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: 'true',
    NEXT_TELEMETRY_DISABLED: '1',
  },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 0));
