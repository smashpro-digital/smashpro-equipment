import { useEffect } from "react";
import type { Equipment } from "../types/equipment";
import { MzigoPassportHeader } from "./MzigoPassportHeader";
import { MzigoBuildStory } from "./MzigoBuildStory";
import { MzigoMediaArchive } from "./MzigoMediaArchive";
import { MzigoServiceRecord } from "./MzigoServiceRecord";
import { PassportEvidenceRecord } from "./PassportEvidenceRecord";
import { PassportDocumentRecord } from "./PassportDocumentRecord";
import { CanonicalPublicDocuments } from "./CanonicalPublicDocuments";
import { FleetLifecycleProgress } from "./FleetLifecycleProgress";
import { mzigoRequests, mzigoLifecycle } from "../data/mzigoPassport";
import { mzigoFinalConfiguration } from "../data/mzigoPlatform";
import { MzigoOemPlatform } from "./MzigoOemPlatform";

export function MzigoPassport({ item }: { item: Equipment }) {
  const authentic = item.gallery.filter(media => media.group);
  const confirmed = item.specifications.filter(spec => spec.confirmed);
  const pending = item.specifications.filter(spec => !spec.confirmed);
  const history = item.timeline.filter(event => event.publicDisplay).sort((a, b) => (a.occurredAt ?? "").localeCompare(b.occurredAt ?? ""));
  useEffect(() => {
    const openRecord = () => {
      const id = window.location.hash.slice(1);
      if (!id.startsWith("history-") && !id.startsWith("mzigo-record-")) return;
      const record = document.getElementById(id);
      if (record instanceof HTMLDetailsElement) { record.open = true; record.scrollIntoView({ block: "start" }); }
    };
    openRecord(); window.addEventListener("hashchange", openRecord);
    return () => window.removeEventListener("hashchange", openRecord);
  }, []);
  return <div className="mzigo-passport">
    <MzigoPassportHeader item={item} />
    <section className="section shell mzigo-purpose" id="overview"><div><p className="eyebrow">Move the Earth. Move the Load.</p><h2>Compact transport.<br />Electric purpose.</h2><p>Mzigo means load, cargo or freight. SP-MZIGO-26E is intended to move landscape materials, support property cleanup and stage loads alongside SmashPro's equipment fleet.</p></div><div id="projects"><h3>Configured around the load</h3><p>A four-wheel electric platform, remote controls and a hydraulic dump body keep this passport focused on material transport.</p><p>Quality inspection and SmashPro build approval are recorded. Payment, export, transport and commissioning remain ahead; rental availability has not been announced.</p></div></section>
    <div id="journey"><FleetLifecycleProgress stages={mzigoLifecycle} metrics={[{ id: "photos", label: "Factory photographs", value: authentic.filter(media => media.kind !== "video").length }, { id: "videos", label: "Factory videos", value: authentic.filter(media => media.kind === "video").length }]} currentStage="Final payment" nextStage="Wooden crate" eyebrow="Shipping Journey" title="Evidence advances the journey." description="Build approval is recorded. Every payment, export, port, ocean, customs, delivery and commissioning stage stays pending until documented." /></div>
    <section className="section shell mzigo-customization" id="configuration"><div className="section-heading"><div><p className="eyebrow">Founders Edition</p><h2>Final Configuration.</h2></div><p>The as-built record separates photographed configuration from supplier-stated values that still require manufacturer engineering documentation.</p></div><dl className="mzigo-final-configuration">{mzigoFinalConfiguration.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd><strong>{fact.value}</strong><small>{fact.evidence}</small></dd></div>)}</dl>
      <div id="verification" className="mzigo-verification"><h3>Future options and manufacturer checks</h3><p>The completed September 14–15 configuration remains separate from the future option backlog.</p><dl>{mzigoRequests.map(request => <div key={request.title}><dt>{request.title}<small>{request.status}</small></dt><dd>{request.detail}</dd></div>)}</dl></div>
    </section>
    <section className="spec-section" id="specifications"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Evidence-led configuration</p><h2>What the record confirms.</h2></div><p>Core configuration is supported by passport records and factory media. Numeric performance claims still need manufacturer documentation.</p></div><dl className="spec-grid passport-spec-grid">{confirmed.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>
      <details className="passport-evidence-record mzigo-pending-specs"><summary><span><strong>Recorded specifications awaiting manufacturer verification</strong><small>K600 platform, capacity, electrical ratings, dimensions and performance</small></span><span aria-hidden="true">+</span></summary><div className="passport-evidence-record__body"><p>These existing passport values are retained for traceability. They are not presented as verified OEM ratings or an operating approval.</p><dl className="spec-grid">{pending.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}<small>Manufacturer verification pending</small></dd></div>)}</dl></div></details>
      <details className="passport-evidence-record"><summary><strong>Recorded accessories and spare parts</strong><span aria-hidden="true">+</span></summary><div className="passport-evidence-record__body"><p>The procurement list records these items. Packing and receipt verification remain open; the remote controller is photographed.</p><ul>{item.includedItems.map(accessory => <li key={accessory.id}>{accessory.name}</li>)}</ul></div></details>
    </div></section>
    <section className="timeline-section mzigo-history" id="history"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Procurement and production</p><h2>One machine.<br />A traceable record.</h2></div><p>Deposit and production are recorded. Payment amounts, dates and remaining terms are not inferred where the source record is incomplete.</p></div><ol className="passport-timeline">{history.map(event => <li key={event.id}><PassportEvidenceRecord id={`history-${event.id}`} date={event.occurredAt ?? "Date not documented"} phase={event.kind.replaceAll("-", " ")} title={event.title} label="Open record"><p>{event.detail}</p>{["mzigo-factory-build", "mzigo-assembly-evidence", "mzigo-factory-complete", "mzigo-current"].includes(event.id) && <a href={event.id === "mzigo-factory-build" || event.id === "mzigo-assembly-evidence" ? "#mzigo-archive-factory-build" : "#mzigo-archive-finished-machine"}>Follow this chapter in the media archive →</a>}</PassportEvidenceRecord></li>)}</ol></div></section>
    <MzigoBuildStory />
    <MzigoOemPlatform item={item} />
    <MzigoMediaArchive item={item} />
    <section className="section shell mzigo-documents" id="documents"><div className="section-heading"><div><p className="eyebrow">Documents and verification</p><h2>Evidence that travels<br />with the machine.</h2></div><p>The passport summary is generated from this record. Factory-issued documents are listed separately when publicly available.</p></div><CanonicalPublicDocuments assetCode={item.fleetId} showStatus /><PassportDocumentRecord item={item} /><details className="passport-evidence-record"><summary><strong>Documents still to verify</strong><span aria-hidden="true">+</span></summary><div className="passport-evidence-record__body"><ul><li>Signed proforma and payment schedule</li><li>Manufacturer specification sheet, K600 designation and battery ratings</li><li>Final QC report, requested-change confirmation and packing list</li><li>Operator manual, warranty documentation and maintenance schedule</li><li>Shipping documents and arrival inspection when those stages occur</li></ul></div></details></section>
    <MzigoServiceRecord item={item} />
  </div>;
}
