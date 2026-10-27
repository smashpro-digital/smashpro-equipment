import { commissioningChecks, commissioningObservations, commissioningLifecycle, firstStartObservation, maintenanceSystems } from '../data/ardhiFlagship';
import '../styles/ardhi-production.css';
const labels = { not_started: 'Not started', in_progress: 'In progress', passed: 'Passed', needs_attention: 'Needs attention', blocked: 'Blocked' };

export function ArdhiInspections() {
  return <section className="section shell ardhi-production" id="inspections" aria-labelledby="inspections-title">
    <header><p className="eyebrow">Receiving / commissioning</p><h2 id="inspections-title">Evidence before operation.</h2><p>{commissioningLifecycle}. Not commissioned, operational or rental-ready.</p></header>
    <article className="ardhi-observation" id="first-start-observation">
      <p className="eyebrow">Owner report ? October 26, 2026</p><h3>{firstStartObservation.title}</h3>
      <p>{firstStartObservation.summary}</p><p>This is an observation, not a confirmed defective engine.</p>
      <details><summary>Original attempt: information not recorded at that time</summary><ul>{firstStartObservation.missingObservations.map(label => <li key={label}>{label}: not yet documented</li>)}</ul></details>
      <p><a href="/equipment/documents/sp-ardhi-26/yfe380-operator-instruction-manual.pdf">Existing YFE380 instruction manual</a>: applicability to this delivered YF380 and its engine must be confirmed with the manufacturer. No mechanical adjustment is prescribed here.</p>
    </article>
    <div aria-label="Later owner observations">{commissioningObservations.map(record => <article className="ardhi-observation" key={record.id}><p className="eyebrow">Owner report - {record.date}</p><h3>{record.title}</h3><p>{record.summary}</p><p>Supporting media and inspection approval pending.</p></article>)}</div>
    <ol className="ardhi-production-checks">{commissioningChecks.map(check => <li id={`commissioning-${check.id}`} key={check.id}>
      <details><summary><strong>{check.title}</strong><span className={`production-status is-${check.status}`}>{labels[check.status]}</span></summary>
      <p>{check.notes}</p><dl><div><dt>Evidence date</dt><dd>{check.date ?? 'Not recorded'} ? time not recorded</dd></div><div><dt>Review / approval</dt><dd>{check.approval === 'pending' ? 'Pending' : 'Reviewed'}</dd></div></dl>
      {check.evidence.map(e => <p key={e.href}><a href={e.href}>{e.title}</a></p>)}
      {!check.evidence.length && <p>AWAITING MEDIA / inspection evidence</p>}
      {check.issue && <p>Issue: {check.issue} Resolution: {check.resolution ?? 'Pending'}</p>}
      </details></li>)}</ol>
    <p>Operator attribution, issue resolution and sign-off require protected records. This public checklist is read-only; no inspection is submitted here.</p>
  </section>;
}

export function ArdhiMaintenancePlan() {
  return <section className="section shell ardhi-production" id="maintenance" aria-labelledby="maintenance-title">
    <p className="eyebrow">Lifetime care / preparation</p><h2 id="maintenance-title">Maintenance starts with a verified baseline.</h2>
    <p>Engine hours and applicable service intervals are not yet verified. Follow manufacturer guidance once the machine and engine are identified.</p>
    <ul className="ardhi-maintenance-systems">{maintenanceSystems.map(system => <li key={system}><strong>{system}</strong><span>Baseline inspection pending</span></li>)}</ul>
    <p>Future records need hours, applicable interval, parts, inspection evidence and next-due date. Costs, technician identities and private notes belong in Digital HQ. No schedule, completed service or operational integration is implied.</p>
    <a href="#service">View published service history</a>
  </section>;
}
