import { useEffect } from "react";
import type { Equipment } from "../types/equipment";
import { PassportHero } from "./PassportHero";
import { PassportEvidenceRecord } from "./PassportEvidenceRecord";
import { PassportFactoryGallery } from "./PassportFactoryGallery";
import { ButtonLink } from "./ButtonLink";
import { PassportJourney, PassportCapabilities, PassportCommissioning, PassportInquiry, PassportSection } from "./PassportExperience";
import { EquipmentWatch } from "./EquipmentWatch";
import { nyasiFactoryMedia, nyasiAcceptance } from "../data/nyasiFactoryMedia";
import { nyasiEvidenceSlots } from "../data/nyasiEquipment";
import { nyasiJourney, nyasiStory, nyasiCapabilities, nyasiVideos, nyasiWatch, nyasiCustomerInquiry, nyasiPartnershipInquiry, nyasiCommissioning } from "../data/nyasiExperience";
import "../styles/nyasi-passport.css";

export function NyasiPassport({ item }: { item: Equipment }) {
  useEffect(() => {
    const revealEvidence = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (!target) return;
      let node: HTMLElement | null = target;
      while (node) { if (node instanceof HTMLDetailsElement) node.open = true; node = node.parentElement; }
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    revealEvidence(); window.addEventListener("hashchange", revealEvidence);
    return () => window.removeEventListener("hashchange", revealEvidence);
  }, []);
  return <div className="nyasi-passport" id="passport">
    <PassportHero titleId="nyasi-title" image={item.heroImage} srcSet={item.heroMedia?.srcSet} sizes="100vw" width={item.heroMedia?.width} height={item.heroMedia?.height} alt={item.heroMedia?.alt ?? item.fleetId} className="nyasi-hero">
      <p className="eyebrow">{item.fleetId} / LM500</p><h1 id="nyasi-title">NYASI</h1>
      <p className="nyasi-hero__type">Remote-Control Tracked Mower</p><p>Vegetation management. Property maintenance. A new perspective from off the machine.</p>
      <div className="nyasi-status"><strong>Factory Build Complete</strong><span>Next: Final Configuration Review</span><small>Supplier-reported completion. Not shipped or commissioned.</small></div>
      <div className="button-row"><ButtonLink href="#capabilities">Explore capabilities</ButtonLink><ButtonLink href="#journey" variant="outline">Follow the build</ButtonLink></div>
      <small className="nyasi-art-label">Identity / promotional artwork. Factory evidence below.</small>
    </PassportHero>
    <nav className="shell nyasi-section-nav" aria-label="Passport sections">{[["identity", "Meet NYASI"], ["capabilities", "Capabilities"], ["journey", "Journey"], ["evidence", "Factory photos"], ["watch", "Watch"], ["work-with-nyasi", "Request assessment"], ["technical", "Technical Passport"]].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    <PassportSection id="identity" eyebrow="Vegetation management / growing field fleet" title={nyasiStory.title} description={nyasiStory.intro}><div className="nyasi-editorial">{nyasiStory.paragraphs.map(text => <p key={text}>{text}</p>)}</div></PassportSection>
    <PassportSection id="capabilities" eyebrow="Purpose, with evidence" title="The work ahead." description="Purchased configuration and supplier-stated uses are not field validation. No field-validated capability is claimed yet."><PassportCapabilities items={nyasiCapabilities} /></PassportSection>
    <PassportSection id="journey" eyebrow="Factory to field" title="A machine. A growing record." description="Factory Build Complete / Final Configuration Review Pending. Open a milestone for its evidence. Future dates remain unassigned."><PassportJourney stages={nyasiJourney} /></PassportSection>
    <PassportSection id="evidence" eyebrow="Actual machine / supplier factory evidence" title="From the factory floor." description="Three photographs supplied October 14, 2026. The assembled platform is visible; final configuration and functional acceptance remain pending.">
      <PassportFactoryGallery media={nyasiFactoryMedia.filter(media => media.kind === "image")} />
      <details className="nyasi-accordion" id="acceptance"><summary>What the factory evidence establishes</summary><div className="nyasi-record-grid">{nyasiAcceptance.map(entry => <article key={entry.title}><h3>{entry.title}</h3><p>{entry.detail}</p></article>)}</div></details>
    </PassportSection>
    <PassportSection id="watch" eyebrow="SmashPro Equipment / YouTube" title="Watch NYASI." description={nyasiWatch.description}><EquipmentWatch videos={nyasiVideos} equipmentId={item.fleetId} {...nyasiWatch} /></PassportSection>
    <PassportInquiry story={nyasiCustomerInquiry} /><PassportInquiry story={nyasiPartnershipInquiry} />
    <PassportSection id="technical" eyebrow="Permanent equipment record" title="The technical Passport." description="Ordered specifications remain distinct from inspected hardware and verified operation.">
      <details className="nyasi-accordion" id="configuration"><summary>Identity and ordered configuration</summary><dl className="nyasi-specs"><div><dt>Passport ID</dt><dd>{item.identity.passportId}</dd></div>{item.specifications.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}<small>{spec.source} / ordered configuration</small></dd></div>)}</dl><p>Green finish, tracks, engine, blade and controller are visible in factory photos. Decals and tow hitch still require verification. Top storage rack removed from order; side cutter not purchased. No conceptual accessory is represented as purchased.</p></details>
      <details className="nyasi-accordion" id="service"><summary>Commissioning and operational release - pending</summary><p>Delivery, inspection and commissioning must precede customer work. Supplier demonstrations do not complete these checks. Each test can carry its own verified photo, video or inspection record.</p><PassportCommissioning checks={nyasiCommissioning} /><p>No maintenance events, operating hours or first field deployment are recorded.</p></details>
      <details className="nyasi-accordion" id="history"><summary>Acquisition story and lifecycle evidence</summary><div className="nyasi-evidence-list">{item.timeline.filter(event => event.publicDisplay).slice().sort((a, b) => (a.occurredAt ?? "9999").localeCompare(b.occurredAt ?? "9999")).map(event => <PassportEvidenceRecord key={event.id} id={`history-${event.id}`} date={event.occurredAt ?? "Current"} phase="Fleet journey" title={event.title} label="Recorded"><p>{event.detail}</p>{event.photos?.length ? <a href="#nyasi-factory-front-blade">View {event.photos.length} factory photographs</a> : null}</PassportEvidenceRecord>)}</div><p>Procurement financial records remain in Digital HQ under its existing authorization.</p></details>
      <details className="nyasi-accordion" id="documents"><summary>Public documents and pending records</summary><p>No approved public manuals or commissioning reports have been published. Private invoices and supplier account records are not linked here.</p><div className="nyasi-evidence-list">{nyasiEvidenceSlots.map(record => <PassportEvidenceRecord key={record.id} id={`evidence-${record.id}`} date={record.date ?? "Date not established"} phase="Evidence" title={record.title} label={record.status}><p>{record.detail}</p>{record.id === "production" && <a href="#nyasi-factory-front-blade">View factory evidence</a>}</PassportEvidenceRecord>)}</div></details>
    </PassportSection>
  </div>;
}
