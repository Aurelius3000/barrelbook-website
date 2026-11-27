import { describe, expect, it } from 'vitest';
import { askBBHttpError, canAskBB, createAskBBTurn, decodeAskBBPrivacy, decodeAskBBReply, isAskBBBottleId } from '../src/lib/ask-bb';

const now = '2026-11-11T00:00:00.000Z';
const privacy = () => ({
  success: true,
  data: {
    capability: 'ask-bb-privacy-v2',
    supportedVersions: { aiDisclosure: 'ask-bb-ai-processing-v1', providerList: 'openai-2026-08-01', terms: '2026-08-01' },
    aiProcessing: { status: 'active', disclosureVersion: 'ask-bb-ai-processing-v1', providerListVersion: 'openai-2026-08-01', decidedAt: now },
    terms: { accepted: true, version: '2026-08-01', acceptedAt: now },
    improvement: { eligible: false, status: 'revoked' }
  }
});

describe('Ask B.B. web contract', () => {
  it('checks global access, beta overrides, and Pro aliases without confusing improvement eligibility', () => {
    expect(canAskBB({ sommelier_enabled: false, ask_your_shelf_enabled: true }, { planTier: 'pro' })).toBe(false);
    expect(canAskBB({ sommelier_enabled: true, ask_your_shelf_enabled: true }, {})).toBe(true);
    const beta = { sommelier_enabled: true, ask_your_shelf_beta_enabled: true };
    expect(canAskBB(beta, { planTier: 'reserve' })).toBe(true);
    expect(canAskBB(beta, { featureAccess: { askBBEnabled: true } })).toBe(true);
    expect(canAskBB(beta, { planTier: 'plus', featureAccess: { askBBReviewEligible: true } })).toBe(false);
    expect(canAskBB({ sommelier_enabled: true }, { planTier: 'pro' })).toBe(false);
  });

  it('requires current processing consent and Terms independently of optional improvement', () => {
    expect(decodeAskBBPrivacy(privacy())).toBe('ready');
    const oldProvider = privacy();
    oldProvider.data.aiProcessing.providerListVersion = 'old';
    expect(decodeAskBBPrivacy(oldProvider)).toBe('consent');
    const revoked = privacy();
    revoked.data.aiProcessing.status = 'revoked';
    expect(decodeAskBBPrivacy(revoked)).toBe('consent');
    const staleTerms = privacy();
    staleTerms.data.terms.version = 'older';
    expect(decodeAskBBPrivacy(staleTerms)).toBe('terms');
    const invalidDate = privacy();
    invalidDate.data.terms.acceptedAt = 'invalid';
    expect(decodeAskBBPrivacy(invalidDate)).toBe('terms');
    expect(() => decodeAskBBPrivacy({ success: true, data: { capability: 'unknown' } })).toThrow('malformed');
  });

  it('bounds every history entry, excludes the current question from history, and fixes the read scope', () => {
    const history = Array.from({ length: 22 }, (_, i) => ({ role: 'assistant' as const, content: i + 'a'.repeat(3100) }));
    const turn = createAskBBTurn('x'.repeat(1050), 'conversation-1', history, 's'.repeat(1250));
    expect(turn.message).toHaveLength(1000);
    expect(turn.history).toHaveLength(20);
    expect(turn.history[0].content).toMatch(/^2a/);
    expect(turn.history[0].content).toHaveLength(3000);
    expect(turn.conversationSummary).toHaveLength(1200);
    expect(turn.retrievalScopes).toEqual(['ownedCollection']);
    expect(turn.memoryMode).toBe('none');
  });

  it('keeps owned and legacy references only and does not accept executable link fields', () => {
    const reply = decodeAskBBReply({ success: true, data: {
      answer: '<script>alert(1)</script> [link](javascript:alert(1))',
      bottleRefs: [
        { id: 'owned', title: 'Owned', reason: 'A bottle', scope: 'ownedCollection', imageURL: 'https://remote.invalid' },
        { id: 'legacy', title: 'Legacy' },
        { id: 'owned', title: 'Duplicate' },
        { id: 'shared', title: 'Shared', scope: 'sharedShelves' },
        { id: '../other', title: 'Bad path' },
        { id: '..', title: 'Relative path' },
        { id: 'newline\n', title: 'Control character' }
      ]
    } });
    expect(reply.answer).toContain('<script>');
    expect(reply.bottleRefs).toEqual([
      { id: 'owned', title: 'Owned', reason: 'A bottle' },
      { id: 'legacy', title: 'Legacy', reason: '' }
    ]);
    expect(isAskBBBottleId('0'.repeat(257))).toBe(false);
    expect(() => decodeAskBBReply({ success: true, data: { answer: '', bottleRefs: [] } })).toThrow('malformed');
    expect(() => decodeAskBBReply({ success: true, data: { answer: 'valid', bottleRefs: {} } })).toThrow('malformed');
  });

  it('maps failure statuses to safe actions rather than displaying raw backend text', () => {
    expect(askBBHttpError(401, {}).reason).toBe('session');
    expect(askBBHttpError(403, {}).reason).toBe('ineligible');
    expect(askBBHttpError(429, {}).reason).toBe('limit');
    expect(askBBHttpError(504, {}).reason).toBe('timeout');
    expect(askBBHttpError(428, { code: 'terms_required' }).reason).toBe('terms');
    expect(askBBHttpError(409, { code: 'unsupported_consent_version' }).reason).toBe('consent');
    expect(askBBHttpError(500, { error: 'provider details' }).message).toBe('service');
  });
});
