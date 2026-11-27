export interface WebEnvironment {
  apiKey?: string; authDomain?: string; projectId?: string; storageBucket?: string;
  appId?: string; region?: string; appCheckSiteKey?: string; emulators?: string; stagingEditBottleId?: string; stagingPilot?: string; localBottleEditing?: string;
}

export interface WebConfig {
  firebase: { apiKey: string; authDomain: string; projectId: string; storageBucket: string; appId: string };
  functionsOrigin: string;
  appCheckSiteKey: string;
  emulators: boolean;
  localEditingEnabled?: boolean;
  pilotRequired?: boolean;
  stagingEditBottleId?: string;
}

export class ConfigurationError extends Error {
  constructor() { super('The web workspace is not configured yet.'); this.name = 'ConfigurationError'; }
}

export function parseEnvironment(env: WebEnvironment, mode: string, hostname: string, origin = ''): WebConfig {
  const { apiKey, authDomain, projectId, storageBucket, appId } = env;
  if (![apiKey, authDomain, projectId, storageBucket, appId].every(v => typeof v === 'string' && v.trim().length > 0)) throw new ConfigurationError();
  if (!/^[a-z0-9-]+$/.test(projectId!) || !/^[a-z0-9.-]+$/.test(authDomain!) || !/^[a-z0-9.-]+$/.test(storageBucket!)) throw new ConfigurationError();
  const region = env.region || 'us-central1';
  if (!/^[a-z]+-[a-z]+[0-9]+$/.test(region)) throw new ConfigurationError();
  const emulators = env.emulators === 'true';
  if (emulators && (mode === 'production' || !projectId!.startsWith('demo-') || !['localhost', '127.0.0.1', '::1', '[::1]'].includes(hostname))) throw new ConfigurationError();
  if (!emulators && (!env.appCheckSiteKey?.trim() || projectId!.startsWith('demo-'))) throw new ConfigurationError();
  const pilotRequired = projectId === 'barrelbook-273cd' || (projectId === 'barrelbook-staging' && env.stagingPilot === 'true');
  return {
    firebase: { apiKey: apiKey!, authDomain: authDomain!, projectId: projectId!, storageBucket: storageBucket!, appId: appId! },
    functionsOrigin: emulators ? `http://127.0.0.1:9501/${projectId}/${region}` : `https://${region}-${projectId}.cloudfunctions.net`,
    appCheckSiteKey: env.appCheckSiteKey || '', emulators,
    localEditingEnabled: emulators && env.localBottleEditing === 'true',
    ...(pilotRequired ? { pilotRequired: true } : {}),
    ...(!pilotRequired && projectId === 'barrelbook-staging' && appId === '1:560188226898:web:ea8c36fdcce8b2a4018e8b'
      && hostname === 'localhost' && origin === 'http://localhost:4181' && !emulators
      && env.stagingEditBottleId === 'web-m3-staging-qualification-20261029'
      ? { stagingEditBottleId: env.stagingEditBottleId } : {}),
  };
}

export function canEditBottle(config: WebConfig, bottleId: string): boolean {
  if (config.pilotRequired) return false;
  return (config.emulators && config.localEditingEnabled === true) || (config.firebase.projectId === 'barrelbook-staging'
    && config.firebase.appId === '1:560188226898:web:ea8c36fdcce8b2a4018e8b'
    && config.stagingEditBottleId === 'web-m3-staging-qualification-20261029'
    && bottleId === config.stagingEditBottleId);
}

// Explicit property access is required for Next.js public-environment substitution.
export function browserEnvironment(): WebEnvironment {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    region: process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION,
    appCheckSiteKey: process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY,
    emulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS,
    localBottleEditing: process.env.NEXT_PUBLIC_LOCAL_BOTTLE_EDITING,
    stagingEditBottleId: process.env.NEXT_PUBLIC_STAGING_EDIT_BOTTLE_ID,
    stagingPilot: process.env.NEXT_PUBLIC_BARRELBOOK_STAGING_PILOT,
  };
}
