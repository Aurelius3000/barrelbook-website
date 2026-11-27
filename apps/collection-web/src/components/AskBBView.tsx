'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, MessageCircle, Plus, Send } from 'lucide-react';
import { ASK_BB_MESSAGE_LIMIT, AskBBError, askBBErrorMessage, createAskBBTurn, type AskBBAccess, type AskBBMessage, type AskBBReference, type AskBBReply } from '../lib/ask-bb';
import { isSessionError, readAskBBAccess, readAskBBBottle, sendAskBBTurn, type Runtime } from '../lib/firebase';
import type { BottleRecord } from '../lib/records';

const STARTERS = [
  'Which opened bottle would you pick for a pour tonight?',
  'Which of my bottles are highest proof?',
  'Suggest a tasting from bottles I already own.'
];

type Exchange = { question: string; reply: AskBBReply };
type Props = {
  runtime: Runtime;
  uid: string;
  active: boolean;
  modalOpen: boolean;
  online: boolean;
  accountPanel: ReactNode;
  onOpenBottle: (bottle: BottleRecord) => void;
  onSessionLost: () => void;
};

export default function AskBBView({ runtime, uid, active, modalOpen, online, accountPanel, onOpenBottle, onSessionLost }: Props) {
  const [access, setAccess] = useState<AskBBAccess | 'checking' | 'unavailable'>('checking');
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState('');
  const [failedTurn, setFailedTurn] = useState(false);
  const [referenceStatus, setReferenceStatus] = useState<{ key: string; state: 'loading' | 'unavailable' } | null>(null);

  const composer = useRef<HTMLTextAreaElement>(null);
  const conversation = useRef<string | null>(null);
  const turnRequest = useRef<AbortController | null>(null);
  const accessRequest = useRef<AbortController | null>(null);
  const bottleRequest = useRef<AbortController | null>(null);
  const checking = access === 'checking';

  const recheck = useCallback(async () => {
    accessRequest.current?.abort();
    const request = new AbortController();
    accessRequest.current = request;
    setAccess('checking');
    setFailure('');
    try {
      const result = await readAskBBAccess(runtime, uid, request.signal);
      if (!request.signal.aborted) setAccess(result);
    } catch (error) {
      if (request.signal.aborted) return;
      if (isSessionError(error) || (error instanceof AskBBError && error.reason === 'session')) {
        onSessionLost();
        return;
      }
      setAccess('unavailable');
      setFailure(askBBErrorMessage(error));
    } finally {
      if (accessRequest.current === request) accessRequest.current = null;
    }
  }, [runtime, uid, onSessionLost]);

  useEffect(() => {
    if (!active) {
      bottleRequest.current?.abort();
      return;
    }
    // The visibility change schedules a fresh read without removing the conversation.
    let activeEffect = true;
    void Promise.resolve().then(() => {
      if (!activeEffect) return;
      setReferenceStatus(previous => previous?.state === 'loading' ? null : previous);
      if (!turnRequest.current) void recheck();
    });
    return () => {
      activeEffect = false;
      accessRequest.current?.abort();
      bottleRequest.current?.abort();
    };
  }, [active, recheck]);

  useEffect(() => () => turnRequest.current?.abort(), []);

  function newConversation() {
    if (turnRequest.current) return;
    bottleRequest.current?.abort();
    conversation.current = null;
    setExchanges([]);
    setDraft('');
    setFailure('');
    setFailedTurn(false);
    setReferenceStatus(null);
    composer.current?.focus();
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    const question = draft.trim();
    if (!question || turnRequest.current || access !== 'ready' || !online) return;

    const request = new AbortController();
    turnRequest.current = request;
    conversation.current ??= crypto.randomUUID();
    setPending(true);
    setFailedTurn(false);
    setFailure('');
    const history = exchanges.flatMap<AskBBMessage>(({ question, reply }) => [
      { role: 'user', content: question }, { role: 'assistant', content: reply.answer }
    ]);
    const turn = createAskBBTurn(question, conversation.current, history, exchanges.at(-1)?.reply.conversationSummary ?? '');
    try {
      const reply = await sendAskBBTurn(runtime, uid, turn, request.signal);
      if (request.signal.aborted) return;
      setExchanges(previous => [...previous, { question, reply }]);
      setDraft('');
    } catch (error) {
      if (request.signal.aborted) return;
      const reason = error instanceof AskBBError ? error.reason : null;
      if (isSessionError(error) || reason === 'session') { onSessionLost(); return; }
      if (reason === 'terms' || reason === 'consent' || reason === 'ineligible') setAccess(reason);
      setFailure(askBBErrorMessage(error));
      setFailedTurn(true);
    } finally {
      if (turnRequest.current === request) turnRequest.current = null;
      if (!request.signal.aborted) setPending(false);
    }
  }

  async function openBottle(ref: AskBBReference, key: string, trigger: HTMLButtonElement) {
    bottleRequest.current?.abort();
    const request = new AbortController();
    bottleRequest.current = request;
    setReferenceStatus({ key, state: 'loading' });
    try {
      const bottle = await readAskBBBottle(runtime, uid, ref.id, request.signal);
      if (request.signal.aborted) return;
      if (!bottle) { setReferenceStatus({ key, state: 'unavailable' }); return; }
      trigger.focus({ preventScroll: true });
      setReferenceStatus(null);
      onOpenBottle(bottle);
    } catch {
      if (!request.signal.aborted) setReferenceStatus({ key, state: 'unavailable' });
    }
  }

  const accessMessage = access === 'ineligible' || access === 'consent' || access === 'terms'
    ? askBBErrorMessage(new AskBBError(access)) : '';
  const composerDisabled = access !== 'ready' || pending || !online;

  return <main className="workspace-main ask-bb" hidden={!active} inert={modalOpen}>
    {active && accountPanel}
    <div className="ask-bb-heading">
      <div>
        <h1>Ask B.B.</h1>
        <p>Ask a question about the bottles on your shelf.</p>
      </div>
      <button className="button secondary" type="button" disabled={pending || (!draft && !exchanges.length)} onClick={newConversation}>
        <Plus size={16} />New conversation
      </button>
    </div>

    <div className="ask-bb-panel">
      {!exchanges.length && <section className="ask-bb-welcome" aria-labelledby="ask-bb-welcome">
        <MessageCircle size={24} aria-hidden="true" />
        <h2 id="ask-bb-welcome">What’s on your mind?</h2>
        <div className="ask-bb-starters">
          {STARTERS.map(question => <button key={question} type="button" disabled={composerDisabled} onClick={() => { setDraft(question); setFailedTurn(false); composer.current?.focus(); }}>
            {question}<ArrowRight size={14} aria-hidden="true" />
          </button>)}
        </div>
      </section>}

      <div role="log" aria-label="Conversation" aria-live="polite" className="ask-bb-transcript">
        {exchanges.map(({ question, reply }, index) => <article className="ask-bb-exchange" key={index}>
          <p className="ask-bb-question"><span className="sr-only">You: </span>{question}</p>
          <div className="ask-bb-reply">
            <h2>Ask B.B.</h2>
            <p>{reply.answer}</p>
            {reply.bottleRefs.length > 0 && <ul aria-label="Referenced bottles" className="ask-bb-references">
              {reply.bottleRefs.map(ref => {
                const key = `${index}:${ref.id}`;
                const status = referenceStatus?.key === key ? referenceStatus.state : null;
                return <li key={ref.id}>
                  <button type="button" aria-busy={status === 'loading'} onClick={event => void openBottle(ref, key, event.currentTarget)}>
                    <span><strong>{ref.title}</strong>{ref.reason && <small>{ref.reason}</small>}</span><ArrowRight size={15} aria-hidden="true" />
                  </button>
                  {status === 'loading' && <small role="status">Checking this bottle…</small>}
                  {status === 'unavailable' && <small role="status">This bottle is unavailable in your collection.</small>}
                </li>;
              })}
            </ul>}
          </div>
        </article>)}
      </div>

      <form className="ask-bb-composer" onSubmit={event => void send(event)}>
        <p role="status" className="ask-bb-status">
          {checking ? 'Checking Ask B.B. access…' : pending ? 'Ask B.B. is thinking…' : !online ? 'You’re offline. Reconnect to send your question.' : accessMessage}
        </p>
        {failure && failure !== accessMessage && <p className="ask-bb-error" role="alert">{failure}</p>}
        {!checking && access !== 'ready' && <button className="text-button" type="button" disabled={pending || !online} onClick={() => void recheck()}>Recheck access</button>}
        <label htmlFor="ask-bb-draft">Your question</label>
        <textarea ref={composer} id="ask-bb-draft" name="question" rows={3} maxLength={ASK_BB_MESSAGE_LIMIT}
          value={draft} disabled={access !== 'ready' || pending}
          placeholder="Ask about your collection…"
          onChange={event => { setDraft(event.target.value); setFailedTurn(false); }} />
        <div className="ask-bb-actions">
          <small>{draft.length.toLocaleString()} / {ASK_BB_MESSAGE_LIMIT.toLocaleString()}</small>
          <button className="button primary" type="submit" disabled={composerDisabled || !draft.trim()}>
            <Send size={16} aria-hidden="true" />{failedTurn ? 'Retry' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  </main>;
}
