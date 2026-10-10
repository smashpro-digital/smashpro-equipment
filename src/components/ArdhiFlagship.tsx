import type { CSSProperties } from 'react';
import type { Equipment } from '../types/equipment';
import { ardhiPortArrival } from '../data/ardhiPortArrival';
import { commissioningChecks, firstJob, firstJobPresentation, futureAttachments, missionProfile, missionTimeline, serviceEntries, verifiedEvidence } from '../data/ardhiFlagship';

export function ArdhiMissionDashboard() {
  const fields = [
    ['Current Mission', ardhiPortArrival.mission], ['Current Lifecycle', 'Import & delivery'],
    ['Current Chapter', 'Awaiting Release'], ['Service Hours', '0 recorded · commissioning pending'],
    ['Fleet Status', 'Pre-service'], ['Next Event', 'Customs release'],
    ['Current Evidence', `${ardhiPortArrival.confidence} · ${ardhiPortArrival.source}`], ['Current Location', ardhiPortArrival.location],
  ];
  return <section className="shell flagship-dashboard" id="mission-dashboard" aria-labelledby="mission-dashboard-title">
    <header><div><p className="eyebrow">Fleet Asset 001 / Mission Control</p><h2 id="mission-dashboard-title">SP-ARDHI-26</h2></div><p><span className="flagship-status-dot" aria-hidden="true" /> {ardhiPortArrival.currentStage}</p></header>
    <dl>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <footer><span>Manufacturer confirmation recorded October 9, 2026 · arrival date not supplied</span><a href="#history-port-arrival">View current evidence ↗</a></footer>
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

export function ArdhiMissionTimeline() {
  const complete = missionTimeline.filter(step => step.state === 'complete').length;
  return <section className="shell flagship-roadmap" aria-labelledby="mission-timeline-title">
    <header><p className="eyebrow">Factory floor → first job → lifetime record</p><h2 id="mission-timeline-title">Mission Timeline</h2><p>Shipping is the current chapter. The ocean leg is complete; port release is next.</p></header>
    <div className="flagship-progress" role="progressbar" aria-label="Documented mission milestones" aria-valuemin={0} aria-valuemax={missionTimeline.length} aria-valuenow={complete} aria-valuetext={`${complete} of ${missionTimeline.length} milestones complete; shipping in progress`}><span style={{ '--mission-progress': `${complete / missionTimeline.length * 100}%` } as CSSProperties} /></div>
    <ol>{missionTimeline.map((step, i) => <li key={step.title} className={`is-${step.state}`} aria-current={step.state === 'current' ? 'step' : undefined}><span>{String(i + 1).padStart(2, '0')}</span><a href={step.href}>{step.title}</a><small>{step.detail}</small></li>)}</ol>
    <p className="flagship-note">Hours are record milestones, not manufacturer service intervals. Follow the operator manual for maintenance.</p>
  </section>;
}

export function ArdhiServiceRecord() {
  const job = firstJobPresentation(firstJob, commissioningChecks);
  const columns = ['Hours', 'Date', 'Technician', 'Photos', 'Parts', 'Attachments', 'Warranty'];
  const verifiedServices = serviceEntries.filter(entry => verifiedEvidence(entry.evidence).length > 0);
  return <section className="section shell ardhi-service-record flagship-service" id="service" aria-labelledby="service-record-title">
    <header><p className="eyebrow">Service / Field Readiness</p><h2 id="service-record-title">The next chapter starts here.</h2><p>Awaiting commissioning. No field service hours or completed service entries have been recorded.</p></header>
    <details className="flagship-disclosure" open><summary>Commissioning <span>{commissioningChecks.filter(check => verifiedEvidence(check.evidence).length > 0).length} / {commissioningChecks.length} documented</span></summary><ol className="flagship-checklist">{commissioningChecks.map(check => <li key={check.id} id={`commissioning-${check.id}`}><details><summary><span aria-hidden="true">{verifiedEvidence(check.evidence).length ? '✓' : '○'}</span> {check.title}<small>{verifiedEvidence(check.evidence).length ? 'Documented' : 'Pending'}</small></summary><div>{verifiedEvidence(check.evidence).length ? verifiedEvidence(check.evidence).map(evidence => <a key={evidence.href} href={evidence.href}>{evidence.title}</a>) : <p>Evidence slot for {check.title.toLowerCase()}: dated inspection, photograph or approved record. Completion will appear after review.</p>}</div></details></li>)}</ol></details>
    <div className="flagship-first-job"><div><p className="eyebrow">{job.title}</p><h3>{job.mission}</h3></div><dl><div><dt>Estimated</dt><dd>{job.estimate}</dd></div></dl><p>Becomes Project 001 when commissioning and the completed job have public supporting evidence.</p></div>
    <h3>Service record</h3><p>Every future entry retains its hours, technician and supporting evidence.</p>
    <div className="flagship-service-grid" role="table" aria-label="Service record"><div role="row" className="flagship-service-head">{columns.map(title => <strong role="columnheader" key={title}>{title}</strong>)}</div>{verifiedServices.map(entry => <div role="row" key={entry.id}>{[String(entry.hours), entry.date, entry.technician, entry.photos.map(photo => <a key={photo.href} href={photo.href}>{photo.title}</a>), entry.parts.join(', '), entry.attachments.join(', '), entry.warranty].map((value, i) => <div role="cell" key={columns[i]}><span className="flagship-mobile-label" aria-hidden="true">{columns[i]}</span>{value}</div>)}</div>)}</div>
    {!verifiedServices.length && <p className="flagship-empty">The service log is ready. Its first entry follows commissioning.</p>}
  </section>;
}

export function ArdhiFleetConnections({ item }: { item: Equipment }) {
  const partners = (item.partners ?? []).filter(partner => ["confirmed", "active", "completed"].includes(partner.status));
  return <section className="section shell flagship-ecosystem" aria-labelledby="fleet-connections-title">
    <header><p className="eyebrow">People / Platforms / Possibilities</p><h2 id="fleet-connections-title">A machine within a fleet.</h2></header>
    <h3>Partners</h3><div className="flagship-partners">
      {partners.map(partner => <article key={partner.id}><small>Manufacturer · {partner.status}</small><h4>{partner.brand}</h4><p>{partner.description}</p>{partner.storyUrl && <a href={partner.storyUrl}>Build record ↗</a>}</article>)}
      <article><small>Logistics · Pending</small><h4>Tri-Lift</h4><p>Proposed field support. Appointment and engagement pending.</p></article>
      <article><small>Freight · Pending</small><h4>Partner confirmation</h4><p>Public freight relationship to be confirmed.</p></article>
      <article><small>Sponsors · Open</small><h4>Build the next chapter.</h4><p>Attachment trials, field support and service opportunities.</p></article>
    </div>
    <h3>Fleet connections</h3><p className="flagship-note">Shared fleet context. This sequence does not certify a towing configuration or transport readiness.</p><ol className="flagship-connections"><li><a href="/rebirth/">Project Rebirth</a></li><li><a href="#passport">SP-ARDHI-26</a></li><li><a href="/equipment/sp-mzigo-26.html">MZIGO</a></li><li><a href="/equipment/">Trailer · Planned</a></li><li><a href="/equipment/">Future Fleet</a></li></ol>
  </section>;
}
