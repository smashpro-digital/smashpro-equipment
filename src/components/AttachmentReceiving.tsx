import type { AttachmentPassport } from "../types/equipment";
import { AttachmentSpecGrid } from "./AttachmentSpecGrid";
import { PassportFactoryGallery } from "./PassportFactoryGallery";
import { EquipmentWatch, publishedEquipmentVideos } from "./EquipmentWatch";
import "../styles/attachment-receiving.css";

const displayDate = (date: string) => new Intl.DateTimeFormat("en-US", {
  month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

export function AttachmentReceiving({ item }: { item: AttachmentPassport }) {
  const receiving = item.receiving;
  if (!receiving) return null;
  const categories = ["Delivery", "Equipment Overview", "Manufacturer Identification", "Mounting and Fitment"] as const;
  const reference = receiving.manufacturerReference;
  const availableVideos = publishedEquipmentVideos(receiving.videoSlots.flatMap(slot => slot.publication ? [slot.publication.video] : []), item.passportId);

  return <>
    <section className="section shell" id="attachment-procurement-timeline">
      <div className="section-heading"><div><p className="eyebrow">Procurement timeline</p><h2>From order to physical receipt.</h2></div><p>Commercial completion and receiving do not authorize operation.</p></div>
      <p className="attachment-status attachment-status--commissioning">{receiving.showroomStatusLabel}</p>
      <ol className="attachment-receiving-timeline" aria-label="Procurement and readiness milestones">
        {receiving.timeline.map(event => <li className={`is-${event.status}`} key={event.id}>
          <span className="attachment-receiving-timeline__status">{event.status === "completed" ? "Complete" : "Pending"}</span>
          {event.date && <time dateTime={event.date}>{displayDate(event.date)}</time>}
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
      <div className="section-heading"><div><p className="eyebrow">Receiving gallery</p><h2>The actual attachment, not a catalog substitute.</h2></div><p>Approved owner photographs distinguish delivery evidence, equipment identification, and initial mounting evaluation. Mounting photographs do not verify safe fitment or authorize operation. Other requested public photographs remain unavailable in the labeled slots below. Publish only reviewed photographs with private labels and addresses excluded.</p></div>
      {categories.map(category => {
        const entries = item.fieldEvidence?.filter(entry => entry.category === category) ?? [];
        const approved = entries.flatMap(entry => entry.status === "verified" && entry.image && entry.imageAlt ? [{
          id: entry.id, src: entry.image, originalSrc: entry.image, alt: entry.imageAlt,
          caption: entry.description, title: entry.title, equipmentId: item.passportId,
          width: entry.width, height: entry.height,
          source: "Owner-provided, approved public photograph",
          evidenceDate: entry.evidenceDate ?? receiving.freight.deliveredAt, lifecycle: receiving.statusLabel,
          classification: category,
        }] : []);
        return <div className="attachment-receiving-gallery__group" key={category}>
          <h3>{category}</h3>
          {category === "Mounting and Fitment" && <p>Measurements are preliminary physical observations, not certified mounting dimensions. Initial mounting is photographed; safe locking-pin engagement and hydraulic operation remain unverified.</p>}
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
      <div className="section-heading"><div><p className="eyebrow">Commissioning checklist</p><h2>Received does not mean ready.</h2></div><p><a href="/equipment/sp-ardhi-26.html">{receiving.hostFleetId}</a> is unavailable due to its throttle-control issue. Quick-attach locking-pin engagement remains unresolved. Commissioning is blocked until both pins are fully engaged, inspected, and corrective action is verified. Every check below remains pending. No customer-facing service activation before commissioning and independent safety review are complete.</p></div>
      <ul className="attachment-commissioning-list">{receiving.commissioningChecklist.map(check => <li key={check}><span className="attachment-status attachment-status--commissioning">Pending</span><span>{check}</span></li>)}</ul>
    </div></section>

    <section className="section shell" id="attachment-field-test-001">
      <div className="section-heading"><div><p className="eyebrow">Field Test 001 · Planned</p><h2>Brush and debris recovery.</h2></div><p>{receiving.fieldTestPlan}</p></div>
      <p className="attachment-receiving-notice">Test date, operating observations and results: not yet recorded.</p>
    </section>

    <section className="section shell attachment-receiving-videos" id="attachment-videos" aria-labelledby="attachment-videos-title">
      <div className="section-heading"><div><p className="eyebrow">Watch the next chapters</p><h2 id="attachment-videos-title">From delivery to the first brush pile.</h2></div><p>Working titles only until a reviewed video is published. No publication date, thumbnail, duration or video URL is currently available. A video does not authorize service activation.</p></div>
      <div className="attachment-checklist">{receiving.videoSlots.map(slot => {
        const publication = slot.publication;
        const published = publication && availableVideos.some(video => video === publication.video);
        return <article className={`attachment-check${published ? "" : " attachment-check--pending"}`} key={slot.id} aria-labelledby={slot.id}>
          <div className="attachment-check__top"><span>{published ? "Published video" : slot.status}</span></div>
          {published && publication.thumbnail && <img src={publication.thumbnail.src} alt={publication.thumbnail.alt} width={publication.thumbnail.width} height={publication.thumbnail.height} loading="lazy" decoding="async" />}
          <h3 id={slot.id}>{published ? publication.video.title : slot.title}</h3>
          <p>{published ? publication.video.description : slot.description}</p>
          <ul>{slot.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
          {published && <p>{publication.duration && <>Duration: {publication.duration} · </>}Published <time dateTime={publication.video.publishedAt}>{publication.video.publishedAt}</time></p>}
        </article>;
      })}</div>
      {availableVideos.length > 0 && <EquipmentWatch videos={availableVideos} equipmentId={item.passportId} channelUrl="https://www.youtube.com/@SmashProHQ" emptyMessage="No approved published grapple videos are available." />}
    </section>
  </>;
}
