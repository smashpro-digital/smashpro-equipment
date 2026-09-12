import type { Shipment } from '../domain/shipment';
import { formatTime } from '../domain/shipment';
import '../styles/vessel-context.css';

const factoryHero = '/equipment/images/sp-ardhi-26-completed-build-attachments.jpg';

export function VesselContext({ data }: { data: Shipment }) {
  const context = data.vesselContext;
  if (!context) return null;

  const vessel = context.vessel;
  const observation = context.observation;
  const journey = [
    { number: '01', label: 'Built', detail: 'Factory complete', state: 'complete' },
    { number: '02', label: 'Released', detail: 'Export chapter', state: 'complete' },
    { number: '03', label: 'Ocean', detail: 'Forwarder-reported transit', state: 'active' },
    { number: '04', label: 'Home', detail: 'Arrival & commissioning', state: 'future' },
  ] as const;

  return <div className="vessel-context">
    <article className="journey-cinematic" aria-labelledby="monitored-vessel-title">
      <img className="journey-cinematic-image" src={factoryHero} alt="SP-ARDHI-26 completed at the factory with its attachments" />
      <div className="journey-cinematic-shade" />
      <div className="journey-cinematic-copy">
        <p className="eyebrow">The road home · Chapter three</p>
        <p className="journey-kicker">Built in China. Bound for South Carolina.</p>
        <h3 id="monitored-vessel-title">ARDHI is coming home.</h3>
        <p className="journey-lede">The machine is complete. The freight forwarder reports departure aboard EVER MAX voyage 1374-016E. We are documenting the ocean leg while awaiting the container and bill-of-lading records.</p>
        <div className="journey-hero-status">
          <span aria-hidden="true" />
          <div><small>Current chapter</small><strong>{data.shipmentStatus}</strong></div>
        </div>
      </div>
    </article>

    <ol className="journey-rail" aria-label="SP-ARDHI-26 journey chapters">
      {journey.map((stage) => <li key={stage.number} className={`is-${stage.state}`}>
        <span className="journey-node">{stage.number}</span>
        <div><strong>{stage.label}</strong><small>{stage.detail}</small></div>
      </li>)}
    </ol>

    <section className="journey-now" aria-labelledby="journey-now-title">
      <div className="journey-now-heading">
        <div><p className="eyebrow">The vessel we’re watching</p><h3 id="journey-now-title">{vessel.name}</h3></div>
        <svg className="context-ship-art" viewBox="0 0 240 100" aria-hidden="true"><path d="M12 64H226L203 88H49Z"/><path d="M28 45H160V64H28ZM44 26H176V45H44ZM179 34H207V64H179ZM188 20H207V34H188"/><path className="ship-water" d="M8 95H231M65 27V63M92 27V63M119 27V63M146 27V63"/></svg>
      </div>
      <p className="journey-vessel-summary">{vessel.flag}-flagged {vessel.type} · {vessel.lengthMetres} m long · voyage reference {context.voyage.reference}</p>
      <dl className="journey-vitals">
        <div><dt>IMO</dt><dd>{vessel.imo}</dd></div>
        <div><dt>MMSI</dt><dd>{vessel.mmsi}</dd></div>
        <div><dt>Call sign</dt><dd>{vessel.callSign}</dd></div>
        <div><dt>Machine</dt><dd>{data.pendingReferences?.factoryModel ?? 'YF380'}</dd></div>
      </dl>
      <div className="journey-truth"><span>!</span><p><strong>The voyage is forwarder-reported.</strong> The supplier's logistics record links ARDHI's tracking reference to EVER MAX voyage 1374-016E. The ISO container number and bill of lading remain pending.</p></div>
    </section>

    <section className="journey-corridor" aria-labelledby="corridor-title">
      <div className="journey-corridor-copy"><p className="eyebrow">The next horizon</p><h3 id="corridor-title">Factory floor to first job.</h3><p>The route is intentionally shown as a story of chapters—not simulated live movement. Confirmed progress will illuminate each stage as evidence arrives.</p></div>
      <svg viewBox="0 0 820 230" role="img" aria-label="Journey chapters from factory release through projected ocean transport, arrival, commissioning and first job" className="corridor-art">
        <defs><linearGradient id="routeGlow" x1="0" x2="1"><stop stopColor="#9ade61"/><stop offset=".42" stopColor="#9ade61"/><stop offset=".48" stopColor="#d5b871"/><stop offset="1" stopColor="#d5b871" stopOpacity=".35"/></linearGradient></defs>
        <path className="corridor-horizon" d="M20 174C115 126 184 151 254 105S407 54 493 99s127 78 307 5"/>
        <path className="corridor-route" d="M54 164C175 154 197 81 322 88s143 91 259 47 121-47 183-34"/>
        <circle cx="54" cy="164" r="14" className="route-complete"/><circle cx="322" cy="88" r="13" className="route-active"/><circle cx="581" cy="135" r="11" className="route-future"/><circle cx="764" cy="101" r="11" className="route-future"/>
        <text x="54" y="207" textAnchor="middle">FACTORY</text><text x="322" y="52" textAnchor="middle">OCEAN</text><text x="581" y="177" textAnchor="middle">ARRIVAL</text><text x="764" y="66" textAnchor="middle">FIRST JOB</text>
      </svg>
    </section>

    <details className="journey-intelligence">
      <summary><span><small>Source record</small><strong>Journey intelligence & verification</strong></span><em>Open details</em></summary>
      <div className="journey-intelligence-grid">
        <section><h4>What we know</h4><ul><li>Factory production and loading history documented</li><li>Supplier reconciled ARDHI references YFC260717B and BZHYF0822BMT1</li><li>Freight forwarder reports EVER MAX voyage 1374-016E departed September 7</li><li>Estimated port arrival is October 5 local time</li></ul></section>
        <section><h4>What comes next</h4><ul><li>ISO container and bill-of-lading records</li><li>Independent carrier confirmation</li><li>Destination port and inland handoff</li><li>Receipt inspection and commissioning</li></ul></section>
      </div>
      {observation ? <div className="journey-observation"><strong>Latest approved observation</strong><p>{formatTime(observation.observedAt)} · {observation.destination ?? 'Destination not supplied'} · {observation.speedKnots === null ? 'Speed not supplied' : `${observation.speedKnots} kn`}</p><a href={observation.source.url} target="_blank" rel="noreferrer">Open observation source ↗</a></div> : <p className="journey-observation">No timestamped AIS observation is approved for reuse on this page yet.</p>}
      <div className="context-sources">
        {context.identitySources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">Open vessel tracker ↗</a><small>{source.attribution} · checked {formatTime(source.checkedAt)}</small></p>)}
        <p><a href={context.voyage.source.url} target="_blank" rel="noreferrer">Open voyage schedule ↗</a><small>{context.voyage.source.attribution} · checked {formatTime(context.voyage.source.checkedAt)}</small></p>
      </div>
      <p className="journey-boundary">Vessel context does not prove cargo association. The projected corridor is not a live position, sailed distance, booked port sequence, or arrival promise. Last verified shipment update: {formatTime(data.lastUpdated)}.</p>
    </details>
  </div>;
}
