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
        <div className="section-heading"><div><p className="eyebrow">Asset identity</p><h2>One physical tool. One permanent record.</h2></div><p>This passport follows the exact attachment across procurement, commissioning, compatible machines, jobs, maintenance, and retirement.</p></div>
        <dl className="spec-grid">
          <div><dt>Passport ID</dt><dd>{item.passportId}</dd></div>
          <div><dt>Asset tag</dt><dd>{item.assetTag}</dd></div>
          <div><dt>Status</dt><dd>{item.status}</dd></div>
          <div><dt>Attachment type</dt><dd>{item.typeLabel}</dd></div>
          <div><dt>Manufacturer</dt><dd>{item.manufacturer ?? "Not assigned"}</dd></div>
          <div><dt>Model</dt><dd>{item.model ?? "Not assigned"}</dd></div>
          {item.width && <div><dt>Width</dt><dd>{item.width}</dd></div>}
          {item.weight && <div><dt>Weight</dt><dd>{item.weight}</dd></div>}
          {item.mount && <div><dt>Mount</dt><dd>{item.mount}</dd></div>}
        </dl>
      </section>
      <section className="attachment-detail"><div className="shell two-columns"><div><p className="eyebrow">Capabilities</p><h2>What this attachment is intended to unlock.</h2></div><ul className="feature-list">{item.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></div></section>
      <section className="section shell"><div className="section-heading"><div><p className="eyebrow">Compatibility</p><h2>Host equipment</h2></div><p>Compatibility is recorded per physical attachment. A shared attachment type does not imply every unit fits every machine.</p></div><div className="attachment-passport-hosts">{item.compatibleFleetIds.length ? item.compatibleFleetIds.map((id) => <a href={id === "SP-ARDHI-26" ? "/equipment/sp-ardhi-26.html" : "/equipment/"} key={id}>{id}</a>) : <span>Fitment not yet approved.</span>}</div></section>
    </PageFrame>
  );
}
