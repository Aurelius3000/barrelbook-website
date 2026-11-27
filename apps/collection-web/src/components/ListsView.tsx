'use client';

import { ArrowLeft, ArrowRight, BookOpen, List, RefreshCw, Smartphone } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Runtime } from '../lib/firebase';
import { displayedItemCount, readLinkedBottle, readListItems, readLists, type BottleList, type ListKind } from '../lib/lists';
import type { BottleRecord } from '../lib/records';

type Reader<T> = (signal: AbortSignal) => Promise<T>;
type ReadResult<T> = { kind: 'ready'; value: T } | { kind: 'error' };

function useRead<T>(reader: Reader<T> | null) {
  const [attempt, setAttempt] = useState(0);
  const [completed, setCompleted] = useState<{ reader: Reader<T>; attempt: number; result: ReadResult<T> }>();
  useEffect(() => {
    if (!reader) return;
    const controller = new AbortController();
    const publish = (result: ReadResult<T>) => {
      if (!controller.signal.aborted) setCompleted({ reader, attempt, result });
    };
    void reader(controller.signal).then(value => publish({ kind: 'ready', value }), () => publish({ kind: 'error' }));
    return () => controller.abort();
  }, [reader, attempt]);
  const result = completed?.reader === reader && completed.attempt === attempt ? completed.result : undefined;
  return { result, retry: () => setAttempt(previous => previous + 1) };
}

