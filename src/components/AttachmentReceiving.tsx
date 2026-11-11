import type { AttachmentPassport } from "../types/equipment";
import { AttachmentSpecGrid } from "./AttachmentSpecGrid";
import { PassportFactoryGallery } from "./PassportFactoryGallery";
import "../styles/attachment-receiving.css";

const displayDate = (date: string) => new Intl.DateTimeFormat("en-US", {
  month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

export function AttachmentReceiving({ item }: { item: AttachmentPassport }) {
  const receiving = item.receiving;
  if (!receiving) return null;
  const categories = ["Delivery", "Identification", "Construction", "Inspection"] as const;
  const reference = receiving.manufacturerReference;

  return <>
    <section className="section shell" id="attachment-procurement-timeline">
      <div className="section-heading"><div><p className="eyebrow">Procurement timeline</p><h2>From order to physical receipt.</h2></div><p>Commercial completion and receiving do not authorize operation.</p></div>
      <ol className="attachment-receiving-timeline">
        {receiving.timeline.map(event => <li key={event.id}>
          {event.date ? <time dateTime={event.date}>{displayDate(event.date)}</time> : <span>Date not recorded</span>}
          <h3>{event.label}</h3><p>{event.detail}</p>
        </li>)}
      </ol>
    </section>

    <section className="attachment-detail" id="grapple-freight"><div className="shell">
      <div className="section-heading"><div><p className="eyebrow">Freight history</p><h2>Delivered · Estes / ACME Logistics</h2></div><p>Physical delivery confirmed November 11, 2026. Shipment weight is not measured attachment weight.</p></div>
      <AttachmentSpecGrid fields={[
        { label: "Original carrier", value: receiving.freight.carrier },
        { label: "Final-mile carrier", value: receiving.freight.finalMileCarrier },
        { label: "Tracking / PRO", value: receiving.freight.pro },
        { label: "Shipped", value: displayDate(receiving.freight.shippedAt) },
        { label: "Delivered", value: displayDate(receiving.freight.deliveredAt) },
        { label: "Delivery location", value: receiving.freight.location },
        { label: "Freight service", value: receiving.freight.service },
        { label: "Shipment", value: receiving.freight.shipment },
      ]} />
    </div></section>

    <section className="section shell attachment-receiving-gallery" id="attachment-receiving-gallery">
      <div className="section-heading"><div><p className="eyebrow">Receiving gallery</p><h2>The actual attachment, not a catalog substitute.</h2></div><p>Approved owner photographs document physical receipt only. Other requested public photographs remain unavailable in the labeled slots below. Publish only reviewed photographs with private labels and addresses excluded.</p></div>
      {categories.map(category => {
        const entries = item.fieldEvidence?.filter(entry => entry.category === category) ?? [];
        const approved = entries.flatMap(entry => entry.status === "verified" && entry.image && entry.imageAlt ? [{
          id: entry.id, src: entry.image, originalSrc: entry.image, alt: entry.imageAlt,
          caption: entry.description, title: entry.title, equipmentId: item.passportId,
          source: "Owner-provided, approved public receiving photograph",
          evidenceDate: receiving.freight.deliveredAt, lifecycle: "Received; commissioning pending",
          classification: category,
        }] : []);
        return <div className="attachment-receiving-gallery__group" key={category}>
          <h3>{category}</h3>
          {approved.length > 0 && <PassportFactoryGallery media={approved} />}
          <div className="attachment-checklist">{entries.filter(entry => !approved.some(image => image.id === entry.id)).map(entry => <article className="attachment-check attachment-check--pending" key={entry.id}>
            <div className="attachment-check__top"><span>Public photograph missing</span></div>
            <h4>{entry.title}</h4><p>{entry.description}</p>
          </article>)}</div>
        </div>;
      })}
      <details className="attachment-manufacturer-reference">
        <summary>Official manufacturer image · secondary reference only</summary>
        <figure><img src={reference.src} alt={reference.alt} loading="lazy" decoding="async" /><figcaption>{reference.caption}</figcaption></figure>
      </details>
    </section>

    <section className="attachment-detail" id="attachment-commissioning"><div className="shell">
      <div className="section-heading"><div><p className="eyebrow">Commissioning checklist</p><h2>Received does not mean ready.</h2></div><p><a href="/equipment/sp-ardhi-26.html">{receiving.hostFleetId}</a> is unavailable due to its throttle-control issue. Every check below remains pending. No customer-facing service activation before commissioning and independent safety review are complete.</p></div>
      <ul className="attachment-commissioning-list">{receiving.commissioningChecklist.map(check => <li key={check}><span className="attachment-status attachment-status--commissioning">Pending</span><span>{check}</span></li>)}</ul>
    </div></section>

    <section className="section shell" id="attachment-field-test-001">
      <div className="section-heading"><div><p className="eyebrow">Field Test 001 · Planned</p><h2>Brush and debris recovery.</h2></div><p>{receiving.fieldTestPlan}</p></div>
      <p className="attachment-receiving-notice">Test date, operating observations and results: not yet recorded.</p>
    </section>
  </>;
}
