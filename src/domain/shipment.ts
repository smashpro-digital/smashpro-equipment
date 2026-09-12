// Consumer subset of Digital HQ PublicShipment schema 2 (HQ PR #111).
// This module validates/project-selects public fields. It never creates shipment facts.
import { parseVesselContext, type VesselContext } from './vesselContext';
export type EventState = "planned" | "estimated" | "observed" | "confirmed" | "delayed" | "completed";
export type Point = { latitude: number; longitude: number };
export type Source = { provider: string; url: string; observedAt: string };
export type JourneyEvent = { id: string; timestamp: string; summary: string; eventType: string; eventState: EventState; source: Source; milestone?: string; portId?: string };
export type JourneyImage = { id: string; eventId: string; url: string; sourceUrl: string; provider: string; captureTime: string; center: Point; resolutionMetres: number; cloudCover: number | null; license: string; attribution: string; vesselIdentified: boolean; verificationStatus: "context-verified" | "vessel-identified" };
export type JourneyMedia = { id: string; eventId: string; url: string; title: string; kind: "photo" | "video" | "tracking-record"; sourceUrl: string; license: string; attribution: string };
export type Shipment = {
  vesselContext: VesselContext | null;
  pendingReferences: { factoryModel: string; vesselDisplayReference: string; voyageDisplayReference: string; vesselIdentityVerification: "pending"; voyageVerification: "pending"; cargoAssociation: "unconfirmed"; recordedAt: string; source: "operator-supplied reference" } | null;
  schemaVersion: 2; assetId: string; stageVerification: "confirmed" | "unverified"; lifecycleState: string; shipmentStatus: string;
  vessel: { name: string; source: Source } | null; voyage: string | null; eta: string | null; etaState: string;
  lastUpdated: string; lastChecked: string | null;
  currentPosition: (Point & { timestamp: string; speedKnots: number | null; course: number | null; status: string | null; source: Source }) | null;
  positionState: "observed" | "stale" | "unavailable";
  timeline: JourneyEvent[]; satelliteImagery: JourneyImage[]; imagery: JourneyMedia[];
  ports: Array<{ id: string; name: string; country: string; coordinates: Point; sourceUrl: string }>;
  route: { planned: Point[]; source: string | null };
  map: { trackSegments: Point[][]; cargoAssociationConfirmed: boolean; originFacility: { label: string; coordinates: Point } | null; inlandDestination: { region: string; coordinates: Point; precision: "whole-degree" } | null };
};
type Obj = Record<string, unknown>;
const object = (v: unknown): Obj => { if (!v || typeof v !== "object" || Array.isArray(v)) throw Error("Invalid public shipment"); return v as Obj; };
const text = (v: unknown, max = 300): string => { if (typeof v !== "string" || v.length > max) throw Error("Invalid text"); return v; };
const list = (v: unknown, max = 1000): unknown[] => { if (!Array.isArray(v) || v.length > max) throw Error("Invalid list"); return v; };
const numeric = (v: unknown, min: number, max: number): number => { if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max) throw Error("Invalid number"); return v; };
const nullableNumber = (v: unknown, min: number, max: number) => v == null ? null : numeric(v, min, max);
const maybeText = (v: unknown) => v == null ? null : text(v);
const time = (v: unknown) => { const t = text(v); if (!/^\d{4}-\d{2}-\d{2}T/.test(t) || !Number.isFinite(Date.parse(t))) throw Error("Invalid time"); return t; };
const point = (v: unknown): Point => { const p = object(v); return { latitude: numeric(p.latitude, -90, 90), longitude: numeric(p.longitude, -180, 180) }; };
export function safePublicUrl(v: unknown): string {
  const raw = text(v, 2048), u = new URL(raw);
  if (u.protocol !== "https:" || u.username || u.password || u.search || /\/(api|admin|private|internal|evidence|documents?)(\/|$)/i.test(decodeURIComponent(u.pathname))) throw Error("Private or invalid URL");
  return raw;
}
const source = (v: unknown): Source => { const s = object(v); return { provider: text(s.provider), url: safePublicUrl(s.url), observedAt: time(s.observedAt) }; };
const states: EventState[] = ["planned", "estimated", "observed", "confirmed", "delayed", "completed"];
const state = (v: unknown): EventState => { if (!states.includes(v as EventState)) throw Error("Invalid event state"); return v as EventState; };
const optionalRows = <T>(v: unknown, parse: (v: unknown) => T): T[] => {
  if (!Array.isArray(v) || v.length > 1000) return [];
  return v.flatMap(row => { try { return [parse(row)]; } catch { return []; } });
};
export function parseShipment(raw: unknown, assetId = "SP-ARDHI-26"): Shipment {
  const d = object(raw);
  if (d.schemaVersion !== 2 || d.assetId !== assetId || !["confirmed", "unverified"].includes(String(d.stageVerification))) throw Error("Invalid shipment identity/version");
  const timeline = list(d.timeline).map(row => {
    const e = object(row);
    if (e.publicApproved !== true) throw Error("Non-public event");
    return { id: text(e.id), timestamp: time(e.timestamp), summary: text(e.summary), eventType: text(e.eventType), eventState: state(e.eventState), source: source(e.source), milestone: e.milestone == null ? undefined : text(e.milestone), portId: e.portId == null ? undefined : text(e.portId) };
  });
  const current = d.currentPosition == null ? null : object(d.currentPosition);
  const vessel = d.vessel == null ? null : object(d.vessel);
  const r = object(d.route), m = object(d.map);
  if (m.simulated !== false || m.positionRepresents !== "vessel-only") throw Error("Unsupported map source");
  if (!["observed", "stale", "unavailable"].includes(String(d.positionState))) throw Error("Invalid freshness");
  const eventExists = (id: unknown) => { const value = text(id); if (!timeline.some(e => e.id === value)) throw Error("Unlinked media"); return value; };
  const satelliteImagery = optionalRows(d.satelliteImagery, row => {
    const i = object(row), identified = i.vesselIdentified;
    if (i.role !== "contextual-media" || typeof identified !== "boolean" || i.verificationStatus !== (identified ? "vessel-identified" : "context-verified")) throw Error("Unapproved satellite verification");
    const license = text(i.license, 2000), attribution = text(i.attribution, 2000);
    if (!license.trim() || !attribution.trim()) throw Error("Unlicensed imagery");
    return { id: text(i.id), eventId: eventExists(i.eventId), url: safePublicUrl(i.url), sourceUrl: safePublicUrl(i.sourceUrl), provider: text(i.provider), captureTime: time(i.captureTime), center: point(i.center), resolutionMetres: numeric(i.resolutionMetres, .01, 100000), cloudCover: nullableNumber(i.cloudCover, 0, 100), license, attribution, vesselIdentified: identified, verificationStatus: i.verificationStatus as JourneyImage["verificationStatus"] };
  });
  const imagery = optionalRows(d.imagery, row => {
    const i = object(row); if (i.publicApproved !== true || !["photo", "video", "tracking-record"].includes(String(i.kind))) throw Error("Unapproved media");
    const license = text(i.license, 2000), attribution = text(i.attribution, 2000); if (!license.trim() || !attribution.trim()) throw Error("Unlicensed media");
    return { id: text(i.id), eventId: eventExists(i.eventId), url: safePublicUrl(i.url), title: text(i.title), kind: i.kind as JourneyMedia["kind"], sourceUrl: safePublicUrl(i.sourceUrl), license, attribution };
  });
  const origin = m.originFacility == null ? null : object(m.originFacility), destination = m.inlandDestination == null ? null : object(m.inlandDestination);
  const destinationPoint = destination ? point(destination.coordinates) : null;
  if (destination && (destination.precision !== "whole-degree" || !Number.isInteger(destinationPoint!.latitude) || !Number.isInteger(destinationPoint!.longitude))) throw Error("Private destination precision");
  let pendingReferences: Shipment["pendingReferences"] = null;
  if (d.stageVerification === "unverified" && d.pendingReferences != null) {
    const p = object(d.pendingReferences);
    if (p.vesselIdentityVerification !== "pending" || p.voyageVerification !== "pending" || p.cargoAssociation !== "unconfirmed" || p.source !== "operator-supplied reference") throw Error("Invalid pending reference state");
    pendingReferences = { factoryModel: text(p.factoryModel, 100), vesselDisplayReference: text(p.vesselDisplayReference, 100), voyageDisplayReference: text(p.voyageDisplayReference, 100), vesselIdentityVerification: "pending", voyageVerification: "pending", cargoAssociation: "unconfirmed", recordedAt: time(p.recordedAt), source: "operator-supplied reference" };
  }
  return {
    vesselContext: parseVesselContext(d.vesselContext),
    pendingReferences,
    schemaVersion: 2, assetId, stageVerification: d.stageVerification as Shipment["stageVerification"], lifecycleState: text(d.lifecycleState), shipmentStatus: text(d.shipmentStatus),
    vessel: vessel ? { name: text(vessel.name), source: source(vessel.source) } : null, voyage: maybeText(d.voyage), eta: maybeText(d.eta), etaState: text(d.etaState),
    lastUpdated: d.lastUpdated === "" ? "" : time(d.lastUpdated), lastChecked: d.lastChecked == null ? null : time(d.lastChecked),
    currentPosition: current ? { ...point(current), timestamp: time(current.timestamp), speedKnots: nullableNumber(current.speedKnots, 0, 60), course: nullableNumber(current.course, 0, 360), status: maybeText(current.status), source: source(current.source) } : null,
    positionState: d.positionState as Shipment["positionState"], timeline, satelliteImagery, imagery,
    ports: list(d.ports, 100).map(row => { const p = object(row); if (p.publicApproved !== true) throw Error("Private port"); return { id: text(p.id), name: text(p.name), country: text(p.country), coordinates: point(p.coordinates), sourceUrl: safePublicUrl(p.sourceUrl) }; }),
    route: { planned: list(r.planned).map(point), source: r.source == null ? null : safePublicUrl(r.source) },
    map: { trackSegments: list(m.trackSegments).map(segment => list(segment).map(point)), cargoAssociationConfirmed: m.cargoAssociationConfirmed === true, originFacility: origin ? { label: text(origin.label), coordinates: point(origin.coordinates) } : null, inlandDestination: destination ? { region: text(destination.region), coordinates: destinationPoint!, precision: "whole-degree" } : null },
  };
}
export const CACHE_KEY = "smashpro.public-shipment.v2.SP-ARDHI-26";
export type ShipmentResult = { data: Shipment | null; status: "loading" | "current" | "cached" | "unavailable" };
// Cache a public wire projection, not provider/administrative payloads. Reparse on read.
export function cacheWire(d: Shipment): unknown {
  return { ...d, timeline: d.timeline.map(e => ({ ...e, publicApproved: true })), ports: d.ports.map(p => ({ ...p, publicApproved: true })), satelliteImagery: d.satelliteImagery.map(i => ({ ...i, role: "contextual-media" })), imagery: d.imagery.map(i => ({ ...i, publicApproved: true })), map: { ...d.map, simulated: false, positionRepresents: "vessel-only" } };
}
export function readCache(storage?: Pick<Storage, "getItem">): Shipment | null {
  try { const raw = storage?.getItem(CACHE_KEY); if (!raw || raw.length > 1000000) return null; const d = parseShipment(JSON.parse(raw)); return d.stageVerification === "confirmed" ? d : null; } catch { return null; }
}
export async function loadShipment(endpoint: string, storage?: Pick<Storage, "getItem" | "setItem" | "removeItem">, fetcher: typeof fetch = fetch, timeoutMs = 8000): Promise<ShipmentResult> {
  const controller = new AbortController(); let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const d = await Promise.race([
      (async () => { const response = await fetcher(endpoint, { signal: controller.signal, credentials: "omit", headers: { Accept: "application/json" } }); if (!response.ok) throw Error("Unavailable"); const raw = await response.text(); if (raw.length > 1000000) throw Error("Response too large"); return parseShipment(JSON.parse(raw)); })(),
      new Promise<never>((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(Error("Timeout")); }, timeoutMs); }),
    ]);
    try { if (d.stageVerification === "confirmed") storage?.setItem(CACHE_KEY, JSON.stringify(cacheWire(d))); else storage?.removeItem(CACHE_KEY); } catch { /* Restricted storage must not block the passport. */ }
    return { data: d, status: "current" };
  } catch { const data = readCache(storage); return { data, status: data ? "cached" : "unavailable" }; }
  finally { if (timer) clearTimeout(timer); controller.abort(); }
}
export const stageText = (r: ShipmentResult) => r.data?.stageVerification === "confirmed" ? r.data.shipmentStatus : r.status === "unavailable" ? "Shipment update unavailable." : r.status === "loading" ? "Checking shipment record…" : "Ocean departure awaiting confirmation";
export const positionStale = (d: Shipment, now = Date.now()) => d.positionState === "stale" || !d.currentPosition || now - Date.parse(d.currentPosition.timestamp) > 18 * 3600000;
export const formatTime = (v: string | null | undefined) => v && Number.isFinite(Date.parse(v)) ? new Date(v).toLocaleString("en-US", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC" : "Not available";
export const eventAnchor = (id: string) => `shipment-event-${encodeURIComponent(id)}`;
