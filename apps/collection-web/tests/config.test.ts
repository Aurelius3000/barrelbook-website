import { describe, expect, it } from 'vitest';
import { parseEnvironment, canEditBottle } from '../src/lib/config';

const production = { apiKey: 'public-key', projectId: 'approved-project', authDomain: 'approved-project.firebaseapp.com', storageBucket: 'approved-project.appspot.com', appId: 'web-app', appCheckSiteKey: 'public-site-key' };
const local = { ...production, projectId: 'demo-barrelbook-web', emulators: 'true' };
describe('environment boundaries', () => {
  it('fails closed for missing setup rather than silently selecting a project', () => { expect(() => parseEnvironment({}, 'production', 'app.barrelbook.app')).toThrow(); });
  it('requires App Check for hosted use', () => { expect(() => parseEnvironment({ ...production, appCheckSiteKey: '' }, 'production', 'app.barrelbook.app')).toThrow(); });
  it('never permits emulator mode in a production build', () => { expect(() => parseEnvironment(local, 'production', 'localhost')).toThrow(); });
  it('never connects emulator mode to a real project', () => { expect(() => parseEnvironment({ ...production, emulators: 'true' }, 'development', '127.0.0.1')).toThrow(); });
  it('never enables test bypass on a hosted origin', () => { expect(() => parseEnvironment(local, 'development', 'preview.example.com')).toThrow(); });
  it('permits a demo project on loopback only', () => { expect(parseEnvironment(local, 'development', '127.0.0.1').functionsOrigin).toBe('http://127.0.0.1:9501/demo-barrelbook-web/us-central1'); });
  it('derives the function host from the approved project, not a user-provided URL', () => { expect(parseEnvironment(production, 'production', 'app.barrelbook.app').functionsOrigin).toBe('https://us-central1-approved-project.cloudfunctions.net'); expect(() => parseEnvironment({ ...production, region: 'us-central1/../evil' }, 'production', 'app.barrelbook.app')).toThrow(); });
});

describe('bounded staging editing', () => {
  const id = 'web-m3-staging-qualification-20261029';
  const staging = { ...production, projectId: 'barrelbook-staging', appId: '1:560188226898:web:ea8c36fdcce8b2a4018e8b', stagingEditBottleId: id };
  it('permits only the fixture at the approved origin', () => {
    const config = parseEnvironment(staging, 'production', 'localhost', 'http://localhost:4181');
    expect(canEditBottle(config, id)).toBe(true);
    expect(canEditBottle(config, 'real-bottle')).toBe(false);
  });
  it.each(['http://localhost:4180', 'http://127.0.0.1:4181', 'https://app.barrelbook.app', ''])('disables the pilot at %s', origin => {
    expect(canEditBottle(parseEnvironment(staging, 'production', 'localhost', origin), id)).toBe(false);
  });
  it.each([{ ...staging, projectId: 'barrelbook-273cd' }, { ...staging, appId: 'other-app' }, { ...staging, stagingEditBottleId: 'real-bottle' }, { ...staging, stagingEditBottleId: '' }])('fails closed for a non-pilot configuration', env => {
    expect(canEditBottle(parseEnvironment(env, 'production', 'localhost', 'http://localhost:4181'), id)).toBe(false);
  });
});
