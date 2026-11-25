import { useEffect, useMemo, useRef, useState } from 'react';
import { ardhiJourneyChapters, ardhiMediaCollection, ardhiStories, type ArdhiJourneyStage, type ArdhiMediaEntry } from '../data/ardhiMediaCollection';
import '../styles/ardhi-media-collection.css';

const lead = ardhiMediaCollection.find(item => item.id === 'ardhi-media-field-lead')!;
const formatDuration = (seconds?: number) => seconds ? `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}` : null;
const formatDate = (value: string | 'unknown') => value === 'unknown' ? 'Capture date unknown' : value;

function MediaCard({ item, onOpen }: { item: ArdhiMediaEntry; onOpen: (item: ArdhiMediaEntry) => void }) {
  const duration = formatDuration(item.durationSeconds);
  return (
    <figure className="ardhi-collection-card" id={item.id}>
      <button type="button" onClick={() => onOpen(item)} aria-label={`Open ${item.type}: ${item.alt}`}>
        <img src={item.thumb} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" />
        {item.type === 'video' && <span className="ardhi-collection-card__badge" aria-hidden="true">▶{duration ? ` ${duration}` : ''}</span>}
      </button>
      <figcaption><time dateTime={item.capturedAt === 'unknown' ? undefined : item.capturedAt}>{formatDate(item.capturedAt)}</time><p>{item.caption}</p></figcaption>
    </figure>
  );
}

export function ArdhiMediaCollection() {
  const [stage, setStage] = useState<ArdhiJourneyStage | 'all'>('all');
  const [kind, setKind] = useState<'all' | 'image' | 'video'>('all');
  const [active, setActive] = useState<ArdhiMediaEntry | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const filtered = useMemo(() => ardhiMediaCollection.filter(item => (stage === 'all' || item.stage === stage) && (kind === 'all' || item.type === kind)), [stage, kind]);
  const open = (item: ArdhiMediaEntry) => { openerRef.current = document.activeElement as HTMLElement; setActive(item); };
  const close = () => { setActive(null); openerRef.current?.focus(); };
  const step = (direction: 1 | -1) => {
    if (!active) return;
    const index = filtered.findIndex(item => item.id === active.id);
    if (index === -1) return;
    setActive(filtered[(index + direction + filtered.length) % filtered.length]);
  };
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
  }, [active]);
  useEffect(() => {
    // Honor a deep link to a chapter or media item on load.
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView();
  }, []);
  const activeDuration = formatDuration(active?.durationSeconds);
  return (
    <div className="ardhi-media-collection" onKeyDown={event => { if (active && event.key === 'ArrowRight') step(1); if (active && event.key === 'ArrowLeft') step(-1); }}>
      <section className="ardhi-collection-hero" aria-labelledby="ardhi-collection-title">
        <img src={lead.web} alt={lead.alt} width={lead.width} height={lead.height} fetchPriority="high" />
        <div className="ardhi-collection-hero__shade" aria-hidden="true" />
        <div className="shell ardhi-collection-hero__copy">
          <p className="eyebrow">SmashPro Media · Equipment journey</p>
          <h1 id="ardhi-collection-title">ARDHI in pictures</h1>
          <p className="lead">The documented journey of SP-ARDHI-26 - from the YF380 factory line to his first dusty day in the dirt. Curated photos and clips; the passport stays the factual record.</p>
          <div className="ardhi-collection-hero__actions">
            <a href="/equipment/sp-ardhi-26.html">Equipment Passport</a>
            <a href="#chapters">Browse chapters</a>
          </div>
          <small>{lead.caption}</small>
        </div>
      </section>

      <section className="section shell" id="featured-story" aria-labelledby="featured-story-title">
        <p className="eyebrow">Featured stories</p>
        <h2 id="featured-story-title">The stories behind the pictures.</h2>
        <div className="ardhi-collection-stories">
          {ardhiStories.map(story => (
            <article key={story.id}>
              <p className="eyebrow">SmashPro Stories · In editorial review</p>
              <h3>{story.title}</h3>
              <p>{story.standfirst}</p>
              <a href={`#${story.chapter}`}>View the {ardhiJourneyChapters.find(chapter => chapter.id === story.chapter)?.title.toLowerCase()} chapter</a>
            </article>
          ))}
        </div>
        <p className="ardhi-collection-note">Articles publish on the main SmashPro site once editorial review completes; these chapters hold the imagery they draw from.</p>
      </section>

      <nav className="shell ardhi-collection-filters" id="chapters" aria-label="Media filters">
        <div role="group" aria-label="Journey stage">
          <button type="button" aria-pressed={stage === 'all'} onClick={() => setStage('all')}>All chapters</button>
          {ardhiJourneyChapters.map(chapter => <button type="button" key={chapter.id} aria-pressed={stage === chapter.id} onClick={() => setStage(chapter.id)}>{chapter.title}</button>)}
        </div>
        <div role="group" aria-label="Media type">
          {(['all', 'image', 'video'] as const).map(option => <button type="button" key={option} aria-pressed={kind === option} onClick={() => setKind(option)}>{option === 'all' ? 'Photos + video' : option === 'image' ? 'Photos' : 'Videos'}</button>)}
        </div>
      </nav>

      {ardhiJourneyChapters.filter(chapter => stage === 'all' || chapter.id === stage).map(chapter => {
        const items = filtered.filter(item => item.stage === chapter.id);
        if (!items.length) return null;
        return (
          <section className="section shell ardhi-collection-chapter" key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
            <header><p className="eyebrow">Chapter</p><h2 id={`${chapter.id}-title`}>{chapter.title}</h2><p>{chapter.summary}</p></header>
            <div className="ardhi-collection-grid">{items.map(item => <MediaCard key={item.id} item={item} onOpen={open} />)}</div>
          </section>
        );
      })}

      <section className="section shell ardhi-collection-links" aria-label="Related destinations">
        <article><h3>Equipment Passport</h3><p>Current condition, commissioning checklist and maintenance baselines.</p><a href="/equipment/sp-ardhi-26.html">Open the ARDHI passport</a></article>
        <article><h3>Media Center</h3><p>Channels, playlists and the rest of the SmashPro video library.</p><a href="https://smashpro.app/media/">Visit the Media Center</a></article>
        <article><h3>Fleet showroom</h3><p>Every SmashPro machine, attachment and build.</p><a href="/equipment/#fleet">Browse the fleet</a></article>
      </section>

      <dialog ref={dialogRef} className="ardhi-collection-lightbox" aria-label={active ? `${active.type === 'video' ? 'Video' : 'Photo'}: ${active.alt}` : 'Media viewer'} onClose={close} onMouseDown={event => { if (event.target === dialogRef.current) close(); }}>
        {active && (
          <div className="ardhi-collection-lightbox__body">
            {active.type === 'video'
              ? <video key={active.id} src={active.source} poster={active.poster} controls playsInline preload="metadata" aria-label={active.alt} />
              : <img key={active.id} src={active.web} alt={active.alt} width={active.width} height={active.height} />}
            <figcaption>
              <strong>{formatDate(active.capturedAt)}{activeDuration ? ` · ${activeDuration}` : ''}</strong>
              <span>{active.caption}</span>
            </figcaption>
            <div className="ardhi-collection-lightbox__controls">
              <button type="button" onClick={() => step(-1)} aria-label="Previous item">‹ Previous</button>
              <button type="button" onClick={() => step(1)} aria-label="Next item">Next ›</button>
              <button type="button" autoFocus onClick={close} aria-label="Close viewer">Close ✕</button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
