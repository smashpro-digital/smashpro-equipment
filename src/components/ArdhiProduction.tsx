import { useEffect, useState } from 'react';
import { factoryStartupReference, commissioningChecks, commissioningObservations, commissioningLifecycle, fieldFindings, firstStartObservation, maintenanceBaselines } from '../data/ardhiFlagship';
import { isFleetLifecycleEvent, mergePublicLifecycleEvents, publicLifecycleForAsset } from '../data/fleetLifecycle';
import type { FleetLifecycleEvent } from '../data/fleetLifecycle';
import '../styles/ardhi-production.css';
const labels = { not_started: 'Not started', in_progress: 'In progress', passed: 'Passed', needs_attention: 'Needs attention', blocked: 'Blocked' };

export function ArdhiInspections() {
  return <section className="section shell ardhi-production" id="inspections" aria-labelledby="inspections-title">
    <header><p className="eyebrow">Receiving / commissioning</p><h2 id="inspections-title">Evidence before operation.</h2><p>{commissioningLifecycle}. Not commissioned, operational or rental-ready.</p></header>
    <article className="ardhi-startup-reference" id="factory-startup-reference" aria-labelledby="factory-startup-title">
      <p className="eyebrow">Factory guidance / testing and inspection</p>
      <h3 id="factory-startup-title">{factoryStartupReference.title}</h3>
      <p>{factoryStartupReference.description}</p>
      <video controls playsInline preload="none" poster={factoryStartupReference.poster} width="1920" height="1080" aria-label="Factory startup and shutdown demonstration" aria-describedby="factory-startup-context">
        <source src={factoryStartupReference.src} type="video/mp4" />
        Your browser does not support this video. <a href={factoryStartupReference.src}>Watch the factory startup reference</a>.
      </video>
      <p id="factory-startup-context">{factoryStartupReference.applicability}</p>
    </article>
    <article className="ardhi-observation" id="first-start-observation">
      <p className="eyebrow">Historical owner report - October 26, 2026</p><h3>{firstStartObservation.title}</h3>
      <p>{firstStartObservation.summary}</p><p>This is an observation, not a confirmed defective engine.</p>
      <details><summary>Original attempt: information not recorded at that time</summary><ul>{firstStartObservation.missingObservations.map(label => <li key={label}>{label}: not yet documented</li>)}</ul></details>
      <p><a href="/equipment/documents/sp-ardhi-26/yfe380-operator-instruction-manual.pdf">Existing YFE380 instruction manual</a>: applicability to this delivered YF380 and its engine must be confirmed with the manufacturer. No mechanical adjustment is prescribed here.</p>
    </article>
    <div aria-label="October 26 historical observations">{commissioningObservations.map(record => <article className="ardhi-observation" key={record.id}><p className="eyebrow">Owner report - {record.date}</p><h3>{record.title}</h3><p>{record.summary}</p></article>)}</div>
    <p>Historical observations are preserved as recorded. See the post-delivery findings below for subsequent recovery and open items; inspection approval remains pending.</p>
    <div aria-label="Post-delivery findings" className="ardhi-field-findings">{fieldFindings.map(finding => <article className="ardhi-observation" key={finding.id}><p className="eyebrow">{finding.state} · {finding.date}</p><h3>{finding.title}</h3><p>{finding.summary}</p></article>)}</div>
    <p>Updated November 8, 2026: owner-reported repairs are distinguished from independent inspection and approval. Expand an item for its latest update, evidence and outstanding checks.</p>
    <ol className="ardhi-production-checks">{commissioningChecks.map(check => <li id={`commissioning-${check.id}`} key={check.id}>
      <details><summary><strong>{check.title}</strong><span className={`production-status is-${check.status}`}>{check.progressLabel ?? labels[check.status]}</span></summary>
      <p>{check.notes}</p><dl>{check.activity && <div><dt>Activity / latest update</dt><dd>{check.activity}</dd></div>}<div><dt>Evidence date</dt><dd>{check.date ?? 'Not recorded'} - time not recorded</dd></div><div><dt>Review / approval</dt><dd>{check.approval === 'pending' ? 'Pending' : 'Reviewed'}</dd></div>{check.outstanding && <div><dt>Outstanding</dt><dd>{check.outstanding}</dd></div>}</dl>
      {check.evidence.map(e => <p key={e.href}><a href={e.href}>{e.title}</a></p>)}
      {!check.evidence.length && <p>AWAITING MEDIA / inspection evidence</p>}
      {check.issue && <p>Issue: {check.issue} Resolution: {check.resolution ?? 'Pending'}</p>}
      </details></li>)}</ol>
    <p><a href="#maintenance">Latest: lifecycle and open service items (updated November 8)</a></p>
    <p>Operator attribution, issue resolution and sign-off require protected records. This public checklist is read-only; no inspection is submitted here.</p>
  </section>;
}

