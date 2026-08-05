import { Link } from "react-router-dom";
import { equipment } from "../data/equipment";
import { ButtonLink } from "../components/ButtonLink";
import { PageFrame } from "../components/PageFrame";
import { SeoSchema } from "../components/SeoSchema";

export function EquipmentDetailPage({ slug }: { slug: string }) {
  const item = equipment.find((entry) => entry.slug === slug)!;
  const related = equipment.find((entry) => entry.slug !== slug)!;
  const isArdhiFlagship = item.slug === "sp-ardhi-26";
  const isMzigoElectric = item.slug === "sp-mzigo-26";
  return (
    <PageFrame><SeoSchema item={item} />
      <nav className="shell breadcrumbs" aria-label="Breadcrumb"><Link to="/">Equipment</Link><span>/</span><span aria-current="page">{item.fleetId}</span></nav>
      <section className={`detail-hero${isArdhiFlagship ? " detail-hero--ardhi" : ""}${isMzigoElectric ? " detail-hero--electric" : ""}`}><img src={item.heroImage} alt={`${item.fleetId} ${item.category}`} width="1536" height="1024" /><div className="detail-hero__shade" /><div className="ambient-light" aria-hidden="true" /><div className="shell detail-hero__content">
        {isArdhiFlagship ? <div className="ardhi-mobile-identity"><p className="eyebrow">Fleet ID</p><h1>{item.fleetId}</h1><div className="ardhi-name"><strong>ARDHI</strong><span>(ahr-DHEE)</span></div><p className="ardhi-translation">“Earth”</p><p className="ardhi-meaning">Ardhi means earth in Swahili.</p><p className="ardhi-slogan"><span>Power.</span><span>Precision.</span><span>Purpose.</span></p><div className="button-row"><ButtonLink href="https://smashpro.app/contact">Request Availability</ButtonLink><ButtonLink href="#specifications" variant="outline">View Specifications</ButtonLink></div></div> : null}
        <div className={isArdhiFlagship ? "ardhi-desktop-identity" : undefined}>{isMzigoElectric ? <p className="electric-badge"><span aria-hidden="true">⚡</span> Fully Electric <small>Zero Tailpipe Emissions</small></p> : null}<p className="eyebrow">{item.category}</p><h1>{item.fleetId}</h1><p className="detail-name">{item.name}{item.pronunciation ? <small> / {item.pronunciation}</small> : null}</p><p className="detail-meaning">{item.meaning}</p><p className="detail-slogan">{item.slogan}</p><div className="button-row"><ButtonLink href="https://smashpro.app/contact">Request Availability</ButtonLink><ButtonLink href="#specifications" variant="outline">View Specifications</ButtonLink></div></div>
      </div></section>

      <section className="section shell detail-intro"><div><p className="eyebrow">Overview</p><h2>Purpose built for productive work.</h2></div><div><p className="large-copy">{item.overview}</p><div className="status-panel"><span className="status-light" /><div><small>Current public status</small><strong>{item.statusLabel}</strong></div></div></div></section>

      {isMzigoElectric ? <section className="green-fleet-callout"><div className="shell green-fleet-callout__inner"><div className="energy-mark" aria-hidden="true">E</div><div><p className="eyebrow">SmashPro Green Fleet Initiative</p><h2>Electric power. Contractor-focused performance.</h2><p>Professional-grade equipment designed to reduce emissions, minimize noise, lower routine operating demands, and deliver exceptional performance.</p></div></div></section> : null}

      <section className="spec-section" id="specifications"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Documented specifications</p><h2>Known equipment details.</h2></div><p>Values shown here come from the preserved approved equipment pages. Confirm operating limits and final documentation before use.</p></div><dl className="spec-grid">{item.specifications.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>{item.factoryFinish ? <div className="factory-finish"><div className="factory-finish__heading"><p className="eyebrow">Official manufacturing information</p><h3>Factory Finish</h3></div><dl className="spec-grid factory-finish__grid"><div><dt>Paint Color</dt><dd>{item.factoryFinish.paintColor}</dd></div><div><dt>Color Standard</dt><dd>{item.factoryFinish.colorStandard}</dd></div><div><dt>Coating Process</dt><dd>{item.factoryFinish.coatingProcess}</dd></div><div><dt>Factory Cure</dt><dd>{item.factoryFinish.factoryCure}</dd></div></dl><aside className="factory-finish__callout" aria-label="Factory finish note"><span aria-hidden="true">RAL 6018</span><p>{item.factoryFinish.summary}</p></aside></div> : null}</div></section>

      <section className={`section shell two-columns${isMzigoElectric ? " electric-capabilities" : ""}`}><div><p className="eyebrow">Capabilities</p><h2>What it is positioned to do.</h2><ul className="feature-list">{item.capabilities.map((value, index) => <li key={value}>{isMzigoElectric ? <span className="electric-capability-icon" aria-hidden="true">{["⚡", "◉", "◌", "✦", "+", "⌂"][index]}</span> : null}{value}</li>)}</ul></div><div><p className="eyebrow">Ideal uses</p><h2>Where it supports the work.</h2><ul className="feature-list">{item.idealUses.map((value) => <li key={value}>{value}</li>)}</ul></div></section>

      <section className="attachment-detail"><div className="shell two-columns"><div><p className="eyebrow">Included / documented</p><h2>Equipment configuration.</h2><ul className="feature-list">{item.includedAttachments.map((value) => <li key={value}>{value}</li>)}</ul></div><div><p className="eyebrow">Planned library</p><h2>Future capability.</h2><ul className="feature-list muted-list">{item.plannedAttachments.map((value) => <li key={value}>{value}<span>Not yet offered</span></li>)}</ul></div></div></section>

      <section className="section shell"><div className="section-heading"><div><p className="eyebrow">Build gallery</p><h2>Documented from the source.</h2></div><p>Approved production media is preserved at its established public path.</p></div><div className="gallery">{item.gallery.map((media) => <figure key={media.src}>{media.kind === "video" ? <video controls preload="metadata" aria-label={media.alt}><source src={media.src} type="video/mp4" /></video> : <img src={media.src} alt={media.alt} loading="lazy" width="900" height="1100" />}<figcaption>{media.caption}</figcaption></figure>)}</div></section>

      <section className="safety-section"><div className="shell two-columns"><div><p className="eyebrow">Safety and access</p><h2>Readiness before operation.</h2>{item.restrictions.map((value) => <p key={value}>{value}</p>)}</div><div className="requirements">{item.requirements.map((requirement) => <article key={requirement.title}><h3>{requirement.title}</h3><p>{requirement.detail}</p></article>)}</div></div></section>

      <section className="related shell"><div><p className="eyebrow">Related equipment</p><h2>{related.fleetId}</h2><p>{related.capabilityStatement}</p></div><Link className="related-image" to={related.publicPath}><img src={related.heroImage} alt={related.fleetId} width="1536" height="1024" loading="lazy" /><span>View equipment →</span></Link></section>

      <section className="contractor-cta"><div className="shell"><p className="eyebrow">Plan the next move</p><h2>Ask about fleet status and future access.</h2><p>No rental dates are represented as currently available.</p><ButtonLink href="https://smashpro.app/contact">Request Equipment Information</ButtonLink></div></section>
    </PageFrame>
  );
}
