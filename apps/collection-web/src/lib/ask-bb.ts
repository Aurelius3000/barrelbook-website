export const ASK_BB_MESSAGE_LIMIT = 1000;
const HISTORY_LIMIT = 20;
const HISTORY_CONTENT_LIMIT = 3000;
const SUMMARY_LIMIT = 1200;

export type AskBBMessage = { role: 'user' | 'assistant'; content: string };
export type AskBBReference = { id: string; title: string; reason: string };
export type AskBBReply = { answer: string; bottleRefs: AskBBReference[]; conversationSummary: string };
export type AskBBAccess = 'ready' | 'ineligible' | 'consent' | 'terms';
export type AskBBEndpoint = 'askBBTurn' | 'getAskBBPrivacyStatus';
type AskBBFailure = AskBBAccess | 'session' | 'limit' | 'offline' | 'timeout' | 'malformed' | 'service';

export class AskBBError extends Error {
  constructor(readonly reason: Exclude<AskBBFailure, 'ready'>) {
    super(reason);
    this.name = 'AskBBError';
  }
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function boundedText(value: unknown, limit: number) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

export function isAskBBBottleId(id: unknown): id is string {
  return typeof id === 'string' && id.length > 0 && id.length <= 256 && id === id.trim() &&
    id !== '.' && id !== '..' && !/[/\u0000-\u001f\u007f]/.test(id);
}

export function canAskBB(rawFlags: unknown, rawProfile: unknown) {
  const flags = object(rawFlags), profile = object(rawProfile);
  const access = object(profile.featureAccess);
  const pro = typeof profile.planTier === 'string' && ['pro', 'collector', 'reserve'].includes(profile.planTier.toLowerCase());
  return flags.sommelier_enabled === true &&
    (flags.ask_your_shelf_enabled === true ||
      (flags.ask_your_shelf_beta_enabled === true && (access.askBBEnabled === true || pro)));
}

function responseData(payload: unknown) {
  const envelope = object(payload);
  const data = object(envelope.data);
  if (envelope.success !== true || !Object.keys(data).length) throw new AskBBError('malformed');
  return data;
}

function validTimestamp(value: unknown) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function decodeAskBBPrivacy(payload: unknown): Exclude<AskBBAccess, 'ineligible'> {
  const data = responseData(payload);
  const versions = object(data.supportedVersions), ai = object(data.aiProcessing), terms = object(data.terms);
  if (data.capability !== 'ask-bb-privacy-v2' || versions.aiDisclosure !== 'ask-bb-ai-processing-v1' ||
      versions.providerList !== 'openai-2026-08-01' || versions.terms !== '2026-08-01' ||
      typeof ai.status !== 'string' || typeof terms.accepted !== 'boolean') {
    throw new AskBBError('malformed');
  }
  if (ai.status !== 'active' || ai.disclosureVersion !== versions.aiDisclosure ||
      ai.providerListVersion !== versions.providerList || !validTimestamp(ai.decidedAt)) return 'consent';
  if (terms.accepted !== true || terms.version !== versions.terms || !validTimestamp(terms.acceptedAt)) return 'terms';
  return 'ready';
}

export function createAskBBTurn(message: string, conversationId: string, history: readonly AskBBMessage[], summary: string) {
  return {
    message: boundedText(message, ASK_BB_MESSAGE_LIMIT),
    conversationId,
    history: history.slice(-HISTORY_LIMIT).map(entry => ({
      role: entry.role,
      content: boundedText(entry.content, HISTORY_CONTENT_LIMIT)
    })),
    conversationSummary: boundedText(summary, SUMMARY_LIMIT),
    retrievalScopes: ['ownedCollection'] as const,
    memoryMode: 'none' as const
  };
}

export type AskBBTurn = ReturnType<typeof createAskBBTurn>;

export function decodeAskBBReply(payload: unknown): AskBBReply {
  const data = responseData(payload);
  const answer = boundedText(data.answer, 20_000);
  if (!answer || (data.bottleRefs != null && !Array.isArray(data.bottleRefs))) throw new AskBBError('malformed');
  const references = Array.isArray(data.bottleRefs) ? data.bottleRefs : [];
  const seen = new Set<string>();
  const bottleRefs: AskBBReference[] = [];
  for (const value of references.slice(0, 30)) {
    const ref = object(value);
    const title = boundedText(ref.title, 240);
    // Legacy owned-only pour replies omit scope. The owner document is verified on open.
    if (!isAskBBBottleId(ref.id) || (ref.scope != null && ref.scope !== 'ownedCollection') ||
        !title || seen.has(ref.id)) continue;
    seen.add(ref.id);
    bottleRefs.push({ id: ref.id, title, reason: boundedText(ref.reason, 500) });
  }
  return { answer, bottleRefs, conversationSummary: boundedText(data.conversationSummary, SUMMARY_LIMIT) };
}

export function askBBHttpError(status: number, payload: unknown) {
  const code = object(payload).code;
  if (status === 401) return new AskBBError('session');
  if (status === 403) return new AskBBError('ineligible');
  if (status === 402 || status === 429) return new AskBBError('limit');
  if (status === 408 || status === 504) return new AskBBError('timeout');
  if (status === 409 && code === 'unsupported_consent_version') return new AskBBError('consent');
  if (status === 428 && code === 'consent_required') return new AskBBError('consent');
  if (status === 428 && code === 'terms_required') return new AskBBError('terms');
  return new AskBBError('service');
}

export function askBBErrorMessage(error: unknown) {
  const reason = error instanceof AskBBError ? error.reason : 'service';
  return {
    ineligible: 'Ask B.B. isn’t available for this account right now.',
    consent: 'Open Ask B.B. in the iPhone app to review AI processing consent, then recheck access here.',
    terms: 'Review the current Ask B.B. Terms in the iPhone app, then recheck access here.',
    session: 'Your session could not be verified. Sign out and sign in again.',
    limit: 'You’ve reached your Ask B.B. limit. Try again after it resets.',
    offline: 'You’re offline. Reconnect and try again.',
    timeout: 'Ask B.B. took too long to respond. You can retry when you’re ready.',
    malformed: 'Ask B.B. returned a response we couldn’t read. Try again later.',
    service: 'Ask B.B. couldn’t complete the request. Try again in a moment.'
  }[reason];
}
