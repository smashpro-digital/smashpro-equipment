import type { CSSProperties } from 'react';
import type { Equipment } from '../types/equipment';
import postDelivery from '../data/ardhiPostDelivery.json';
import { ardhiDelivery } from '../data/ardhiDelivery';
import { sponsorRoadmap } from '../data/ardhiExpo';
import { commissioningChecks, firstJob, firstJobPresentation, futureAttachments, missionProfile, missionTimeline, serviceAttention, serviceEntries, verifiedEvidence } from '../data/ardhiFlagship';

export function ArdhiMissionDashboard() {
  const fields = [
    ['Current Mission', 'Commissioning & field evaluation'], ['Current Lifecycle', 'Delivered / pre-service'],
    ['Current Chapter', 'First dirt-day evaluation'], ['Service Hours', '~5 reported · meter not verified'],
    ['Fleet Status', 'Open service items'], ['Next Event', 'Throttle diagnosis / inspections'],
    ['Current Evidence', 'Operator report / media review pending'], ['Current Location', 'Delivery complete / location withheld'],
  ];
  return <section className="shell flagship-dashboard" id="mission-dashboard" aria-labelledby="mission-dashboard-title">
    <header><div><p className="eyebrow">Fleet Asset 001 / Mission Control</p><h2 id="mission-dashboard-title">SP-ARDHI-26</h2></div><p><span className="flagship-status-dot" aria-hidden="true" /> {ardhiDelivery.status}</p></header>
    <dl>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <footer><span>Delivered October 26; field evaluation reported October 31; open service items; commissioning approval pending</span><a href="#field-evaluation">View current chapter ↗</a></footer>
  </section>;
}

export function ArdhiMissionProfile({ item }: { item: Equipment }) {
  const installed = [...item.attachments.filter(a => a.status === 'installed' && ['ardhi-bucket', 'ardhi-forks'].includes(a.id)).map(a => a.name === 'General-purpose bucket' ? 'Bucket' : 'Pallet Forks'), '3 Pump', '3 Valve', 'RAL 6018', 'Quick Attach'];
  return <>
    <div className="flagship-profile"><div><p className="eyebrow">Mission Profile</p><h3>Built to move the work forward.</h3><p>{item.overview}</p></div><div className="flagship-profile-grid">{missionProfile.slice(0, 4).map(field => <article key={field.title}><span aria-hidden="true">{field.icon}</span><h4>{field.title}</h4><p>{field.text}</p></article>)}</div></div>
    <details className="flagship-disclosure"><summary>Customers, attachments & future opportunities</summary><div className="flagship-profile-grid">{missionProfile.slice(4).map(field => <article key={field.title}><span aria-hidden="true">{field.icon}</span><h4>{field.title}</h4><p>{field.text}</p></article>)}</div></details>
    <div className="flagship-capabilities" id="capabilities"><h3>Current capabilities</h3><p>Installed / factory supplied. Field readiness follows delivery and commissioning.</p><ul aria-label="Installed configuration">{installed.map(label => <li key={label}><span aria-hidden="true">✓</span> {label}</li>)}</ul><h4>Future attachments</h4><ul className="is-future" aria-label="Future attachments">{futureAttachments.map(label => { const installed = item.attachments.some(attachment => attachment.status === 'installed' && attachment.name.toLowerCase().replace('landscape ', '') === label.toLowerCase()); return <li key={label} className={installed ? 'is-installed' : undefined}>{label}<small>{installed ? 'Installed' : 'Not installed'}</small></li>; })}</ul><p className="flagship-note">Future fitment, hydraulic compatibility and installation remain to be verified.</p></div>
  </>;
}

export function ArdhiMissionTimeline({ expo = false }: { expo?: boolean }) {
  const timeline = expo ? sponsorRoadmap : missionTimeline;
  const complete = timeline.filter(step => step.state === 'complete').length;
  return <section className="shell flagship-roadmap" aria-labelledby="mission-timeline-title">
    <header><p className="eyebrow">Factory floor → first job → lifetime record</p><h2 id="mission-timeline-title">Mission Timeline</h2><p>Delivery is complete. Commissioning and field evaluation are underway; inspection follow-up and final approval remain pending.</p></header>
    <div className="flagship-progress" role="progressbar" aria-label="Documented mission milestones" aria-valuemin={0} aria-valuemax={timeline.length} aria-valuenow={complete} aria-valuetext={`${complete} of ${timeline.length} milestones complete; commissioning approval pending`}><span style={{ '--mission-progress': `${complete / timeline.length * 100}%` } as CSSProperties} /></div>
    <ol>{timeline.map((step, i) => <li key={step.title} className={`is-${step.state}`} aria-current={step.state === 'current' ? 'step' : undefined}><span>{String(i + 1).padStart(2, '0')}</span><a href={step.href}>{step.title}</a><small>{step.detail}</small></li>)}</ol>
    <p className="flagship-note">{expo ? 'Future milestones are ambitions, not booked jobs, awarded contracts or connected automation. Each invites a scoped contribution.' : 'Hours are record milestones, not manufacturer service intervals. Follow the operator manual for maintenance.'}</p>
  </section>;
}

