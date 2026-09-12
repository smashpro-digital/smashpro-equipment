import { useEffect, useRef, useState } from "react";
import type { GeoJsonObject } from "geojson";
import type { Point, Shipment } from "../domain/shipment";
import { eventAnchor, formatTime, positionStale } from "../domain/shipment";
import "leaflet/dist/leaflet.css";

export default function ShipmentMap({ data }: { data: Shipment | null }) {
  const root = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const hasPosition = !!data?.currentPosition;
  const hasLocations = hasPosition || !!data?.ports.length || !!data?.map.originFacility || !!data?.map.inlandDestination;
  useEffect(() => {
    if (!root.current) return;
    let disposed = false, cleanup = () => {};
    const controller = new AbortController();
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void import("leaflet").then(async L => {
        if (disposed || !root.current) return;
        const map = L.map(root.current, { scrollWheelZoom: false, zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false, minZoom: 1, maxZoom: 6, zoomControl: !!hasLocations }).setView([20, 0], 1);
        const resize = new ResizeObserver(() => map.invalidateSize({ animate: false })); resize.observe(root.current);
        cleanup = () => { resize.disconnect(); map.remove(); };
        map.attributionControl.addAttribution('Reference map: <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth · public domain</a>');
        const points: Point[] = [...(data?.route.planned ?? []), ...(data?.ports.map(p => p.coordinates) ?? []), ...(data?.currentPosition ? [data.currentPosition] : []), ...(data?.map.originFacility ? [data.map.originFacility.coordinates] : []), ...(data?.map.inlandDestination ? [data.map.inlandDestination.coordinates] : [])];
        const pacific = points.length > 1 && Math.max(...points.map(p => p.longitude)) - Math.min(...points.map(p => p.longitude)) > 180;
        const coord = (p: Point): [number, number] => [p.latitude, pacific && p.longitude < 0 ? p.longitude + 360 : p.longitude];
        const routes = L.layerGroup().addTo(map);
        if (data?.route.planned.length) L.polyline(data.route.planned.map(coord), { color: "#d5b871", weight: 2, dashArray: "7 8", opacity: .9 }).addTo(routes);
        data?.map.trackSegments.forEach(segment => L.polyline(segment.map(coord), { color: "#8ad84a", weight: 4 }).addTo(routes));
        const marker = (p: Point, name: string, symbol: string, kind: string, eventId?: string) => {
          const node = document.createElement("div");
          const title = document.createElement("strong"); title.textContent = name; node.append(title);
          if (eventId) { const link = document.createElement("a"); link.textContent = "View journey event"; link.href = `#${eventAnchor(eventId)}`; node.append(link); }
          L.marker(coord(p), { title: name, alt: name, keyboard: true, icon: L.divIcon({ className: `shipment-marker ${kind}`, html: `<span>${symbol}</span>`, iconSize: [32, 32], iconAnchor: [16, 16] }) }).bindPopup(node).addTo(map);
        };
        data?.ports.forEach((p, i) => marker(p.coordinates, p.name, String(i + 1), "port", data.timeline.find(e => e.portId === p.id)?.id));
        if (data?.map.originFacility) marker(data.map.originFacility.coordinates, data.map.originFacility.label, "F", "facility");
        if (data?.map.inlandDestination) marker(data.map.inlandDestination.coordinates, `${data.map.inlandDestination.region} · coarse destination`, "R", "region");
        if (data?.currentPosition) marker(data.currentPosition, `${data.vessel?.name ?? "Vessel"} · ${positionStale(data) ? "last known" : "observed"} ${formatTime(data.currentPosition.timestamp)}`, "▲", "vessel", data.timeline.find(e => e.eventType === "ais-observation" && e.timestamp === data.currentPosition!.timestamp)?.id);
        if (points.length) map.fitBounds(L.latLngBounds(points.map(coord)), { padding: [42, 42], maxZoom: 4, animate: false });
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}maps/ne_110m_land.geojson`, { signal: controller.signal });
          if (!response.ok) throw Error("Reference map unavailable");
          const geography = await response.json() as GeoJsonObject;
          if (disposed) return;
          L.geoJSON(geography, { interactive: false, style: { color: "#34513e", fillColor: "#17281e", fillOpacity: 1, weight: .7 } }).addTo(map).bringToBack();
          if (pacific) L.geoJSON(geography, { interactive: false, coordsToLatLng: coords => L.latLng(coords[1], coords[0] + 360), style: { color: "#34513e", fillColor: "#17281e", fillOpacity: 1, weight: .7 } }).addTo(map).bringToBack();
        } catch { if (!disposed) setFailed(true); }
      }).catch(() => { if (!disposed) setFailed(true); });
    }, { rootMargin: "160px" });
    observer.observe(root.current);
    return () => { disposed = true; controller.abort(); observer.disconnect(); cleanup(); };
  }, [data, hasLocations]);
  return <div className="shipment-map-frame">
    <div ref={root} className="shipment-map" role="region" aria-label="Shipment reference map" aria-describedby="shipment-map-summary" />
    {!hasLocations && <div className="shipment-map-empty"><span aria-hidden="true">◎</span><strong>Awaiting a verified location</strong><p>Ports and a vessel position will appear when public evidence is available.</p></div>}
    {failed && <p className="shipment-map-error">Reference geography unavailable. The text summary remains available.</p>}
    <div className="shipment-map-legend"><span><i className="observed" />Observed vessel track</span><span><i className="projected" />Projected / reported route</span></div>
  </div>;
}
