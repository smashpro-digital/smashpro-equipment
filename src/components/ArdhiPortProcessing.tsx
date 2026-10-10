import { ardhiJourneyStages, ardhiPortArrival } from "../data/ardhiPortArrival";
import "../styles/ardhi-port-processing.css";

export function ArdhiPortProcessing() {
  const record = ardhiPortArrival;
  return <section id="journey" className="section shell ardhi-port-processing" aria-labelledby="ardhi-mission-title">
    <header><p className="eyebrow">SP-ARDHI-26 · Verified logistics</p><h2 id="ardhi-mission-title">Ocean voyage complete.<br />U.S. port processing.</h2><p>{record.summary}</p></header>
    <div className="flagship-logistics-proof"><dl><div><dt>Port Arrival</dt><dd>{record.confidence}</dd></div><div><dt>Ocean Complete</dt><dd>{record.confidence}</dd></div></dl><p>{record.source}; confirmation recorded October 9, 2026. Arrival date not supplied.</p><a href="#history-port-arrival">Read the arrival milestone</a></div>
    <figure className="ardhi-logistics-map">
      <svg viewBox="0 0 900 150" role="img" aria-label="Ocean voyage complete; port processing current; customs, warehouse and delivery pending. Logical journey, not a geographic position.">
        <path d="M85 60H265" stroke="#76c043" strokeWidth="4" /><path d="M265 60H805" stroke="#738171" strokeWidth="2" strokeDasharray="7 8" />
        {[{x:85,title:"Ocean",state:"Complete"},{x:265,title:"Port Processing",state:"Current"},{x:445,title:"Customs",state:"Pending"},{x:625,title:"Warehouse",state:"Pending"},{x:805,title:"Delivery",state:"Pending"}].map(point=><g key={point.title}><circle cx={point.x} cy="60" r={point.state === "Current" ? 17 : 11} fill={point.state === "Pending" ? "#101811" : "#76c043"} stroke="#76c043" strokeWidth="2" /><text x={point.x} y="106" textAnchor="middle">{point.title}</text><text x={point.x} y="132" textAnchor="middle" className="map-state">{point.state}</text></g>)}
      </svg>
      <ol className="ardhi-map-mobile" aria-label="Logistics route">{ardhiJourneyStages.slice(4,9).map(stage=><li key={stage.id} className={`is-${stage.state}`}><strong>{stage.label}</strong><span>{stage.state === "complete" ? "Complete" : stage.state === "current" ? "Current" : "Pending"}</span></li>)}</ol>
      <figcaption>Verified logistics stages. No GPS location or simulated movement is shown.</figcaption>
    </figure>
    <div className="ardhi-logistics-details">
      <section aria-labelledby="ardhi-package-title"><p className="eyebrow">Verified logistics</p><h3 id="ardhi-package-title">Final Shipping Package</h3><dl><div><dt>Dimensions</dt><dd>{record.package.dimensions}</dd></div><div><dt>Weight</dt><dd>{record.package.weight}</dd></div><div><dt>Status</dt><dd>{record.package.verification}</dd></div></dl><p>Crated package measurements, separate from the machine's operating specifications.</p></section>
      <section aria-labelledby="ardhi-next-title"><p className="eyebrow">Next milestones</p><h3 id="ardhi-next-title">Awaiting Customs Clearance</h3><ol>{record.nextMilestones.map(milestone=><li key={milestone}>{milestone}<span>Pending</span></li>)}</ol><p>Warehouse transfer and final delivery scheduling remain pending.</p></section>
    </div>
  </section>;
}
