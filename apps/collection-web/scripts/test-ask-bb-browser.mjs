import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { testAskBBBrowser } from '../tests/browser/ask-bb.mjs';

const app = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const next = require.resolve('next/dist/bin/next');
const port = 4186;
const origin = `http://localhost:${port}`;
const output = fileURLToPath(new URL('../.cache/ask-bb-browser/', import.meta.url));
const env = {
  ...process.env,
  NEXT_PUBLIC_FIREBASE_API_KEY: 'synthetic-test-key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'barrelbook-273cd.firebaseapp.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'barrelbook-273cd',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'barrelbook-273cd.appspot.com',
  NEXT_PUBLIC_FIREBASE_APP_ID: '1:123:web:synthetic-test',
  NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY: 'synthetic-test-key',
  NEXT_PUBLIC_USE_FIREBASE_EMULATORS: 'false',
  NEXT_TELEMETRY_DISABLED: '1',
  BARRELBOOK_WEB_LOCAL_STAGING: 'true'
};

const executablePath = process.env.BARRELBOOK_BROWSER_EXECUTABLE;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function capture(page, filename, demonstrate, { minimumSeconds = 0, maximumSeconds = 235, frameAllowed } = {}) {
  const fps = 5;
  const encoder = spawn('ffmpeg', [
    '-nostdin', '-loglevel', 'error', '-n', '-f', 'image2pipe', '-framerate', String(fps),
    '-c:v', 'mjpeg', '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', filename
  ], { stdio: ['pipe', 'ignore', 'inherit'] });
  const done = once(encoder, 'exit');
  // If ffmpeg fails early, capture notices the closed pipe without an unhandled stream error.
  encoder.stdin.on('error', () => {});
  let demonstrationFinished = false;
  let demonstrationError;
  const demo = demonstrate().catch(error => { demonstrationError = error; })
    .finally(() => { demonstrationFinished = true; });
  const started = performance.now();
  let frames = 0;
  try {
    while (!demonstrationFinished || frames < fps * minimumSeconds) {
      if (demonstrationError) throw demonstrationError;
      if (encoder.exitCode !== null || encoder.stdin.destroyed) throw new Error('Recording encoder stopped');
      if (performance.now() - started > maximumSeconds * 1000) throw new Error('Recording exceeded the time allowance');
      if (frameAllowed && !await frameAllowed()) throw new Error('Stopped recording after leaving the signed-in workspace');
      const image = await page.screenshot({ type: 'jpeg', quality: 77, timeout: 8000, caret: 'hide' });
      const frameTarget = Math.min(Math.ceil((performance.now() - started) * fps / 1000), frames + fps);
      do {
        if (!encoder.stdin.write(image)) await Promise.race([once(encoder.stdin, 'drain'), done]);
        frames++;
      } while (frames < frameTarget);
      await delay(Math.max(0, started + frames * 1000 / fps - performance.now()));
    }
    await demo;
    if (demonstrationError) throw demonstrationError;
  } finally {
    encoder.stdin.end();
    const [code] = await done;
    if (code !== 0) throw new Error('Recording could not be encoded');
  }
}

async function recordProduction() {
  const production = 'https://app.barrelbook.app';
  const profile = await mkdtemp(join(tmpdir(), 'barrelbook-m6-record-'));
  const context = await chromium.launchPersistentContext(profile, {
    headless: false, viewport: { width: 1280, height: 800 }, executablePath
  });
  const page = context.pages()[0] || await context.newPage();
  page.setDefaultTimeout(30_000);
  const askTab = page.getByRole('button', { name: 'Ask B.B.', exact: true });
  const question = page.getByRole('textbox', { name: 'Your question' });
  const transcript = page.getByRole('log', { name: 'Conversation' });
  const send = page.getByRole('button', { name: 'Send', exact: true });
  const target = join(output, 'ask-bb-production-' + Date.now() + '.mp4');
  try {
    await page.goto(production);
    console.log('Sign in in the opened Chrome window. Recording starts after Ask B.B. access is verified.');
    await askTab.waitFor({ timeout: 300_000 });
    await askTab.click();
    await page.waitForFunction(() => {
      const composer = document.querySelector('#ask-bb-draft');
      return composer instanceof HTMLTextAreaElement && !composer.disabled;
    });
    if (new URL(page.url()).origin !== production) throw new Error('Unexpected recording origin');
    const questions = [
      'Which opened bottle would you pick for a pour tonight?',
      'What should I pour tonight if I want something lower proof than your last recommendation?'
    ];
    await capture(page, async () => {
      await delay(12_000);
      for (const [index, prompt] of questions.entries()) {
        await question.fill(prompt);
        await delay(5000);
        await send.click();
        await transcript.locator('.ask-bb-exchange').nth(index).waitFor({ timeout: 70_000 });
        await delay(10_000);
      }
      const references = transcript.getByRole('list', { name: 'Referenced bottles' }).getByRole('button');
      let opened = false;
      for (const reference of (await references.all()).slice(0, 5)) {
        await reference.click();
        const detail = page.getByRole('dialog');
        await detail.waitFor();
        const photos = detail.getByRole('button', { name: 'View bottle photos' });
        if (await photos.isEnabled()) {
          await delay(6000);
          await photos.click();
          opened = true;
          break;
        }
        await detail.getByRole('button', { name: 'Close bottle details' }).click();
        await detail.waitFor({ state: 'hidden' });
      }
      if (!opened) throw new Error('No referenced bottle with photos was available');
      const photoGroup = page.getByRole('group', { name: 'All bottle photos' });
      const thumbnails = await photoGroup.getByRole('button').all();
      for (const thumb of thumbnails.slice(0, 3)) {
        await thumb.click();
        await page.waitForFunction(() => {
          const img = document.querySelector('.viewer-viewport img');
          return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
        });
        await delay(4500);
      }
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await delay(7000);
      await page.getByRole('button', { name: 'Close photo viewer', exact: true }).click();
      await page.getByRole('button', { name: 'Close bottle details', exact: true }).click();
      await transcript.locator('.ask-bb-exchange').nth(1).waitFor();
      await delay(10_000);
    }, {
      minimumSeconds: 124,
      frameAllowed: async () => new URL(page.url()).origin === production &&
        await page.getByRole('button', { name: 'Sign out', exact: true }).isVisible()
    });
    console.log('Production recording:', target);
  } finally {
    await context.close();
  }
}

await mkdir(output, { recursive: true });
if (process.argv.includes('--record-production')) {
  await recordProduction();
  process.exit(0);
}
if (!process.argv.includes('--reuse-build')) {
  const build = spawn(process.execPath, [next, 'build'], { cwd: app, env, stdio: 'inherit' });
  const [code] = await once(build, 'exit');
  if (code !== 0) throw new Error('Optimized build failed');
}
const server = spawn(process.execPath, [next, 'start', '--port', String(port), '--hostname', 'localhost'], {
  cwd: app, env, stdio: 'inherit'
});
let browser;
try {
  for (let attempt = 0; ; attempt++) {
    if (server.exitCode !== null) throw new Error('Local server exited');
    if (await fetch(origin).then(response => response.ok, () => false)) break;
    if (attempt === 60) throw new Error('Local server failed to start');
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  browser = await chromium.launch(process.env.BARRELBOOK_BROWSER_EXECUTABLE
    ? { executablePath: process.env.BARRELBOOK_BROWSER_EXECUTABLE } : {});
  await testAskBBBrowser({ browser, origin, output,
    capture: process.argv.includes('--verify-encoder') ? capture : undefined
  });
} finally {
  await browser?.close();
  if (server.exitCode === null) server.kill();
}
