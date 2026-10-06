import type { Shipment } from '../domain/shipment';
import { formatTime, selectForwarderReportedVesselVoyage } from '../domain/shipment';
import '../styles/vessel-context.css';

const factoryHero = '/equipment/images/sp-ardhi-26-completed-build-attachments.jpg';

export function VesselContext({ data }: { data: Shipment }) {
  const context = data.vesselContext;
  if (!context) return null;

  const vessel = context.vessel;
  const forwarderFacts = selectForwarderReportedVesselVoyage(data);
  const observation = context.observation;
  const corridorStages = [...context.corridor.stages];
  const reviewedAt = [...context.identitySources.map((source) => source.checkedAt), context.voyage.source.checkedAt].sort().at(-1) ?? data.lastUpdated;
  const verifiedStageIndexes = corridorStages
    .map((stage, index) => ({ index, stage: stage.toLowerCase() }))
    .filter(({ stage }) => /(observed|departed|completed|complete)/.test(stage) && !/(scheduled|pending)/.test(stage))
    .map(({ index }) => index);
  const currentCorridorIndex = verifiedStageIndexes.at(-1) ?? 0;
  const currentCorridorStage = corridorStages[currentCorridorIndex] ?? corridorStages[0];
  const checkpointLabel = currentCorridorStage.split('·')[0]?.trim() || currentCorridorStage;
  const routePoints = [
    [54,164],[54,164],[205,126],[455,110],[575,135],[590,132],[685,114],[764,101]
  ] as const;
  const shipPoint = routePoints[Math.min(currentCorridorIndex, routePoints.length - 1)];
  const progressPercent = corridorStages.length > 1 ? Math.round((currentCorridorIndex / (corridorStages.length - 1)) * 100) : 0;
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
        <p className="journey-lede">The machine is complete. The freight forwarder reports departure aboard {forwarderFacts.vesselName} voyage {forwarderFacts.voyageReference}. The vessel has now reached Savannah anchorage while cargo discharge, customs, release, and inland delivery remain unconfirmed.</p>
        <div className="journey-hero-status">
          <span aria-hidden="true" />
          <div><small>Current vessel checkpoint</small><strong>{checkpointLabel}</strong></div>
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
        <div><p className="eyebrow">The vessel we’re watching</p><h3 id="journey-now-title">{forwarderFacts.vesselName}</h3></div>
        <svg className="context-ship-art" viewBox="0 0 240 100" aria-hidden="true"><path d="M12 64H226L203 88H49Z"/><path d="M28 45H160V64H28ZM44 26H176V45H44ZM179 34H207V64H179ZM188 20H207V34H188"/><path className="ship-water" d="M8 95H231M65 27V63M92 27V63M119 27V63M146 27V63"/></svg>
      </div>
      <p className="journey-vessel-summary">{vessel.flag}-flagged {vessel.type} · {vessel.lengthMetres} m long · Forwarder-reported voyage {forwarderFacts.voyageReference}</p>
      <dl className="journey-vitals">
        <div><dt>IMO</dt><dd>{vessel.imo}</dd></div>
        <div><dt>MMSI</dt><dd>{vessel.mmsi}</dd></div>
        <div><dt>Call sign</dt><dd>{vessel.callSign}</dd></div>
        <div><dt>Machine</dt><dd>{data.pendingReferences?.factoryModel ?? 'YF380'}</dd></div>
      </dl>
      <div className="journey-truth"><span>!</span><p><strong>The voyage is forwarder-reported.</strong> The supplier's logistics record links ARDHI's tracking reference to {forwarderFacts.vesselName} voyage {forwarderFacts.voyageReference}. The ISO container number and bill of lading remain pending.</p></div>
    </section>

    <section className="journey-corridor" aria-labelledby="corridor-title">
      <div className="journey-corridor-copy"><p className="eyebrow">Verified voyage progress</p><h3 id="corridor-title">Factory floor to South Carolina.</h3><p>The ship marker advances only when a vessel checkpoint is verified. It shows voyage progress, not live GPS or proof of cargo discharge.</p><p className="corridor-current"><strong>Current checkpoint:</strong> {checkpointLabel}</p></div>
      <div className="corridor-visual">
        <svg viewBox="0 0 820 230" role="img" aria-label={`Verified vessel voyage progress through ${checkpointLabel}; this is not live GPS tracking`} className="corridor-art">
          <defs><linearGradient id="routeGlow" x1="0" x2="1"><stop stopColor="#9ade61"/><stop offset=".55" stopColor="#9ade61"/><stop offset=".72" stopColor="#d5b871"/><stop offset="1" stopColor="#d5b871" stopOpacity=".35"/></linearGradient></defs>
          <path className="corridor-horizon" d="M20 174C115 126 184 151 254 105S407 54 493 99s127 78 307 5"/>
          <path className="corridor-route" pathLength="100" d="M54 164C175 154 197 81 322 88s143 91 259 47 121-47 183-34"/>
          <path className="corridor-route-progress" pathLength="100" strokeDasharray={`${progressPercent} ${100-progressPercent}`} d="M54 164C175 154 197 81 322 88s143 91 259 47 121-47 183-34"/>
          <circle cx="54" cy="164" r="12" className="route-complete"/>
          <circle cx="764" cy="101" r="10" className="route-future"/>
          <g className="corridor-vessel-marker" transform={`translate(${shipPoint[0]} ${shipPoint[1]})`}>
            <circle r="18"/>
            <path d="M-11 3H10L6 9H-6Z M-5-7H5V3H-5Z"/>
          </g>
          <text x="54" y="207" textAnchor="middle">YANTIAN</text><text x="455" y="66" textAnchor="middle">PANAMA</text><text x="575" y="177" textAnchor="middle">COLÓN</text><text x="685" y="81" textAnchor="middle">SAVANNAH</text><text x="764" y="66" textAnchor="middle">SC</text>
        </svg>
        <ol className="corridor-checkpoints" aria-label="Verified and upcoming vessel checkpoints">
          {corridorStages.map((stage, index) => <li key={stage} className={index < currentCorridorIndex ? 'is-complete' : index === currentCorridorIndex ? 'is-current' : 'is-future'}><span>{index + 1}</span><strong>{stage}</strong></li>)}
        </ol>
      </div>
    </section>

    <details className="journey-intelligence">
      <summary><span><small>Source record</small><strong>Journey intelligence & verification</strong></span><em>Open details</em></summary>
      <div className="journey-intelligence-grid">
        <section><h4>What we know</h4><ul><li>Factory production and loading history documented</li><li>Supplier reconciled ARDHI references YFC260717B and BZHYF0822BMT1</li><li>Freight forwarder reports {forwarderFacts.vesselName} voyage {forwarderFacts.voyageReference} departed September 7</li><li>Latest verified vessel checkpoint: {checkpointLabel}</li><li>EVER MAX reached Savannah anchorage October 6 at 06:43 UTC</li></ul></section>
        <section><h4>What comes next</h4><ul><li>Terminal berth / vessel discharge confirmation</li><li>SP-ARDHI-26 cargo discharge evidence</li><li>U.S. customs clearance and cargo release</li><li>Final-mile carrier, delivery, receipt inspection, and commissioning</li></ul></section>
      </div>
      {observation ? <div className="journey-observation"><strong>Latest approved observation</strong><p>{formatTime(observation.observedAt)} · {observation.destination ?? 'Destination not supplied'} · {observation.speedKnots === null ? 'Speed not supplied' : `${observation.speedKnots} kn`}</p><a href={observation.source.url} target="_blank" rel="noreferrer">Open observation source ↗</a></div> : <p className="journey-observation">No timestamped AIS observation is approved for reuse on this page yet.</p>}
      <div className="context-sources">
        {context.identitySources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">Open vessel tracker ↗</a><small>{source.attribution} · checked {formatTime(source.checkedAt)}</small></p>)}
        <p><a href={context.voyage.source.url} target="_blank" rel="noreferrer">Open voyage schedule ↗</a><small>{context.voyage.source.attribution} · checked {formatTime(context.voyage.source.checkedAt)}</small></p>
      </div>
      <p className="journey-boundary">Voyage visual last reviewed {formatTime(reviewedAt)}. Vessel context does not prove cargo association. The projected corridor is not live GPS, sailed distance, cargo discharge, customs clearance, release, or a delivery promise. Last verified shipment update: {formatTime(data.lastUpdated)}.</p>
    </details>
  </div>;
}
