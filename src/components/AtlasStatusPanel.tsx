import { useEffect, useState } from "react";
import { atlasFreshnessLabel, atlasModeLabel, loadAtlasLocation, type AtlasLocationContext } from "../domain/atlas";
import "../styles/atlas-status.css";

const modeGlyph: Record<AtlasLocationContext["mode"], string> = {
  ocean: "◒", air: "✈", road: "▰", rail: "═", jobsite: "⌖", yard: "▦", warehouse: "▤", port: "⚓", factory: "⌂", unknown: "◎",
};

export function AtlasStatusPanel({ assetId, context }: { assetId: string; context?: AtlasLocationContext | null }) {
  const [remote, setRemote] = useState<AtlasLocationContext | null>(context ?? null);
  useEffect(() => {
    if (context) { setRemote(context); return; }
    let active = true;
    void loadAtlasLocation(assetId).then(value => { if (active) setRemote(value); });
    return () => { active = false; };
  }, [assetId, context]);

  const atlas = context ?? remote;
  if (!atlas) return null;
  const detail = atlas.checkpoint?.label ?? atlas.context.vessel ?? atlas.context.carrier ?? atlas.context.flight ?? (atlas.position ? `${atlas.position.precision} position` : "Location context available");
  const sourceLabel = atlas.source?.provider ?? "SmashPro Atlas";
  return <section className={`atlas-status atlas-status--${atlas.mode}`} aria-label="SmashPro Atlas location intelligence">
    <div className="atlas-status__heading">
      <span className="atlas-status__glyph" aria-hidden="true">{modeGlyph[atlas.mode]}</span>
      <div><p className="eyebrow">SmashPro Atlas</p><h3>{atlasModeLabel(atlas.mode)} context</h3><p>{detail}</p></div>
      <span className={`atlas-status__freshness is-${atlas.freshness}`}>{atlasFreshnessLabel(atlas.freshness)}</span>
    </div>
    <div className="atlas-status-grid">
      <p><span>Mode</span><strong>{atlasModeLabel(atlas.mode)}</strong></p>
      <p><span>Map profile</span><strong>{atlas.presentation.preferredBasemap}</strong></p>
      <p><span>History</span><strong>{atlas.history.available ? `${atlas.history.observationCount} record${atlas.history.observationCount === 1 ? "" : "s"}` : "Not available"}</strong></p>
      <p><span>Source</span><strong>{sourceLabel}</strong></p>
    </div>
    {atlas.position ? <p className="atlas-status__position">{atlas.position.latitude.toFixed(1)}°, {atlas.position.longitude.toFixed(1)}° · {atlas.position.precision} precision · observed {new Date(atlas.position.observedAt).toLocaleString("en-US",{timeZone:"UTC",dateStyle:"medium",timeStyle:"short"})} UTC</p> : <p className="atlas-status__position">No public coordinates are published for this location state.</p>}
    <p className="shipment-small">Atlas selects the best approved location signal for this asset. Location intelligence does not prove cargo discharge, customs clearance, delivery, custody, commissioning, or job completion.</p>
  </section>;
}
