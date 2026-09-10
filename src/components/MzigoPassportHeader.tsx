import type { Equipment } from "../types/equipment";


export function MzigoPassportHeader({ item }: { item: Equipment }) {
  const media = { src: "/equipment/images/sp-mzigo-26e-hero-artwork-2026-09-09.png", alt: "SP-MZIGO-26E brand illustration with a raised green dump body and remote controller in a SmashPro workshop", width: 1670, height: 941 };
  return <section className="shell mzigo-passport-header" aria-labelledby="mzigo-passport-title">
    <p className="eyebrow">SmashPro Fleet Equipment Passport</p>
    <h1 id="mzigo-passport-title">{item.fleetId}</h1>
    <p className="mzigo-passport-header__type">Electric material carrier · factory and service record</p>
    <div id="identity" className="passport-identity passport-summary-row mzigo-passport-summary">
      <div className="passport-summary-item" data-icon="▱"><span>Factory Model</span><strong>{item.identity.factoryModel}</strong></div>
      <div className="passport-summary-item" data-icon="✓"><span>Status</span><strong>Factory build complete</strong></div>
      <div className="passport-summary-item" data-icon="◷"><span>Service Hours</span><strong>0 · pre-commissioning</strong></div>
    </div>
    <div className="status-panel"><span className="status-light" /><div><small>Current public status</small><strong>{item.statusLabel}</strong><p>Final inspection, ocean freight and U.S. delivery remain upcoming.</p></div></div>
    <figure><a href={media.src} target="_blank" rel="noopener noreferrer" aria-label="Enlarge SP-MZIGO-26E hero artwork"><img src={media.src} alt={media.alt} width={media.width} height={media.height} fetchPriority="high" /></a><figcaption>SP-MZIGO-26E · Brand illustration</figcaption></figure>
    <nav aria-label="MZIGO passport sections"><a href="#mzigo-build-story">Build evidence</a><a href="#specifications">Specifications</a><a href="#history">History</a></nav>
  </section>;
}
