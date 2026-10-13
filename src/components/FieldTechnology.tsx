import { useEffect, useState } from 'react';
import { ButtonLink } from './ButtonLink';
import { FIELD_CATALOG_URL, fieldTechnologyCard, type FieldTechnologyCard } from '../domain/fieldTechnology';
import '../styles/field-technology.css';

export function FieldTechnology() {
  const [card, setCard] = useState<FieldTechnologyCard | null>(null);
  const [failedImage, setFailedImage] = useState<string | null>(null);
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
    <p className="eyebrow">Field Technology &amp; Creator Gear</p>
    <article className={"field-technology__card" + (card.image ? " field-technology__card--illustrated" : "")}>
      {card.image && <figure className="field-technology__visual">
        {failedImage === card.image.url ? <div className="field-technology__image-fallback"><strong>AKASO 360</strong><span>Product image unavailable</span></div> : <img src={card.image.url} width={card.image.width} height={card.image.height} alt={card.image.alt} loading="lazy" decoding="async" onError={() => setFailedImage(card.image!.url)} />}
        <figcaption>Official AKASO product imagery</figcaption>
      </figure>}
      <div className="field-technology__story">
        <div className="field-technology__identity"><span>{card.name}</span><span className="field-technology__stage">Exploring</span></div>
        <h2 id="field-technology-title">Capture<br />Every Angle.</h2>
        <p className="field-technology__intro">We're exploring the AKASO 360 to document real-world equipment operations, attachment demonstrations, and behind-the-scenes field work.</p>
        <ul className="field-technology__stories" aria-label="Planned field stories"><li>Equipment in action</li><li>Attachment demonstrations</li><li>Behind the scenes</li></ul>
        <div className="field-technology__action">
          <ButtonLink href={card.url} sponsored onClick={event => { if (Date.now() >= card.validUntil) { event.preventDefault(); setCard(null); } }}>Explore AKASO 360</ButtonLink>
          <ButtonLink href="https://www.youtube.com/@SmashProHQ" variant="quiet" external>Watch SmashPro Equipment</ButtonLink>
        </div>
        <p className="field-technology__disclosure">SmashPro participates in the AKASO Affiliate Program. {card.disclosure}</p>
        <p className="field-technology__status">Exploration stage. Purchase and field testing are not yet confirmed.</p>
      </div>
    </article>
  </section>;
}