const kinds: { kind: ListKind; label: string }[] = [{ kind: 'want', label: 'Want' }, { kind: 'tried', label: 'Tried' }];
const countLabel = (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`;

function Loading({ children }: { children: string }) {
  return <div className="loading-state" role="status"><RefreshCw className="spinning" /><p>{children}</p></div>;
}

function Notice({ title, children, onRetry }: { title: string; children?: string; onRetry?: () => void }) {
  return <section className="empty-state">
    <List aria-hidden="true" />
    <h2>{title}</h2>
    {children && <p>{children}</p>}
    {onRetry && <button type="button" className="button secondary" onClick={onRetry}>Try again</button>}
  </section>;
}

interface ListsViewProps {
  runtime: Runtime;
  uid: string;
  listId: string | null;
  itemId: string | null;
  accountPanel: ReactNode;
  onOpenList: (id: string) => void;
  onCloseList: () => void;
  onOpenItem: (id: string) => void;
  renderBottle: (bottle: BottleRecord) => ReactNode;
}

export default function ListsView(props: ListsViewProps) {
  const { runtime, uid, listId, onOpenList, onCloseList } = props;
  const load = useCallback((signal: AbortSignal) => readLists(runtime, uid, signal), [runtime, uid]);
  const { result, retry } = useRead(load);
  const lists = result?.kind === 'ready' ? result.value : undefined;
  const selected = lists?.records.find(list => list.id === listId);
  if (selected) return <ListDetails key={selected.id} {...props} list={selected} />;

  return <main className="workspace-main lists-main" aria-labelledby="lists-title">
    {props.accountPanel}
    <header className="collection-heading lists-heading">
      <h1 id="lists-title">Lists</h1>
      {lists && <button type="button" className="button secondary" onClick={retry}><RefreshCw size={15} />Refresh</button>}
    </header>
    {!result ? <Loading>Loading your lists…</Loading>
      : result.kind === 'error' ? <Notice title="Couldn’t load your lists" onRetry={retry}>Check your connection and try again.</Notice>
      : lists === null ? <Notice title="Lists are unavailable for this account" onRetry={retry} />
      : lists && <>
        {lists.partial && <p className="lists-notice" role="status">Some lists couldn’t be displayed.</p>}
        {listId ? <Notice title="This list is unavailable" />
          : lists.records.length === 0 ? !lists.partial && <Notice title="No lists yet">Your Want and Tried lists from the iPhone app will appear here.</Notice>
          : <div className="lists-index">
            {kinds.map(({ kind, label }) => {
              const group = lists.records.filter(list => list.kind === kind);
              return <section key={kind} aria-labelledby={`lists-${kind}`}>
                <h2 id={`lists-${kind}`}>{label}</h2>
                {group.length === 0 ? <p className="lists-empty-group">No {label} lists yet.</p>
                  : <ul className="lists-rows">{group.map(list => <li key={list.id}>
                    <button type="button" className="list-index-row" onClick={() => onOpenList(list.id)}>
                      <span className="list-row-copy"><strong>{list.name}</strong>{list.description && <span>{list.description}</span>}</span>
                      <span className="list-row-count">{countLabel(list.itemCount)}</span>
                      <ArrowRight size={17} aria-hidden="true" />
                    </button>
                  </li>)}</ul>}
              </section>;
            })}
          </div>}
        {listId && <button type="button" className="button secondary" onClick={onCloseList}><ArrowLeft size={16} />All lists</button>}
      </>}
  </main>;
}

function ListDetails({ runtime, uid, list, itemId, accountPanel, onCloseList, onOpenItem, renderBottle }: ListsViewProps & { list: BottleList }) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus({ preventScroll: true }); }, []);
  const load = useCallback((signal: AbortSignal) => readListItems(runtime, uid, list, signal), [runtime, uid, list]);
  const { result, retry } = useRead(load);
  const items = result?.kind === 'ready' ? result.value : undefined;
  const item = items?.records.find(entry => entry.id === itemId && entry.linkedBottleId);
  const loadBottle = useCallback((signal: AbortSignal) => item ? readLinkedBottle(runtime, uid, item, signal) : Promise.resolve(null), [runtime, uid, item]);
  const linked = useRead(item ? loadBottle : null);
  const bottle = linked.result?.kind === 'ready' ? linked.result.value : null;
  const count = displayedItemCount(list, items);

  return <>
    <main className="workspace-main lists-main" aria-labelledby="list-title" inert={!!bottle}>
      {accountPanel}
      <button type="button" className="text-button lists-back" onClick={onCloseList}><ArrowLeft size={17} />All lists</button>
      <header className="collection-heading lists-heading">
        <div>
          <span className="eyebrow">{list.kind === 'want' ? 'Want' : 'Tried'}</span>
          <h1 id="list-title" ref={title} tabIndex={-1}>{list.name}</h1>
          {list.description && <p>{list.description}</p>}
          {count !== null && <p className="list-count">{countLabel(count)}</p>}
        </div>
      </header>
      {!result ? <Loading>Loading list items…</Loading>
        : result.kind === 'error' ? <Notice title="Couldn’t load this list" onRetry={retry}>Check your connection and try again.</Notice>
        : items && <>
          {items.partial && <p className="lists-notice" role="status">Some entries couldn’t be displayed.</p>}
          {!items.records.length ? !items.partial && <Notice title="This list is empty">Items added in the iPhone app will appear here.</Notice>
            : <ul className="lists-rows list-items">{items.records.map(entry => {
              const selected = item?.id === entry.id;
              const unavailable = selected && linked.result && !bottle;
              return <li key={entry.id} className="list-item">
                <div className="list-item-heading">
                  <div><h2>{entry.name}</h2>{(entry.brand || entry.bottleType) && <p>{[entry.brand, entry.bottleType].filter(Boolean).join(' · ')}</p>}</div>
                  {entry.linkedBottleId && <button type="button" className="button secondary"
                    aria-label={`Open in Collection: ${entry.name}`}
                    onClick={event => {
                      event.currentTarget.focus({ preventScroll: true });
                      if (selected) linked.retry();
                      else onOpenItem(entry.id);
                    }}>
                    <BookOpen size={15} />Open in Collection
                  </button>}
                </div>
                {entry.fields.length > 0 && <dl className="list-item-fields">{entry.fields.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
                {selected && !linked.result && <p className="lists-notice" role="status">Opening linked bottle…</p>}
                {unavailable && <p className="lists-notice" role="status">Linked bottle unavailable.</p>}
              </li>;
            })}</ul>}
        </>}
      <footer className="collection-footer"><span><Smartphone size={14} />Manage lists in the iPhone app.</span></footer>
    </main>
    {bottle && renderBottle(bottle)}
  </>;
}