export function ArdhiMaintenancePlan() {
  const [dbEvents, setDbEvents] = useState<FleetLifecycleEvent[] | null>(null);
  const [feedState, setFeedState] = useState<'loading' | 'live' | 'unavailable'>('loading');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/dashboard/api/public_fleet_lifecycle.php?asset=SP-ARDHI-26', { signal: controller.signal, credentials: 'omit', cache: 'no-store' })
      .then(async response => { if (!response.ok) throw new Error('Feed unavailable'); return response.json(); })
      .then(payload => {
        if (payload?.ok !== true || payload.schema_version !== 2 || payload.asset_id !== 'SP-ARDHI-26' || !Array.isArray(payload.events)) throw new Error('Invalid feed');
        const valid = payload.events
          .filter(isFleetLifecycleEvent)
          .filter((event: FleetLifecycleEvent) => event.approval === 'reviewed')
          .flatMap((event: FleetLifecycleEvent) => publicLifecycleForAsset('SP-ARDHI-26', [event]));
        setDbEvents(valid); setFeedState('live');
      }).catch(() => { if (!controller.signal.aborted) setFeedState('unavailable'); });
    return () => controller.abort();
  }, []);
  const events = mergePublicLifecycleEvents('SP-ARDHI-26', dbEvents);
  const trackArticle = events.find(event => event.id === 'DEF-003')?.article;
  const active = events.filter(event => event.status === 'repair_pending' || event.status === 'reported' || event.status === 'diagnosing');
  const dateLabel = (event: FleetLifecycleEvent) => {
    const occurrence = event.occurredOn ? `Occurred ${event.occurredOn}` : 'Occurrence date not recorded';
    return event.reportedOn ? `${occurrence} · reported ${event.reportedOn}` : occurrence;
  };
  return <section className="section shell ardhi-production" id="maintenance" aria-labelledby="maintenance-title">
    <p className="eyebrow">Lifetime care / preparation</p><h2 id="maintenance-title">Maintenance starts with a verified baseline.</h2>
    <p>The engine label is documented: a Runtong 739 cc twin-cylinder gasoline engine on the YF380 plate. Operating time is operator-reported — roughly five field hours — with no verified hour-meter reading. Service intervals follow manufacturer guidance once its applicability to the delivered YF380 is confirmed.</p>
    {trackArticle?.state === 'published' && trackArticle.url && <p className="ardhi-field-journal-callout"><span>Field Repair 003 · Thrown track recovery</span><a href={trackArticle.url}>Read Field Repair 003</a></p>}
    <section aria-labelledby="ardhi-active-service-title"><h3 id="ardhi-active-service-title">Active service items</h3><p>{feedState === 'live' ? 'Reviewed Digital HQ database feed, supplemented by pending editorial records.' : feedState === 'loading' ? 'Checking Digital HQ lifecycle feed; showing last reviewed editorial records.' : 'Digital HQ lifecycle feed unavailable; showing last reviewed editorial records, which may be stale.'} An open safety-critical repair does not grant operating clearance.</p><ul className="ardhi-maintenance-systems">{active.map(event => <li key={event.id}><strong>{event.title}</strong><span>{event.id} · {dateLabel(event)} · {event.status.replaceAll('_', ' ')}</span><p>{event.summary}</p><p>Service release: {event.serviceRelease}. Lifecycle review: {event.approval}.</p></li>)}</ul></section><section aria-labelledby="ardhi-lifecycle-title"><h3 id="ardhi-lifecycle-title">Repair and upgrade history</h3><p>Historical owner observations are preserved; this summary does not replace independent inspections.</p><ul className="ardhi-maintenance-systems">{events.map(event => <li key={event.id}><strong>{event.title}</strong><span>{event.type.replaceAll('_', ' ')} · {dateLabel(event)} · {event.status.replaceAll('_', ' ')}</span><p>{event.summary}</p>{event.article && <p><a href={event.article.url}>Read published field journal</a></p>}</li>)}</ul></section><h3>Historical system baselines</h3><p>These dated snapshots preserve what was reported at the time. They are not live equipment health indicators; use the current lifecycle events above for repair status.</p><ul className="ardhi-maintenance-systems is-baselines">{maintenanceBaselines.map(baseline => <li key={baseline.system}><strong>{baseline.system}</strong><span>{baseline.updated ? `Snapshot ${baseline.updated}` : 'No dated record yet'}</span><p><b>Known:</b> {baseline.known}</p><p><b>Outstanding at snapshot:</b> {baseline.outstanding}</p></li>)}</ul>
    <p>Future records need hours, applicable interval, parts, inspection evidence and next-due date. Costs, technician identities and private notes belong in Digital HQ. No schedule, completed service or operational integration is implied.</p>
    <a href="#service">View published service history</a>
  </section>;
}
