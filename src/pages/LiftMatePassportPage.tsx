import { Link } from "react-router-dom";
import { liftmateEquipment as item } from "../data/liftmateEquipment";
import { PageFrame } from "../components/PageFrame";
import { SeoSchema } from "../components/SeoSchema";

export function LiftMatePassportPage() {
  return <PageFrame><SeoSchema item={item} />
    <nav className="shell breadcrumbs" aria-label="Breadcrumb"><Link to="/">Equipment</Link><span>/</span><span aria-current="page">Passport {item.fleetId}</span></nav>
    <header className="shell passport-hero">
      <div className="passport-hero__copy"><p className="eyebrow">SmashPro Equipment Passport · Proposed Partner Build</p><h1>{item.fleetId}</h1><p className="lead">{item.manufacturer} {item.identity.factoryModel}</p><p>{item.overview}</p><span className="status-pill">{item.statusLabel}</span><p>{item.statusDetail}</p></div>
      <figure className="passport-hero__media"><img src={item.heroImage} alt="Pairon Tools LiftMate Glide200 reference image" width="1200" height="900" /><figcaption>OEM reference image · SmashPro custom header artwork will replace this temporary source asset.</figcaption></figure>
    </header>
    <section className="section shell"><p className="eyebrow">Identity</p><h2>Glide200 platform. SmashPro 2027 identity.</h2><dl className="spec-grid">{item.specifications.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl></section>
    <section className="spec-section"><div className="shell"><p className="eyebrow">Purpose</p><h2>Load smarter. Work safer. Go further.</h2><p>{item.capabilityStatement}</p><ul>{item.capabilities.map(value => <li key={value}>{value}</li>)}</ul></div></section>
    <section className="section shell"><p className="eyebrow">Planned SmashPro configuration</p><h2>Visibility package.</h2><p>{item.upgrades[0].description}</p><p>The green underglow, white work lighting, corner markers and SmashPro branding shown in concept media remain design intent until the physical machine is acquired, modified and commissioned.</p></section>
    <section className="timeline-section"><div className="shell"><p className="eyebrow">Factory to fleet</p><h2>Evidence-led lifecycle.</h2><ol className="passport-timeline">{item.timeline.map(event => <li key={event.id}><article><p>{event.occurredAt}</p><h3>{event.title}</h3><p>{event.detail}</p></article></li>)}</ol></div></section>
    <section className="section shell"><p className="eyebrow">Operating boundary</p><h2>Planned, not commissioned.</h2><ul>{item.restrictions.map(value => <li key={value}>{value}</li>)}</ul></section>
  </PageFrame>;
}