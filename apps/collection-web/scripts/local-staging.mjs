// Approved staging configuration is read by Node's --env-file, never by source code.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const command = process.argv[2];
if (!['dev', 'build', 'start'].includes(command) || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'barrelbook-staging' || process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'false') throw new Error('This launcher requires the approved staging environment.');
const args = [fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url)), command];
if (command !== 'build') args.push('--port', '4181', '--hostname', 'localhost');
const child = spawn(process.execPath, args, {
  cwd: fileURLToPath(new URL('..', import.meta.url)), stdio: 'inherit',
  env: { ...process.env, BARRELBOOK_WEB_LOCAL_STAGING: 'true', NEXT_TELEMETRY_DISABLED: '1' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 0));
