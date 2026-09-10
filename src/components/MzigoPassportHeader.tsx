import type { Equipment } from "../types/equipment";
import { PassportHero } from "./PassportHero";

export function MzigoPassportHeader({ item }: { item: Equipment }) {
  const media = {
    src: "/equipment/images/sp-mzigo-26e-hero-artwork-2026-09-09.png",
    alt: "SP-MZIGO-26E brand illustration with a raised green dump body and remote controller in a SmashPro workshop",
  };
  return <>
    <PassportHero titleId="mzigo-passport-title" image={media.src} alt={media.alt} className="mzigo-passport-hero">
      <p className="eyebrow">{item.fleetId}</p>
      <h1 id="mzigo-passport-title">SmashPro<br />Electric Material<br />Carrier <span>{item.identity.factoryModel}</span></h1>
      <p>Factory complete <b>·</b> Pre-shipment verification</p>
      <nav className="ardhi-v2-hero__actions" aria-label="MZIGO equipment passport chapters">
        <a href="#passport"><span aria-hidden="true">📘</span> Passport</a>
        <a href="#journey"><span aria-hidden="true">🌎</span> Journey</a>
        <a href="#history"><span aria-hidden="true">📜</span> History</a>
        <a href="#service"><span aria-hidden="true">🛠</span> Service</a>
      </nav>
    </PassportHero>
    <section className="section shell mzigo-passport-header" id="passport" aria-labelledby="mzigo-identity-title">
      <div className="section-heading"><div><p className="eyebrow">Equipment Passport</p><h2 id="mzigo-identity-title">Identity and current operating status.</h2></div></div>
      <div id="identity" className="passport-identity passport-summary-row mzigo-passport-summary">
        <div className="passport-summary-item" data-icon="▱"><span>Factory Model</span><strong>{item.identity.factoryModel}</strong></div>
        <div className="passport-summary-item" data-icon="✓"><span>Status</span><strong>Factory build complete</strong></div>
        <div className="passport-summary-item" data-icon="◷"><span>Service Hours</span><strong>0 · pre-commissioning</strong></div>
      </div>
      <div className="status-panel"><span className="status-light" /><div><small>Current public status</small><strong>{item.statusLabel}</strong><p>Final inspection, ocean freight and U.S. delivery remain upcoming.</p></div></div>
      <div className="mzigo-passport-utilities"><a href="#specifications">Factory specifications</a><a href="#mzigo-build-story">Build evidence</a></div>
    </section>
  </>;
}
