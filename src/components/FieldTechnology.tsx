import { useEffect, useState } from 'react';
import { ButtonLink } from './ButtonLink';
import { FIELD_CATALOG_URL, fieldTechnologyCard, type FieldTechnologyCard } from '../domain/fieldTechnology';
import '../styles/field-technology.css';

export function FieldTechnology() {
  const [card, setCard] = useState<FieldTechnologyCard | null>(null);
  useEffect(() => {
    let disposed = false;
    let active: AbortController | null = null;
    let expiry: ReturnType<typeof setTimeout> | undefined;
    async function refresh() {
      active?.abort();
      const controller = new AbortController();
      active = controller;
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch(FIELD_CATALOG_URL, { signal: controller.signal, credentials: 'omit', cache: 'no-store', redirect: 'error', headers: { Accept: 'application/json' } });
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Unavailable catalog');
        const next = fieldTechnologyCard(await response.json());
        if (disposed || active !== controller) return;
        clearTimeout(expiry);
        setCard(next);
        if (next) expiry = setTimeout(() => setCard(null), Math.max(0, next.validUntil - Date.now()));
      } catch {
        if (!disposed && active === controller) { clearTimeout(expiry); setCard(null); }
      } finally { clearTimeout(timeout); }
    }
    function visibility() {
      setCard(null);
      clearTimeout(expiry);
      active?.abort();
      if (!document.hidden) void refresh();
    }
    void refresh();
    const interval = setInterval(() => { if (!document.hidden) void refresh(); }, 15000);
    document.addEventListener('visibilitychange', visibility);
    return () => { disposed = true; active?.abort(); clearTimeout(expiry); clearInterval(interval); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  if (!card) return null;
  return <section className="section shell field-technology" id="field-technology" aria-labelledby="field-technology-title">
    <div className="section-heading"><div><p className="eyebrow">Equipment stories, from the field</p><h2 id="field-technology-title">Field Technology &amp; Creator Gear</h2></div><p>New perspectives on the machines, the operators and the work.</p></div>
    <article className="field-technology__card">
      <div className="field-technology__identity"><p className="eyebrow">Camera exploration</p><h3>{card.name}</h3><span className="field-technology__stage">Exploring</span></div>
      <div><p>{card.description}</p><p>We’re exploring equipment demonstrations, operator POV and Equip Expo 2026 coverage. Purchase, field testing and sponsorship are not claimed.</p>
        <div className="field-technology__action"><ButtonLink href={card.url} sponsored onClick={event => { if (Date.now() >= card.validUntil) { event.preventDefault(); setCard(null); } }}>Explore AKASO 360</ButtonLink><p className="field-technology__disclosure">{card.disclosure}</p></div>
      </div>
    </article>
  </section>;
}
