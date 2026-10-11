import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { eventAnchor, formatTime, positionStale, selectForwarderReportedVesselVoyage, stageText, type JourneyImage, type ShipmentResult } from "../domain/shipment";
import "../styles/shipment-journey.css";
import { VesselContext } from './VesselContext';
import { selectVerifiedCheckpointReference } from "../domain/ardhiCheckpoint";
import { AtlasStatusPanel } from "./AtlasStatusPanel";
import { ArdhiPortProcessing } from "./ArdhiPortProcessing";

const ShipmentMap = lazy(() => import("./ShipmentMap"));
class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p>Interactive map unavailable. Use the journey summary below.</p> : this.props.children; }
}
const badge = (kind: string) => ({ "carrier-update": "Forwarder Update", "ais-observation": "AIS", "manual-verification": "Manual Verification", "satellite-observation": "Context Imagery", "document-confirmation": "Document", "customs-confirmation": "Customs", "port-call": "Port Call" }[kind] ?? "Source");
function SatelliteObservation({ image, aisTime }: { image: JourneyImage; aisTime?: string }) {
  const [failed, setFailed] = useState(false);
  return <figure className="shipment-satellite">
    {!failed ? <img src={image.url} alt={image.vesselIdentified ? "Reviewed satellite image of the vessel" : "Regional satellite imagery; vessel not independently identified"} loading="lazy" onError={() => setFailed(true)} /> : <p>Image rendition unavailable. Approved metadata is retained below.</p>}
    <figcaption>
      <strong>{image.vesselIdentified ? "Reviewed satellite image of the vessel" : "Regional satellite imagery — vessel not independently identified"}</strong>
      <dl><div><dt>Captured</dt><dd>{formatTime(image.captureTime)}</dd></div><div><dt>Provider</dt><dd>{image.provider}</dd></div><div><dt>Area center</dt><dd>{image.center.latitude.toFixed(1)}°, {image.center.longitude.toFixed(1)}°</dd></div><div><dt>Resolution</dt><dd>{image.resolutionMetres} m / pixel</dd></div><div><dt>Cloud cover</dt><dd>{image.cloudCover === null ? "Not reported" : `${image.cloudCover}%`}</dd></div><div><dt>AIS observation</dt><dd>{formatTime(aisTime)}</dd></div></dl>
      <p>{image.attribution} · {image.license}</p><a href={image.sourceUrl} target="_blank" rel="noreferrer">Imagery source</a>
    </figcaption>
  </figure>;
}
function HistoricalShipmentJourney({ result, refresh }: { result: ShipmentResult; refresh: () => void }) {
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
  const aisObservations = data?.timeline.filter(event => event.eventType === "ais-observation").length ?? 0;
  const forwarderFacts = selectForwarderReportedVesselVoyage(data);
  const checkpoint = selectVerifiedCheckpointReference(data);
  return <section id="shipment-history" className="shipment-journey" aria-labelledby="shipment-journey-title">
    <div className="shell">
      <span id="history-container-loaded" /><span id="history-ocean-voyage" />
      <div className="shipment-heading"><div><p className="eyebrow">SP-ARDHI-26 · Asset journey</p><h2 id="shipment-journey-title">The journey, documented.</h2><p>From factory release to fleet arrival. Every update follows the evidence.</p></div><a className="shipment-archive-link" href="#history-factory-departure">Factory departure record ↗</a></div>
      <div className="shipment-status-line" role="status"><span className={`shipment-badge is-${data?.stageVerification ?? "unavailable"}`}>{status === "cached" ? "Last known record" : data?.stageVerification === "confirmed" ? "Confirmed shipment record" : "Awaiting confirmation"}</span><strong>{stageText(result)}</strong><button type="button" onClick={refresh}>Refresh update</button></div>
      {status === "cached" && <p className="shipment-notice">Shipment update unavailable. Showing the last verified public record; this is not a live position. Imagery awaits a fresh approval check.</p>}
      {data?.vesselContext && <VesselContext data={data} />}
      {data?.locationContext && <AtlasStatusPanel assetId={data.assetId} context={data.locationContext} />}
      {data?.pendingReferences && <section className={`shipment-pending ${data.vesselContext ? 'has-context' : ''}`} aria-labelledby="shipment-pending-title">
        <h3 id="shipment-pending-title">Pending references</h3>
        <p>Operator-supplied references awaiting verification. These do not confirm vessel identity, cargo loading or ocean departure.</p>
        <ul><li>Factory model {data.pendingReferences.factoryModel}</li><li>{data.pendingReferences.vesselDisplayReference} — identity verification pending</li><li>Voyage {data.pendingReferences.voyageDisplayReference} — verification pending</li><li>Cargo association not yet confirmed</li></ul>
        <p className="shipment-small">Source: {data.pendingReferences.source} · Reference recorded {formatTime(data.pendingReferences.recordedAt)}. This is not a verified shipment-update timestamp.</p>
      </section>}
      {(!data?.vesselContext || data.currentPosition || data.timeline.length > 0 || checkpoint) && <>
      <h3 className="shipment-verified-title">Confirmed shipment facts</h3>
      <div className="shipment-facts"><div><span>Forwarder-reported vessel</span><strong>{forwarderFacts.vesselName ?? "No forwarder-reported vessel"}</strong><small>{forwarderFacts.voyageReference ? `Forwarder-reported voyage ${forwarderFacts.voyageReference}` : "No forwarder-reported voyage"}</small></div><div><span>Arrival estimate</span><strong>{data?.eta ?? "No confirmed estimate"}</strong><small>{data?.eta ? `${data.etaState} · not a delivery promise` : "No confirmed arrival estimate"}</small></div><div><span>Last shipment update</span><strong>{formatTime(data?.lastUpdated)}</strong><small>{data?.lastChecked ? `Source checked ${formatTime(data.lastChecked)}` : "No source check available"}</small></div></div>
      <div className="shipment-map-layout"><MapBoundary><Suspense fallback={<p className="shipment-map-loading">Loading reference map…</p>}><ShipmentMap data={data} /></Suspense></MapBoundary>
        <aside id="shipment-map-summary" className="shipment-map-summary" aria-label="Accessible shipment map summary"><p className="eyebrow">Location record</p><h3>{data?.currentPosition ? stale || status === "cached" ? "Last known vessel position" : "Reported vessel position" : checkpoint ? "Verified vessel checkpoint" : "Position awaiting evidence"}</h3>
          <p>{data?.currentPosition ? `${data.currentPosition.latitude.toFixed(1)}°, ${data.currentPosition.longitude.toFixed(1)}° · vessel only` : checkpoint ? `${checkpoint.label} · coarse reference point only, not live GPS` : "No public vessel-position observation is available. The map does not simulate movement."}</p>
          {data?.currentPosition && <><span className={`shipment-badge ${stale ? "is-stale" : "is-observed"}`}>{stale || status === "cached" ? "Stale / last known" : "Observed"}</span><dl><div><dt>Observed</dt><dd>{formatTime(data.currentPosition.timestamp)}</dd></div><div><dt>Speed</dt><dd>{data.currentPosition.speedKnots === null ? "Not reported" : `${data.currentPosition.speedKnots} knots`}</dd></div><div><dt>Course</dt><dd>{data.currentPosition.course === null ? "Not reported" : `${data.currentPosition.course}°`}</dd></div><div><dt>Status</dt><dd>{data.currentPosition.status ?? "Not reported"}</dd></div></dl><a href={data.currentPosition.source.url} target="_blank" rel="noreferrer">Source: {data.currentPosition.source.provider}</a></>}
          {!data?.currentPosition && checkpoint && <><span className="shipment-badge is-observed">Checkpoint</span><dl><div><dt>Checkpoint observed</dt><dd>{formatTime(checkpoint.observedAt)}</dd></div><div><dt>Map precision</dt><dd>Coarse whole-degree reference</dd></div><div><dt>Live position</dt><dd>Not available</dd></div></dl><a href={checkpoint.source.url} target="_blank" rel="noreferrer">Checkpoint source: {checkpoint.source.label}</a></>}
          <p className="shipment-small">{data?.currentPosition ? data.map.cargoAssociationConfirmed ? "Cargo departure is supported by the HQ evidence record." : "A vessel position does not establish that SP-ARDHI-26 is aboard." : checkpoint ? "This marker represents a verified vessel checkpoint only. It does not establish a current vessel position, cargo discharge, customs clearance, release, or delivery." : "A vessel position does not establish that SP-ARDHI-26 is aboard."}</p>
          <ul className="shipment-port-list">{data?.map.originFacility && <li>Factory / export location: {data.map.originFacility.label}</li>}{data?.ports.map((p, i) => { const event = data.timeline.find(e => e.portId === p.id); return <li key={p.id}><b>{i + 1}</b> {p.name}, {p.country}{event && <a href={`#${eventAnchor(event.id)}`} onClick={() => setOpenEvent(event.id)}>View port-call record</a>}</li>; })}{data?.map.inlandDestination && <li>Planned destination: {data.map.inlandDestination.region} · coarse region only</li>}</ul>
          <p className="shipment-small">{data?.route.planned.length ? "Dashed line: projected / reported route, not proof of distance completed." : "No verified public sea route is available."} Jobs, storage and service records are kept separately.</p>
        </aside>
      </div>
      </>}
      {(!data?.vesselContext || data.timeline.length > 0) && <>
      <div className="shipment-events-heading"><div><p className="eyebrow">Shipment evidence</p><h3>Updates & vessel-position observations</h3></div><span>{data?.timeline.length ?? 0} public updates · {aisObservations} AIS observations · {images.length} approved contextual images</span></div>
      {!data?.currentPosition && <div className="shipment-imagery-empty"><span aria-hidden="true">◉</span><div><strong>No approved live vessel-position observation available</strong><p>{checkpoint ? "The map currently shows a coarse verified vessel checkpoint reference. AIS remains separate and requires a timestamped provider record plus approval for public display." : "AIS observations require a timestamped provider record and approval for public display. The reference map is cartography and does not simulate vessel movement."}</p></div></div>}
      {data?.currentPosition && !images.length && <div className="shipment-imagery-empty"><span aria-hidden="true">◉</span><div><strong>No approved contextual imagery available</strong><p>The vessel-position observation remains available above. Satellite imagery is displayed only with capture metadata, licensing, and public approval.</p></div></div>}
      {!data?.timeline.length ? <p className="shipment-empty-events">Carrier, port and vessel observations will appear here when approved. <a href="#history-factory-departure">Explore the documented factory and export history.</a></p> : <ol className="shipment-events">{data.timeline.map(event => {
        const eventImages = images.filter(i => i.eventId === event.id), eventMedia = media.filter(i => i.eventId === event.id);
        return <li key={event.id} id={eventAnchor(event.id)}><details open={openEvent === event.id} onToggle={e => { if (e.currentTarget.open) setOpenEvent(event.id); else setOpenEvent(id => id === event.id ? undefined : id); }} onKeyDown={e => { if (e.key === "Escape") { setOpenEvent(undefined); e.currentTarget.querySelector("summary")?.focus(); } }}><summary><time dateTime={event.timestamp}>{formatTime(event.timestamp)}</time><strong>{event.summary}</strong><span><span className={`shipment-badge is-${event.eventState}`}>{event.eventState === "confirmed" ? "Verified" : event.eventState}</span> <span className="shipment-source-badge">{badge(event.eventType)}</span>{eventImages.length + eventMedia.length > 0 && <small>{eventImages.length + eventMedia.length} approved media</small>}</span></summary><div className="shipment-event-detail"><p>{event.eventType === "ais-observation" ? "Vessel-position observation — location evidence only; no shipment stage is inferred." : event.eventType === "satellite-observation" ? "Contextual satellite imagery — separate from cargo evidence." : "Operational shipment record published by Digital HQ."}</p><a href={event.source.url} target="_blank" rel="noreferrer">{event.source.provider} · source observed {formatTime(event.source.observedAt)}</a>{eventImages.length + eventMedia.length === 0 && <p className="shipment-small">Source-linked update. No public media attachment accompanies this record.</p>}{eventMedia.map(m => <figure key={m.id}>{m.kind === "video" ? <video controls preload="none" src={m.url} aria-label={m.title} /> : <img loading="lazy" src={m.url} alt={m.title} />}<figcaption>{m.title} · {m.attribution} · {m.license}</figcaption></figure>)}{eventImages.length > 0 && <h4>Contextual satellite media</h4>}{eventImages.map(image => <SatelliteObservation key={image.id} image={image} aisTime={data.currentPosition?.timestamp} />)}</div></details></li>;
      })}</ol>}
      </>}
    </div>
  </section>;
}

export function ShipmentJourney(props: { result: ShipmentResult; refresh: () => void }) {
  const [historyOpen, setHistoryOpen] = useState(false);
  useEffect(() => {
    const openLinkedHistory = () => {
      if (/^#(?:shipment-event-|history-container-loaded|history-ocean-voyage)/.test(window.location.hash)) setHistoryOpen(true);
    };
    openLinkedHistory();
    window.addEventListener("hashchange", openLinkedHistory);
    return () => window.removeEventListener("hashchange", openLinkedHistory);
  }, []);
  return <><ArdhiPortProcessing /><details className="shell ardhi-historical-logistics" open={historyOpen} onToggle={event => setHistoryOpen(event.currentTarget.open)}>
    <summary>Earlier vessel and shipment evidence</summary>
    <p>The records below retain the earlier HQ shipment feed and vessel observations. Vessel checkpoints and historical arrival estimates are separate from the manufacturer-confirmed machine arrival above.</p>
    {historyOpen && <HistoricalShipmentJourney {...props} />}
  </details></>;
}
