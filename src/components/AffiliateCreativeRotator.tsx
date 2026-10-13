import { useEffect, useRef, useState } from 'react';
import { creativeSchedule, recordCreativeEvent, type AffiliateCreative } from '../domain/affiliateCreatives';
import '../styles/affiliate-creative-rotator.css';

export function AffiliateCreativeRotator({ creatives, interval = 8000 }: { creatives: AffiliateCreative[]; interval?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [now, setNow] = useState(Date.now());
  const reported = useRef(new Set<string>());
  const slot = useRef(0);
  const active = creatives.filter(c => c.validUntil > now && !failed.has(c.image_url));
  const current = active.find(c => c.id === selected) || active[0];
  const schedule = creativeSchedule(active);
  const signature = schedule.join(',');
  const running = !paused && !reduced && visible && !hidden && !hover && !focus && active.length > 1;
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(media.matches);
    const visibility = () => { setHidden(document.hidden); setNow(Date.now()); };
    media.addEventListener('change', motion); document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(entries => setVisible(entries.some(e => e.isIntersecting && e.intersectionRatio >= 0.5)), { threshold: [0, 0.5] });
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    const until = Math.min(...creatives.map(c => c.validUntil).filter(t => t > Date.now()));
    if (!Number.isFinite(until)) return;
    const timeout = setTimeout(() => setNow(Date.now()), Math.max(0, until - Date.now()));
    return () => clearTimeout(timeout);
  }, [creatives, now]);
  useEffect(() => { slot.current = 0; }, [signature]);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => { slot.current = (slot.current + 1) % schedule.length; setSelected(schedule[slot.current]); setNow(Date.now()); }, Math.max(1000, interval));
    return () => clearInterval(timer);
    // Lease refresh does not restart rotation when the eligible schedule is unchanged.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, signature, interval]);
  useEffect(() => {
    if (!current || !visible || hidden || loaded !== current.image_url) return;
    const key = `${current.id}:${current.image_url}`;
    if (reported.current.has(key)) return;
    const timer = setTimeout(() => { if (Date.now() < current.validUntil) { reported.current.add(key); recordCreativeEvent(current, 'impression'); } }, 1000);
    return () => clearTimeout(timer);
  }, [current, visible, hidden, loaded]);
  function step(direction: number) {
    setPaused(true);
    const index = active.findIndex(c => c.id === current?.id);
    const next = active[(index + direction + active.length) % active.length];
    slot.current = Math.max(0, schedule.indexOf(next?.id));
    setSelected(next?.id ?? null);
  }
  return <div ref={root} className="affiliate-rotator" role="region" aria-roledescription="carousel" aria-label="AKASO affiliate banners" hidden={creatives.length === 0} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocusCapture={() => setFocus(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }}>
    <div className="affiliate-rotator__heading"><span>AKASO · Advertiser imagery</span><span>Affiliate advertisement</span></div>
    <div className="affiliate-rotator__frame" aria-live="off">
      {current ? <a key={current.image_url} href={current.tracking_url} target="_blank" rel="sponsored noopener noreferrer" onClick={e => { if (Date.now() >= current.validUntil) { e.preventDefault(); setNow(Date.now()); } else recordCreativeEvent(current, 'click'); }}>
        <img src={current.image_url} width={current.width} height={current.height} alt={current.alt} decoding="async" onLoad={() => setLoaded(current.image_url)} onError={() => setFailed(old => new Set(old).add(current.image_url))} />
      </a> : <p>Banner unavailable. Explore AKASO 360 above.</p>}
    </div>
    <div className="affiliate-rotator__controls">
      <span aria-live={paused || reduced ? 'polite' : 'off'}>{current ? `${active.findIndex(c => c.id === current.id) + 1} of ${active.length}` : 'No banner available'}</span>
      {active.length > 1 && <><button type="button" aria-label="Previous affiliate banner" onClick={() => step(-1)}>Previous</button><button type="button" aria-label={paused ? 'Play affiliate banners' : 'Pause affiliate banners'} onClick={() => setPaused(value => !value)} disabled={reduced}>{reduced ? 'Motion paused' : paused ? 'Play' : 'Pause'}</button><button type="button" aria-label="Next affiliate banner" onClick={() => step(1)}>Next</button></>}
    </div>
  </div>;
}
