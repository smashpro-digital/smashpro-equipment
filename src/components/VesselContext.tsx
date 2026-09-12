import type { Shipment } from '../domain/shipment';
import { formatTime } from '../domain/shipment';
import '../styles/vessel-context.css';

export function VesselContext({data}: {data: Shipment}) {
 const c=data.vesselContext;if(!c)return null;
 const v=c.vessel,o=c.observation;
 return <div className="vessel-context">
  <article className="vessel-identity" aria-labelledby="monitored-vessel-title">
   <div className="vessel-card-heading"><div><p className="eyebrow">Vessel being monitored</p><h3 id="monitored-vessel-title">{v.name}</h3><p>{v.flag} · {v.type} · approx. {v.lengthMetres} m × {v.beamMetres} m</p></div>
   <svg className="context-ship-art" viewBox="0 0 240 100" aria-hidden="true"><path d="M12 64H226L203 88H49Z"/><path d="M28 45H160V64H28ZM44 26H176V45H44ZM179 34H207V64H179ZM188 20H207V34H188"/><path className="ship-water" d="M8 95H231M65 27V63M92 27V63M119 27V63M146 27V63"/></svg></div>
   <p className="vessel-context-warning">This does not yet confirm SP-ARDHI-26 is aboard.</p>
   <dl className="vessel-identifiers"><div><dt>IMO</dt><dd>{v.imo}</dd></div><div><dt>MMSI</dt><dd>{v.mmsi}</dd></div><div><dt>Call sign</dt><dd>{v.callSign}</dd></div><div><dt>Factory model</dt><dd>{data.pendingReferences?.factoryModel ?? 'See factory record'}</dd></div></dl>
   <p className="context-classification">Publicly corroborated vessel metadata · independent of cargo verification</p>
   <p className="context-voyage">Voyage <strong>{c.voyage.reference}</strong> · reported public schedule reference</p>
   <div className="context-sources">{c.identitySources.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">Open public vessel tracker ↗ — {s.attribution}</a><small>Checked {formatTime(s.checkedAt)} · external contextual source</small></p>)}<p><a href={c.voyage.source.url} target="_blank" rel="noreferrer">Open public schedule ↗ — {c.voyage.source.attribution}</a><small>Checked {formatTime(c.voyage.source.checkedAt)} · not cargo evidence</small></p></div>
  </article>
  <section className="context-corridor" aria-labelledby="corridor-title">
   <p className="eyebrow">Projected shipment corridor</p><h3 id="corridor-title">From factory history to the next confirmed chapter.</h3>
   <p>Illustrative corridor · not a vessel position or booked port sequence</p>
   <svg viewBox="0 0 800 200" role="img" aria-label="Dashed projected ocean corridor from documented factory export history to destination and inland stages awaiting evidence" className="corridor-art">
    <defs><linearGradient id="corridor-glow"><stop stopColor="#86bd42" stopOpacity=".16"/><stop offset="1" stopColor="#d8bb73" stopOpacity=".04"/></linearGradient></defs>
    <path d="M25 145Q150 20 260 95T520 80T775 140V195H25Z" fill="url(#corridor-glow)"/>
    <path className="corridor-projected" d="M70 130C210 130 195 40 340 65S510 140 605 90L740 125"/>
    <circle cx="70" cy="130" r="15" className="corridor-documented"/><circle cx="340" cy="65" r="11" className="corridor-pending"/><circle cx="605" cy="90" r="11" className="corridor-pending"/><circle cx="740" cy="125" r="11" className="corridor-pending"/>
    <text x="70" y="173" textAnchor="middle">FACTORY</text><text x="340" y="35" textAnchor="middle">PROJECTED OCEAN</text><text x="605" y="55" textAnchor="middle">PORT PENDING</text><text x="740" y="165" textAnchor="middle">INLAND</text>
   </svg>
   <ol className="corridor-stages">{c.corridor.stages.map((stage,i)=><li key={stage}><span>{String(i+1).padStart(2,'0')}</span>{stage}</li>)}</ol>
   <p className="context-route-summary">{c.corridor.summary}</p>
   <div className="context-legend"><span>● Documented factory/export history</span><span>┄ Projected, never completed</span><span>○ Destination awaiting evidence</span></div>
   <p className="context-marker-label">Vessel context: {v.name} · monitoring reference only, not located on this corridor.</p>
  </section>
  <section className="context-monitoring" aria-labelledby="monitoring-title"><h3 id="monitoring-title">What we’re monitoring</h3><ul>
   <li><a href="#history-factory-departure">Factory production and loading history documented</a><span>Factory / export archive</span></li>
   <li>EVER MAX identity publicly corroborated<span>Vessel metadata</span></li>
   <li>Voyage {c.voyage.reference} reported in public schedule records<span>Reported reference</span></li>
   <li>Cargo-to-vessel association awaiting carrier evidence<span>Unconfirmed</span></li>
   <li>{data.shipmentStatus}<span>{data.stageVerification === 'confirmed' ? 'Evidence reviewed' : 'Awaiting evidence'}</span></li>
   <li>{data.currentPosition ? 'Approved AIS observation available' : 'Live AIS provider not yet connected'}<span>Vessel only</span></li>
   <li>{data.satelliteImagery.length ? 'Approved contextual imagery available' : 'Satellite observation not yet approved'}<span>Separate review</span></li>
   <li>Destination-port confirmation pending<span>Awaiting evidence</span></li>
  </ul></section>
  <section className="context-latest"><h3>Latest public vessel context</h3>{o ? <><p>Source observation: {formatTime(o.observedAt)} · historical unless freshly observed. This does not establish that ARDHI is aboard.</p><dl className="vessel-identifiers"><div><dt>Speed</dt><dd>{o.speedKnots===null?'Not supplied':`${o.speedKnots} kn`}</dd></div><div><dt>Heading</dt><dd>{o.heading===null?'Not supplied':`${o.heading}°`}</dd></div><div><dt>Reported destination</dt><dd>{o.destination??'Not supplied'}</dd></div></dl><a href={o.source.url} target="_blank" rel="noreferrer">Open observation source ↗ — {o.source.attribution}</a><p>Checked {formatTime(o.source.checkedAt)} · Reuse: {o.license}</p></> : <><p>No timestamped observation is approved for reuse here. View the external tracker for its own current information; it cannot confirm ARDHI’s cargo association.</p><a href={c.identitySources[0].url} target="_blank" rel="noreferrer">Open public vessel tracker ↗</a></>}
   <details className="context-unavailable"><summary>Tracking availability and evidence boundaries</summary><p>No licensed AIS position or approved satellite observation is stored. Speed, heading, live destination, arrival estimate and route completion are not inferred. Cargo association remains unconfirmed. Factory loading is not ocean-vessel loading.</p><p>Last verified shipment update: {formatTime(data.lastUpdated)}. Context-source check times above are separate from shipment verification.</p></details>
  </section>
 </div>;
}
