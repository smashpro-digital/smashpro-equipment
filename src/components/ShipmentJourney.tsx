import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { eventAnchor, formatTime, positionStale, stageText, type JourneyImage, type ShipmentResult } from "../domain/shipment";
import "../styles/shipment-journey.css";

const ShipmentMap = lazy(() => import("./ShipmentMap"));
class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p>Interactive map unavailable. Use the journey summary below.</p> : this.props.children; }
}
const badge = (kind: string) => ({ "carrier-update": "Carrier", "ais-observation": "AIS", "manual-verification": "Manual Verification", "satellite-observation": "Satellite", "document-confirmation": "Document", "customs-confirmation": "Customs", "port-call": "Port Call" }[kind] ?? "Source");
function SatelliteObservation({ image, aisTime }: { image: JourneyImage; aisTime?: string }) {
  const [failed, setFailed] = useState(false);
  return <figure className="shipment-satellite">
    {!failed ? <img src={image.url} alt={image.vesselIdentified ? "Reviewed vessel satellite observation" : "Regional satellite imagery; vessel not independently identified"} loading="lazy" onError={() => setFailed(true)} /> : <p>Image rendition unavailable. Approved metadata is retained below.</p>}
    <figcaption>
      <strong>{image.vesselIdentified ? "Verified vessel satellite observation" : "Regional satellite imagery — vessel not independently identified"}</strong>
      <dl><div><dt>Captured</dt><dd>{formatTime(image.captureTime)}</dd></div><div><dt>Provider</dt><dd>{image.provider}</dd></div><div><dt>Area center</dt><dd>{image.center.latitude.toFixed(1)}°, {image.center.longitude.toFixed(1)}°</dd></div><div><dt>Resolution</dt><dd>{image.resolutionMetres} m / pixel</dd></div><div><dt>Cloud cover</dt><dd>{image.cloudCover === null ? "Not reported" : `${image.cloudCover}%`}</dd></div><div><dt>AIS observation</dt><dd>{formatTime(aisTime)}</dd></div></dl>
      <p>{image.attribution} · {image.license}</p><a href={image.sourceUrl} target="_blank" rel="noreferrer">Imagery source</a>
    </figcaption>
  </figure>;
}
export function ShipmentJourney({ result, refresh }: { result: ShipmentResult; refresh: () => void }) {
  const { data, status } = result;
  const [now, setNow] = useState(Date.now());
  const [openEvent, setOpenEvent] = useState<string>();
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    const sync = () => {
      if (["#history-container-loaded", "#history-ocean-voyage"].includes(window.location.hash)) document.getElementById("journey")?.scrollIntoView({ block: "start", behavior: "auto" });
      const id = data?.timeline.find(e => `#${eventAnchor(e.id)}` === window.location.hash)?.id;
      if (id) { setOpenEvent(id); requestAnimationFrame(() => document.getElementById(eventAnchor(id))?.scrollIntoView({ block: "center", behavior: "auto" })); }
    };
    sync(); window.addEventListener("hashchange", sync); return () => window.removeEventListener("hashchange", sync);
  }, [data]);
  const stale = data ? positionStale(data, now) : true;
  // Cached media may have been withdrawn since the last response; only display it after a successful fetch.
  const images = status === "current" ? data?.satelliteImagery ?? [] : [];
  const media = status === "current" ? data?.imagery ?? [] : [];
  return <section id="journey" className="shipment-journey" aria-labelledby="shipment-journey-title">
    <div className="shell">
      <span id="history-container-loaded" /><span id="history-ocean-voyage" />
      <div className="shipment-heading"><div><p className="eyebrow">SP-ARDHI-26 · Asset journey</p><h2 id="shipment-journey-title">The journey, documented.</h2><p>From factory release to fleet arrival. Every update follows the evidence.</p></div><a className="shipment-archive-link" href="#history-factory-departure">Factory departure record ↗</a></div>
      <div className="shipment-status-line" role="status"><span className={`shipment-badge is-${data?.stageVerification ?? "unavailable"}`}>{status === "cached" ? "Last known record" : data?.stageVerification === "confirmed" ? "Verified shipment record" : "Awaiting confirmation"}</span><strong>{stageText(result)}</strong><button type="button" onClick={refresh}>Refresh update</button></div>
      {status === "cached" && <p className="shipment-notice">Shipment update unavailable. Showing the last verified public record; this is not a live position. Imagery awaits a fresh approval check.</p>}
      <div className="shipment-facts"><div><span>Vessel reference</span><strong>{data?.vessel?.name ?? "Awaiting verification"}</strong><small>{data?.voyage ? `Voyage ${data.voyage}` : "Voyage not confirmed"}</small></div><div><span>Arrival</span><strong>{data?.eta ?? "Awaiting confirmation"}</strong><small>{data?.eta ? `${data.etaState} · not a delivery promise` : "No verified arrival estimate"}</small></div><div><span>Last shipment update</span><strong>{formatTime(data?.lastUpdated)}</strong><small>{data?.lastChecked ? `Source checked ${formatTime(data.lastChecked)}` : "No source check available"}</small></div></div>
      <div className="shipment-map-layout"><MapBoundary><Suspense fallback={<p className="shipment-map-loading">Loading reference map…</p>}><ShipmentMap data={data} /></Suspense></MapBoundary>
        <aside id="shipment-map-summary" className="shipment-map-summary" aria-label="Accessible shipment map summary"><p className="eyebrow">Location record</p><h3>{data?.currentPosition ? stale || status === "cached" ? "Last known vessel position" : "Reported vessel position" : "Position awaiting evidence"}</h3>
          <p>{data?.currentPosition ? `${data.currentPosition.latitude.toFixed(1)}°, ${data.currentPosition.longitude.toFixed(1)}° · vessel only` : "No public vessel observation is available. The map does not simulate movement."}</p>
          {data?.currentPosition && <><span className={`shipment-badge ${stale ? "is-stale" : "is-observed"}`}>{stale || status === "cached" ? "Stale / last known" : "Observed"}</span><dl><div><dt>Observed</dt><dd>{formatTime(data.currentPosition.timestamp)}</dd></div><div><dt>Speed</dt><dd>{data.currentPosition.speedKnots === null ? "Not reported" : `${data.currentPosition.speedKnots} knots`}</dd></div><div><dt>Course</dt><dd>{data.currentPosition.course === null ? "Not reported" : `${data.currentPosition.course}°`}</dd></div><div><dt>Status</dt><dd>{data.currentPosition.status ?? "Not reported"}</dd></div></dl><a href={data.currentPosition.source.url} target="_blank" rel="noreferrer">Source: {data.currentPosition.source.provider}</a></>}
          <p className="shipment-small">{data?.map.cargoAssociationConfirmed ? "Cargo departure is supported by the HQ evidence record." : "A vessel position does not establish that SP-ARDHI-26 is aboard."}</p>
          <ul className="shipment-port-list">{data?.map.originFacility && <li>Factory / export location: {data.map.originFacility.label}</li>}{data?.ports.map((p, i) => { const event = data.timeline.find(e => e.portId === p.id); return <li key={p.id}><b>{i + 1}</b> {p.name}, {p.country}{event && <a href={`#${eventAnchor(event.id)}`} onClick={() => setOpenEvent(event.id)}>View port-call record</a>}</li>; })}{data?.map.inlandDestination && <li>Planned destination: {data.map.inlandDestination.region} · coarse region only</li>}</ul>
          <p className="shipment-small">{data?.route.planned.length ? "Dashed line: projected / reported route, not proof of distance completed." : "No verified public sea route is available."} Jobs, storage and service records are kept separately.</p>
        </aside>
      </div>
      <div className="shipment-events-heading"><div><p className="eyebrow">Shipment evidence</p><h3>Updates & observations</h3></div><span>{data?.timeline.length ?? 0} public updates · {images.length} approved satellite observations</span></div>
      {!images.length && <div className="shipment-imagery-empty"><span aria-hidden="true">◉</span><div><strong>No approved satellite observation available</strong><p>Satellite observations require capture metadata, licensing and review. The reference map is cartography, not an image of the vessel.</p></div></div>}
      {!data?.timeline.length ? <p className="shipment-empty-events">Carrier, port and vessel observations will appear here when approved. <a href="#history-factory-departure">Explore the documented factory and export history.</a></p> : <ol className="shipment-events">{data.timeline.map(event => {
        const eventImages = images.filter(i => i.eventId === event.id), eventMedia = media.filter(i => i.eventId === event.id);
        return <li key={event.id} id={eventAnchor(event.id)}><details open={openEvent === event.id} onToggle={e => { if (e.currentTarget.open) setOpenEvent(event.id); else setOpenEvent(id => id === event.id ? undefined : id); }} onKeyDown={e => { if (e.key === "Escape") { setOpenEvent(undefined); e.currentTarget.querySelector("summary")?.focus(); } }}><summary><time dateTime={event.timestamp}>{formatTime(event.timestamp)}</time><strong>{event.summary}</strong><span><span className={`shipment-badge is-${event.eventState}`}>{event.eventState === "confirmed" ? "Verified" : event.eventState}</span> <span className="shipment-source-badge">{badge(event.eventType)}</span>{eventImages.length + eventMedia.length > 0 && <small>{eventImages.length + eventMedia.length} approved media</small>}</span></summary><div className="shipment-event-detail"><p>{event.eventType === "ais-observation" ? "Vessel observation — location evidence only; no shipment stage is inferred." : event.eventType === "satellite-observation" ? "Contextual imagery observation — separate from cargo evidence." : "Operational shipment record published by Digital HQ."}</p><a href={event.source.url} target="_blank" rel="noreferrer">{event.source.provider} · source observed {formatTime(event.source.observedAt)}</a>{eventImages.length + eventMedia.length === 0 && <p className="shipment-small">Source-linked update. No public media attachment accompanies this record.</p>}{eventMedia.map(m => <figure key={m.id}>{m.kind === "video" ? <video controls preload="none" src={m.url} aria-label={m.title} /> : <img loading="lazy" src={m.url} alt={m.title} />}<figcaption>{m.title} · {m.attribution} · {m.license}</figcaption></figure>)}{eventImages.length > 0 && <h4>Contextual satellite media</h4>}{eventImages.map(image => <SatelliteObservation key={image.id} image={image} aisTime={data.currentPosition?.timestamp} />)}</div></details></li>;
      })}</ol>}
    </div>
  </section>;
}
