import type { AttachmentPassport } from "../types/equipment";
import { ButtonLink } from "./ButtonLink";
import { EquipmentWatch } from "./EquipmentWatch";
import { PassportFactoryGallery } from "./PassportFactoryGallery";

export function AttachmentProcurement({ item }: { item: AttachmentPassport }) {
  if (!item.procurementMilestones?.length) return null;
  return <section className="section shell attachment-procurement" aria-labelledby="procurement-title">
    <div className="section-heading"><div><p className="eyebrow">Procurement journey / updated November 5, 2026</p><h2 id="procurement-title">Paid. Built.<br />Shipment pending.</h2></div><p>Purchased for ARDHI. Fabrication was reported complete by vendor telephone call on October 28. Payment is complete; dispatch and tracking are still unconfirmed.</p></div>
    <ol className="attachment-timeline">{item.procurementMilestones.map((step, index) => <li className={`is-${step.status}`} key={step.id} aria-current={step.status === "current" ? "step" : undefined}>
      <span className="attachment-timeline__marker" aria-hidden="true">{step.status === "completed" ? "✓" : String(index + 1).padStart(2, "0")}</span>
      <div><small>{step.status === "completed" ? "Complete" : step.status === "current" ? "Current milestone" : "Pending evidence"}</small><h3>{step.label}</h3>{step.date && <time dateTime={step.date}>{new Date(`${step.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time>}{step.notes && <p>{step.notes}</p>}</div>
    </li>)}</ol>
    <dl className="attachment-payment-grid"><div><dt>September 9, 2026 / Deposit</dt><dd>$297</dd></div><div><dt>October 30, 2026 / Payment</dt><dd>$1,000</dd></div><div><dt>November 5, 2026 / Final payment</dt><dd>$1,000</dd></div><div><dt>Total paid / Balance</dt><dd>$2,297 <small>/ $0 due</small></dd></div></dl>
    <p className="attachment-evidence-note">Invoice #292 is paid in full. The vendor's approximate two-day arrival estimate starts after receipt of full payment; it is not a confirmed delivery date. Shipping, receipt, installation and operational release require separate evidence.</p>
  </section>;
}

export function AttachmentHost({ item }: { item: AttachmentPassport }) {
  if (!item.intendedHostIds?.includes("SP-ARDHI-26")) return null;
  return <section className="attachment-detail attachment-host" aria-labelledby="attachment-host-title"><div className="shell attachment-host__grid">
    <figure><img src="/equipment/images/sp-ardhi-26-unboxing-2026-10-26-panels-removed.jpg" alt="Actual green and black SmashPro ARDHI YF380 exposed after its crate panels were removed" loading="lazy" /><figcaption>ARDHI / October 26, 2026 unboxing photograph. The grapple is not installed.</figcaption></figure>
    <div><p className="eyebrow">Intended host / physical fitment pending</p><h2 id="attachment-host-title">SP-ARDHI-26<br />SmashPro ARDHI</h2><p>Manufacturer-reviewed interface compatibility provides a starting point. Installation and hydraulic performance have not been field-tested with this grapple.</p>
      <ul className="attachment-host__checks"><li><strong>Mount:</strong> Toro Dingo / Mini Universal identified by Loflin from machine documentation and photographs. Verify plate seating and locking physically.</li><li><strong>Auxiliary hydraulics:</strong> reversing circuit and two quick couplers required; confirm coupler size, hose clearance and connections.</li><li><strong>Pressure:</strong> ARDHI's documented 17 MPa (approximately 2,466 PSI) is below Loflin's 3,500 PSI acceptable maximum. This is a documentation comparison, not a passed hydraulic test.</li><li><strong>Weight:</strong> 370-pound attachment against a documented 617-pound rated operating load. Attachment mass, load center, terrain and machine limits require review; the difference is not an approved payload rating.</li></ul>
      <ButtonLink href="/equipment/sp-ardhi-26.html">Explore the ARDHI passport →</ButtonLink>
    </div>
  </div></section>;
}

export function AttachmentFieldTestSection({ item }: { item: AttachmentPassport }) {
  const test = item.fieldTest;
  if (!test) return null;
  return <section className="section shell attachment-field-test" id="attachment-field-test" aria-labelledby="field-test-title">
    <div className="section-heading"><div><p className="eyebrow">Planned evaluation / no results recorded</p><h2 id="field-test-title">{test.title}</h2></div><p>A first evaluation of brush, branches and controlled material recovery, after delivery and commissioning approval. No grapple operation or performance outcome is established.</p></div>
    <ol className="attachment-objectives">{test.objectives.map((objective, index) => <li key={objective}><span>{String(index + 1).padStart(2, "0")}</span>{objective}</li>)}</ol>
    <details className="attachment-commissioning"><summary>Internal commissioning criteria / all checks pending</summary><p>Record inspection evidence and the responsible reviewer before controlled testing. These criteria are not a completed inspection or an operating procedure.</p><ul>{test.commissioningCriteria.map(criterion => <li key={criterion}>{criterion} <span>Pending verification</span></li>)}</ul></details>
    <h3 className="attachment-media-heading">The evaluation archive</h3><p>Reserved for reviewed media from this attachment. Before-condition photographs and test footage have not yet been approved for this record.</p>
    <div className="attachment-media-slots">{test.mediaSlots.map(slot => <article className={`attachment-media-slot attachment-media-slot--${slot.format}`} key={slot.id}><div aria-hidden="true">{slot.format === "short" ? "9:16" : slot.format === "video" ? "16:9" : "+"}</div><small>{slot.mediaIds.length ? "Associated media" : "Awaiting reviewed media"}</small><h4>{slot.title}</h4></article>)}</div>
    {test.gallery.length > 0 && <PassportFactoryGallery media={test.gallery.map(media => ({ ...media, title: media.caption, originalSrc: media.src, equipmentId: item.passportId, source: "Reviewed attachment evidence", evidenceDate: media.capturedAt ?? "", lifecycle: "Field evaluation", classification: "Attachment field evidence" }))} />}
    <EquipmentWatch videos={test.videos} equipmentId={item.passportId} channelUrl="https://www.youtube.com/@SmashProHQ" emptyMessage="The Shorts and full evaluation slots await published, verified videos. No test footage is available yet." />
  </section>;
}