export function ArdhiServiceRecord() {
  const job = firstJobPresentation(firstJob, commissioningChecks);
  const columns = ['Hours', 'Date', 'Photos', 'Parts', 'Attachments', 'Warranty'];
  const verifiedServices = serviceEntries.filter(entry => verifiedEvidence(entry.evidence).length > 0);
  return <section className="section shell ardhi-service-record flagship-service" id="service" aria-labelledby="service-record-title">
    <header><p className="eyebrow">Service / Field Readiness</p><h2 id="service-record-title">From delivery to field evaluation.</h2><p>{postDelivery.readiness}</p></header>
    <article className="ardhi-observation" id="field-evaluation"><p className="eyebrow">Operator report · Updated {postDelivery.asOf}</p><h3>October 31 dirt day</h3><p>{postDelivery.summary}</p><ul>{postDelivery.fieldActivities.map(activity => <li key={activity}>{activity}</li>)}</ul><p>A full pallet lift is not documented. Rated lifting capacity and load center require verification before a full pallet lift is authorized.</p><p>{postDelivery.mediaSummary}</p><a href="#delivery-media">Existing delivery evidence</a></article>
    <article className="ardhi-observation" id="reported-operating-time"><p className="eyebrow">Operator report · Updated 2026-11-02</p><h3>Reported operating time</h3><p>Reported operating time totals roughly five hours, including a 3+ hour session. These are operator-reported durations, not a verified hour-meter reading.</p></article>
    <div className="flagship-media-entry" id="media-collection-entry"><div><p className="eyebrow">ARDHI in pictures</p><h3>Explore the documented journey.</h3><p>Factory build, shipping, uncrating, Dirt Day and the inspection follow-ups - curated photos and clips in one collection, with the full stories preparing for SmashPro Stories.</p></div><div className="flagship-media-entry__actions"><a href="/equipment/sp-ardhi-26-media.html">Browse the media collection</a><a href="/equipment/sp-ardhi-26-media.html#featured-story">Featured stories</a></div></div>
    <div className="flagship-profile-grid" aria-label="Post-delivery milestones">{postDelivery.milestones.map(entry => <article key={entry.key}><p className="eyebrow">{entry.date}</p><h3>{entry.title}</h3><p>{entry.summary}</p><a href={entry.href}>View record</a></article>)}</div>
    <div id="night-ops"><h3>Night Ops development</h3><div className="flagship-profile-grid">{postDelivery.nightOps.map(stage => <article key={stage.title}><p className="eyebrow">{stage.status}</p><h4>{stage.title}</h4><p>{stage.summary}</p></article>)}</div></div>
    <h3>Inspection follow-up</h3><p>{postDelivery.maintenanceSummary}</p><p>{serviceAttention}</p>
    <h3>Attachments and upgrades</h3><p>{postDelivery.upgradeSummary}</p>
    <div className="flagship-first-job"><div><p className="eyebrow">{job.title}</p><h3>{job.mission}</h3></div><dl><div><dt>Estimated</dt><dd>{job.estimate}</dd></div></dl><p>Becomes Project 001 when commissioning and the completed job have public supporting evidence.</p></div>
    <h3>Service record</h3><p>Future public entries will retain reviewed hours and supporting evidence. Technician identities, costs and private notes remain protected.</p>
    <div className="flagship-service-grid" role="table" aria-label="Service record"><div role="row" className="flagship-service-head">{columns.map(title => <strong role="columnheader" key={title}>{title}</strong>)}</div>{verifiedServices.map(entry => <div role="row" key={entry.id}>{[String(entry.hours), entry.date, entry.photos.map(photo => <a key={photo.href} href={photo.href}>{photo.title}</a>), entry.parts.join(', '), entry.attachments.join(', '), entry.warranty].map((value, i) => <div role="cell" key={columns[i]}><span className="flagship-mobile-label" aria-hidden="true">{columns[i]}</span>{value}</div>)}</div>)}</div>
    {!verifiedServices.length && <p className="flagship-empty">No maintenance entries have been published. This read-only record does not submit service work.</p>}
  </section>;
}

export function ArdhiFleetConnections({ item, showPartners = true }: { item: Equipment; showPartners?: boolean }) {
  const partners = (item.partners ?? []).filter(partner => ["confirmed", "active", "completed"].includes(partner.status));
  return <section className="section shell flagship-ecosystem" aria-labelledby="fleet-connections-title">
    <header><p className="eyebrow">People / Platforms / Possibilities</p><h2 id="fleet-connections-title">A machine within a fleet.</h2></header>
    {showPartners && <><h3>Partners</h3><div className="flagship-partners">
      {partners.map(partner => <article key={partner.id}><small>Manufacturer · {partner.status}</small><h4>{partner.brand}</h4><p>{partner.description}</p>{partner.storyUrl && <a href={partner.storyUrl}>Build record ↗</a>}</article>)}
      <article><small>Logistics · Pending</small><h4>Tri-Lift</h4><p>Proposed field support. Appointment and engagement pending.</p></article>
      <article><small>Carrier / Delivery documented</small><h4>R+L Carriers</h4><p>October 26 final-mile delivery from CONVOY USA-SAVANNAH. A service relationship, not a sponsorship.</p></article>
      <article><small>Sponsors · Open</small><h4>Build the next chapter.</h4><p>Attachment trials, field support and service opportunities.</p></article>
    </div></>}
    <h3>Fleet connections</h3><p className="flagship-note">Shared fleet context. This sequence does not certify a towing configuration or transport readiness.</p><ol className="flagship-connections"><li><a href="/rebirth/">Project Rebirth</a></li><li><a href="#passport">SP-ARDHI-26</a></li><li><a href="/equipment/sp-mzigo-26.html">MZIGO</a></li><li><a href="/equipment/">Trailer · Planned</a></li><li><a href="/equipment/">Future Fleet</a></li></ol>
  </section>;
}
