import { Link } from "react-router-dom";
import { equipment } from "../data/equipment";
import { ButtonLink } from "../components/ButtonLink";
import { PageFrame } from "../components/PageFrame";
import { SeoSchema } from "../components/SeoSchema";

export function EquipmentDetailPage({ slug }: { slug: string }) {
  const item = equipment.find((entry) => entry.slug === slug)!;
  const related = equipment.find((entry) => entry.slug !== slug)!;
  return (
    <PageFrame><SeoSchema item={item} />
      <nav className="shell breadcrumbs" aria-label="Breadcrumb"><Link to="/">Equipment</Link><span>/</span><span aria-current="page">{item.fleetId}</span></nav>
      <section className="detail-hero"><img src={item.heroImage} alt={`${item.fleetId} ${item.category}`} width="1536" height="1024" /><div className="detail-hero__shade" /><div className="shell detail-hero__content"><p className="eyebrow">{item.category}</p><h1>{item.fleetId}</h1><p className="detail-name">{item.name}{item.pronunciation ? <small> / {item.pronunciation}</small> : null}</p><p className="detail-meaning">{item.meaning}</p><p className="detail-slogan">{item.slogan}</p><div className="button-row"><ButtonLink href="https://smashpro.app/contact">Request Availability</ButtonLink><ButtonLink href="#specifications" variant="outline">View Specifications</ButtonLink></div></div></section>

      <section className="section shell detail-intro"><div><p className="eyebrow">Overview</p><h2>Purpose built for productive work.</h2></div><div><p className="large-copy">{item.overview}</p><div className="status-panel"><span className="status-light" /><div><small>Current public status</small><strong>{item.statusLabel}</strong></div></div></div></section>

      <section className="spec-section" id="specifications"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Documented specifications</p><h2>Known equipment details.</h2></div><p>Values shown here come from the preserved approved equipment pages. Confirm operating limits and final documentation before use.</p></div><dl className="spec-grid">{item.specifications.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl></div></section>

      <section className="section shell two-columns"><div><p className="eyebrow">Capabilities</p><h2>What it is positioned to do.</h2><ul className="feature-list">{item.capabilities.map((value) => <li key={value}>{value}</li>)}</ul></div><div><p className="eyebrow">Ideal uses</p><h2>Where it supports the work.</h2><ul className="feature-list">{item.idealUses.map((value) => <li key={value}>{value}</li>)}</ul></div></section>

      <section className="attachment-detail"><div className="shell two-columns"><div><p className="eyebrow">Included / documented</p><h2>Equipment configuration.</h2><ul className="feature-list">{item.includedAttachments.map((value) => <li key={value}>{value}</li>)}</ul></div><div><p className="eyebrow">Planned library</p><h2>Future capability.</h2><ul className="feature-list muted-list">{item.plannedAttachments.map((value) => <li key={value}>{value}<span>Not yet offered</span></li>)}</ul></div></div></section>

      <section className="section shell"><div className="section-heading"><div><p className="eyebrow">Build gallery</p><h2>Documented from the source.</h2></div><p>Approved production media is preserved at its established public path.</p></div><div className="gallery">{item.gallery.map((media) => <figure key={media.src}>{media.kind === "video" ? <video controls preload="metadata" aria-label={media.alt}><source src={media.src} type="video/mp4" /></video> : <img src={media.src} alt={media.alt} loading="lazy" width="900" height="1100" />}<figcaption>{media.caption}</figcaption></figure>)}</div></section>

      <section className="safety-section"><div className="shell two-columns"><div><p className="eyebrow">Safety and access</p><h2>Readiness before operation.</h2>{item.restrictions.map((value) => <p key={value}>{value}</p>)}</div><div className="requirements">{item.requirements.map((requirement) => <article key={requirement.title}><h3>{requirement.title}</h3><p>{requirement.detail}</p></article>)}</div></div></section>

      <section className="related shell"><div><p className="eyebrow">Related equipment</p><h2>{related.fleetId}</h2><p>{related.capabilityStatement}</p></div><Link className="related-image" to={related.publicPath}><img src={related.heroImage} alt={related.fleetId} width="1536" height="1024" loading="lazy" /><span>View equipment →</span></Link></section>

      <section className="contractor-cta"><div className="shell"><p className="eyebrow">Plan the next move</p><h2>Ask about fleet status and future access.</h2><p>No rental dates are represented as currently available.</p><ButtonLink href="https://smashpro.app/contact">Request Equipment Information</ButtonLink></div></section>
    </PageFrame>
  );
}
