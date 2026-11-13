import { AttachmentSpecGrid } from "../components/AttachmentSpecGrid";
import { AttachmentUpgradeRegistry } from "../components/AttachmentUpgradeRegistry";
import { AttachmentReceiving } from "../components/AttachmentReceiving";
import "../styles/bucket-passport-v2.css";
import { Redirect } from "react-router-dom";
import { ButtonLink } from "../components/ButtonLink";
import { PageFrame } from "../components/PageFrame";
import { getAttachmentPassport } from "../data/attachments";

export function AttachmentPassportPage({ slug }: { slug: string }) {
  const item = getAttachmentPassport(slug);
  if (!item) return <Redirect to="/" />;

  return (
    <PageFrame>
      <div className="shell breadcrumbs"><a href="/equipment/">Equipment</a><span>/</span><a href="/equipment/#attachments">Attachments</a><span>/</span><span>{item.passportId}</span></div>
      <section className={`attachment-passport-hero${item.passportId === "SP-ATT-BKT-001" ? " bucket-passport-hero" : ""}`}>
        <div className="shell attachment-passport-hero__grid">
          <div>
            <p className="eyebrow">Attachment passport · {item.passportId}</p>
            <h1>{item.name}</h1>
            {item.receiving && <><p className="attachment-status attachment-status--commissioning">{item.receiving.statusLabel}</p><p>{item.manufacturer} · {item.model} · Serial {item.receiving.serialNumber}</p></>}
            {item.passportId === "SP-ATT-BKT-001" && <><p className="bucket-upgrade-state">Six-tooth upgrade / Ordered</p><p className="bucket-hero-facts">42.91-inch factory width / SP-BKT-ARDHI-01<br />Toro Dingo / Mini Universal / SP-ARDHI-26</p></>}
            <p className="attachment-passport-hero__lede">{item.description}</p>
            <div className="button-row"><ButtonLink href="/equipment/#attachments" variant="outline">Back to attachment library</ButtonLink>{item.serviceUrl && <ButtonLink href={item.serviceUrl}>Explore supported work</ButtonLink>}</div>
          </div>
          <div className={`attachment-passport-hero__visual${item.passportId === "SP-ATT-GRP-001" ? " attachment-visual--loflin" : ""}${item.receiving && item.image ? " attachment-visual--receiving" : ""}`}>
            {item.image ? <img src={item.image} srcSet={item.imageMetadata?.srcSet} sizes="(max-width: 768px) 90vw, 45vw" width={item.imageMetadata?.width} height={item.imageMetadata?.height} alt={item.imageAlt ?? item.name} decoding="async" /> : item.receiving ? <div className="attachment-photo-placeholder"><strong>Actual delivered grapple photograph pending</strong><p>Approved owner hero image unavailable. Serial {item.receiving.serialNumber}; no catalog image substituted.</p></div> : <div className="attachment-feature__monogram"><span>{item.width?.replace(/[^0-9]/g, "") || "SP"}</span><small>ATT</small></div>}
            {item.passportId === "SP-ATT-GRP-001" && item.image && <>
              <span className="attachment-feature__fleet">{item.imageMetadata?.caption ?? "Owner receiving photograph · November 11, 2026"}</span>
            </>}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading"><div><p className="eyebrow">Asset identity</p><h2>One physical tool. One permanent record.</h2></div><p>This passport follows the exact attachment across procurement, commissioning, fitment verification, jobs, maintenance, and retirement.</p></div>
        <AttachmentSpecGrid fields={[
          { label: "Passport ID", value: item.passportId },
          { label: "Asset tag", value: item.assetTag },
          { label: "Status", value: item.receiving?.statusLabel ?? item.status },
          { label: "Attachment type", value: item.typeLabel },
          { label: "Manufacturer", value: item.manufacturer },
          { label: "Model", value: item.model },
          { label: "Serial number", value: item.receiving?.serialNumber },
          { label: "Manufacture date", value: item.receiving?.manufacturedAt },
          { label: "Manufacturer job ID", value: item.receiving?.manufacturerJobId },
          { label: "Width", value: item.width },
          { label: "Weight", value: item.weight },
          { label: "Physical nameplate weight", value: item.receiving?.nameplateWeight },
          { label: "Nameplate mounting interface", value: item.receiving?.nameplateMount },
          { label: "Planned host · fitment pending", value: item.receiving?.hostFleetId },
          { label: "Attachment plate", value: item.plateRequirement?.label },
        ]} />
      </section>

      <section className="attachment-detail"><div className="shell two-columns"><div><p className="eyebrow">Capabilities</p><h2>What this attachment is intended to unlock.</h2></div><ul className="feature-list">{item.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></div></section>

      <section className="section shell">
        <div className="section-heading"><div><p className="eyebrow">Fitment contract</p><h2>Compatibility starts with the interface.</h2></div><p>Machine names are evidence of verified fitment, not the compatibility key. Match the plate standard first, then confirm hydraulic, electrical, weight, geometry, and operating-envelope requirements.</p></div>
        <AttachmentSpecGrid fields={[
          { label: "Plate standard", value: item.plateRequirement?.label },
          { label: "Plate code", value: item.plateRequirement?.standard },
          { label: "Hydraulic circuit", value: item.hydraulicRequirement?.circuit },
          { label: "Hydraulic couplers", value: item.hydraulicRequirement?.couplers },
          { label: "Pressure", value: item.hydraulicRequirement?.pressure },
          { label: "Factory test sticker", value: item.receiving?.factoryTest },
          { label: "Flow", value: item.hydraulicRequirement?.flow },
          { label: "Jaw opening", value: item.construction?.jawOpening },
          { label: "Steel / tine detail", value: item.construction?.steelThickness },
          { label: "Cylinder protection", value: item.construction?.cylinderProtection },
        ]} />
        {item.plateRequirement?.notes && <p className="large-copy">{item.plateRequirement.notes}</p>}
        {item.hydraulicRequirement?.notes && <p className="large-copy">{item.hydraulicRequirement.notes}</p>}
        {item.verifiedFleetIds?.length ? <div className="attachment-passport-hosts"><strong>Verified host evidence</strong>{item.verifiedFleetIds.map((id) => <a href={id === "SP-ARDHI-26" ? "/equipment/sp-ardhi-26.html" : "/equipment/"} key={id}>{id}</a>)}</div> : null}
      </section>


      <AttachmentReceiving item={item} />
      <AttachmentUpgradeRegistry item={item} />

      {!item.receiving && item.fieldEvidence?.length ? <section className="section shell" id="attachment-field-evidence">
        <div className="section-heading"><div><p className="eyebrow">Field evidence</p><h2>From attachment to actual work.</h2></div><p>Selected, verified attachment photographs belong here. Full customer grading portfolios stay with their project records.</p></div>
        <div className="attachment-checklist">{item.fieldEvidence.map((evidence) => <article className="attachment-check" key={evidence.id}>
          <div className="attachment-check__top"><span>{evidence.status === "verified" ? "Documented image" : "Awaiting field evidence"}</span></div>
          {evidence.status === "verified" && evidence.image ? <img src={evidence.image} alt={evidence.imageAlt ?? evidence.title} loading="lazy" style={{width:"100%",height:"auto",maxHeight:"300px",objectFit:"contain",marginBottom:"1rem"}}/> : null}
          <h3>{evidence.title}</h3><p>{evidence.description}</p>
          {evidence.status === "verified" && evidence.projectUrl ? <a href={evidence.projectUrl}>View project portfolio</a> : null}
        </article>)}</div>
      </section> : null}

      {item.fitmentChecklist?.length ? (
        <section className="section shell" id="attachment-fitment">
          <div className="section-heading"><div><p className="eyebrow">Procurement fitment checklist</p><h2>The questions we ask before steel meets machine.</h2></div><p>This checklist is carried forward from real attachment procurement so future purchases are evaluated against the same standard.</p></div>
          <div className="attachment-checklist">
            {item.fitmentChecklist.map((check) => (
              <article className={`attachment-check attachment-check--${check.status}`} key={check.key}>
                <div className="attachment-check__top"><span>{check.status}</span>{check.source && <small>{check.source}</small>}</div>
                <h3>{check.question}</h3>
                <p>{check.answer ?? "Awaiting confirmation"}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {item.passportId === "SP-ATT-BKT-001" && <section className="section shell" id="attachment-related-work">
        <div className="section-heading"><div><p className="eyebrow">Related work</p><h2>See the bucket in context.</h2></div><p>Customer project articles are published and associated with the canonical service category through SmashPro's existing project infrastructure. Booking stays with the service workflow.</p></div>
        <div className="button-row">
          <ButtonLink href="https://smashpro.app/ardhi-six-tooth-bucket-upgrade/">Read the six-tooth upgrade journal</ButtonLink>
          <ButtonLink href="/equipment/sp-ardhi-26.html" variant="outline">ARDHI equipment passport</ButtonLink>
          <ButtonLink href="https://smashpro.app/services/">Browse related services</ButtonLink>
        </div>
      </section>}

      {item.procurement ? (
        <section className="attachment-detail"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Procurement snapshot</p><h2>Commercial facts, separate from fitment.</h2></div><p>Pricing, freight, lead time, support, and payment terms are recorded without turning procurement status into an availability claim.</p></div><AttachmentSpecGrid fields={[
          { label: "Unit price", value: item.procurement.unitPrice },
          { label: "Freight", value: item.procurement.freight },
          { label: "Subtotal", value: item.procurement.deliveredSubtotal },
          { label: "Stock", value: item.procurement.stockStatus },
          { label: "Lead time", value: item.procurement.leadTime },
          { label: "Payment", value: item.procurement.paymentStructure },
          { label: "Finish", value: item.procurement.finish },
          { label: "Branding", value: item.procurement.branding },
          { label: "Warranty", value: item.procurement.warranty },
          { label: "Parts support", value: item.procurement.replacementParts },
        ]} /></div></section>
      ) : null}
    </PageFrame>
  );
}
