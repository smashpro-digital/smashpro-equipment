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
      <section className="attachment-passport-hero">
        <div className="shell attachment-passport-hero__grid">
          <div>
            <p className="eyebrow">Attachment passport · {item.passportId}</p>
            <h1>{item.name}</h1>
            <p className="attachment-passport-hero__lede">{item.description}</p>
            <div className="button-row"><ButtonLink href="/equipment/#attachments" variant="outline">Back to attachment library</ButtonLink>{item.serviceUrl && <ButtonLink href={item.serviceUrl}>Explore supported work</ButtonLink>}</div>
          </div>
          <div className="attachment-passport-hero__visual">
            {item.image ? <img src={item.image} alt={item.imageAlt ?? item.name} /> : <div className="attachment-feature__monogram"><span>{item.width?.replace(/[^0-9]/g, "") || "SP"}</span><small>ATT</small></div>}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading"><div><p className="eyebrow">Asset identity</p><h2>One physical tool. One permanent record.</h2></div><p>This passport follows the exact attachment across procurement, commissioning, fitment verification, jobs, maintenance, and retirement.</p></div>
        <dl className="spec-grid">
          <div><dt>Passport ID</dt><dd>{item.passportId}</dd></div>
          <div><dt>Asset tag</dt><dd>{item.assetTag}</dd></div>
          <div><dt>Status</dt><dd>{item.status}</dd></div>
          <div><dt>Attachment type</dt><dd>{item.typeLabel}</dd></div>
          <div><dt>Manufacturer</dt><dd>{item.manufacturer ?? "Not assigned"}</dd></div>
          <div><dt>Model</dt><dd>{item.model ?? "Not assigned"}</dd></div>
          {item.width && <div><dt>Width</dt><dd>{item.width}</dd></div>}
          {item.weight && <div><dt>Weight</dt><dd>{item.weight}</dd></div>}
          <div><dt>Attachment plate</dt><dd>{item.plateRequirement?.label ?? "Requirement pending"}</dd></div>
        </dl>
      </section>

      <section className="attachment-detail"><div className="shell two-columns"><div><p className="eyebrow">Capabilities</p><h2>What this attachment is intended to unlock.</h2></div><ul className="feature-list">{item.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></div></section>

      <section className="section shell">
        <div className="section-heading"><div><p className="eyebrow">Fitment contract</p><h2>Compatibility starts with the interface.</h2></div><p>Machine names are evidence of verified fitment, not the compatibility key. Match the plate standard first, then confirm hydraulic, electrical, weight, geometry, and operating-envelope requirements.</p></div>
        <dl className="spec-grid">
          <div><dt>Plate standard</dt><dd>{item.plateRequirement?.label ?? "Not yet established"}</dd></div>
          <div><dt>Plate code</dt><dd>{item.plateRequirement?.standard ?? "TBD"}</dd></div>
          <div><dt>Hydraulic circuit</dt><dd>{item.hydraulicRequirement?.circuit ?? "Not required / not established"}</dd></div>
          <div><dt>Hydraulic couplers</dt><dd>{item.hydraulicRequirement?.couplers ?? "Not required / not established"}</dd></div>
          <div><dt>Pressure</dt><dd>{item.hydraulicRequirement?.pressure ?? "Not specified"}</dd></div>
          <div><dt>Flow</dt><dd>{item.hydraulicRequirement?.flow ?? "Not specified"}</dd></div>
          {item.construction?.jawOpening && <div><dt>Jaw opening</dt><dd>{item.construction.jawOpening}</dd></div>}
          {item.construction?.steelThickness && <div><dt>Steel / tine detail</dt><dd>{item.construction.steelThickness}</dd></div>}
          {item.construction?.cylinderProtection && <div><dt>Cylinder protection</dt><dd>{item.construction.cylinderProtection}</dd></div>}
        </dl>
        {item.plateRequirement?.notes && <p className="large-copy">{item.plateRequirement.notes}</p>}
        {item.verifiedFleetIds?.length ? <div className="attachment-passport-hosts"><strong>Verified host evidence</strong>{item.verifiedFleetIds.map((id) => <a href={id === "SP-ARDHI-26" ? "/equipment/sp-ardhi-26.html" : "/equipment/"} key={id}>{id}</a>)}</div> : null}
      </section>

      {item.fitmentChecklist?.length ? (
        <section className="section shell">
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

      {item.procurement ? (
        <section className="attachment-detail"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Procurement snapshot</p><h2>Commercial facts, separate from fitment.</h2></div><p>Pricing, freight, lead time, support, and payment terms are recorded without turning procurement status into an availability claim.</p></div><dl className="spec-grid">
          {item.procurement.unitPrice && <div><dt>Unit price</dt><dd>{item.procurement.unitPrice}</dd></div>}
          {item.procurement.freight && <div><dt>Freight</dt><dd>{item.procurement.freight}</dd></div>}
          {item.procurement.deliveredSubtotal && <div><dt>Subtotal</dt><dd>{item.procurement.deliveredSubtotal}</dd></div>}
          {item.procurement.stockStatus && <div><dt>Stock</dt><dd>{item.procurement.stockStatus}</dd></div>}
          {item.procurement.leadTime && <div><dt>Lead time</dt><dd>{item.procurement.leadTime}</dd></div>}
          {item.procurement.paymentStructure && <div><dt>Payment</dt><dd>{item.procurement.paymentStructure}</dd></div>}
          {item.procurement.finish && <div><dt>Finish</dt><dd>{item.procurement.finish}</dd></div>}
          {item.procurement.branding && <div><dt>Branding</dt><dd>{item.procurement.branding}</dd></div>}
          {item.procurement.warranty && <div><dt>Warranty</dt><dd>{item.procurement.warranty}</dd></div>}
          {item.procurement.replacementParts && <div><dt>Parts support</dt><dd>{item.procurement.replacementParts}</dd></div>}
        </dl></div></section>
      ) : null}
    </PageFrame>
  );
}
