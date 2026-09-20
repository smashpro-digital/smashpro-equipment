import { useEffect, useState } from "react";
import type { Equipment } from "../types/equipment";
import { PassportEvidenceRecord } from "./PassportEvidenceRecord";
import "../styles/commissioning-passport.css";

const materialLabels: Record<string, string> = {
  commissioning: "Commissioning",
  planned_validation: "Validation planned",
  blocked_pending_enclosure_ventilation_and_process_validation: "Blocked — enclosure, ventilation and process validation required",
};

/** Reusable passport layout for assets that have not reached production release. */
export function CommissioningPassport({ item }: { item: Equipment }) {
  const record = item.commissioning!;
  const runtime = item.publicRuntime;
  const [liveRuntime, setLiveRuntime] = useState<{
    verified_runtime_minutes: number;
    verified_runtime_hours: number;
    completed_runs: number;
    failed_runs: number;
    cancelled_runs: number;
    runtime_completeness: string;
    last_updated_at: string | null;
  } | null>(null);

  useEffect(() => {
    if (!runtime?.endpoint) return;
    let active = true;
    fetch(runtime.endpoint, { headers: { Accept: "application/json" } })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("runtime unavailable")))
      .then(payload => {
        if (active && payload?.ok === true && payload?.data) setLiveRuntime(payload.data);
      })
      .catch(() => { /* Static verified baseline remains the safe fallback. */ });
    return () => { active = false; };
  }, [runtime?.endpoint]);

  const verifiedMinutes = liveRuntime?.verified_runtime_minutes ?? runtime?.verifiedBaselineMinutes ?? 0;
  const verifiedHours = liveRuntime?.verified_runtime_hours ?? runtime?.verifiedBaselineHours ?? 0;
  const runtimeClock = `${Math.floor(verifiedMinutes / 60)}h ${verifiedMinutes % 60}m`;
  const identities = [
    ["SmashPro machine identity", item.fleetId], ["OEM identity", `${item.manufacturer} ${item.identity.factoryModel}`],
    ["Operational MicroFab ID", item.operationalAssetId], ["Permanent passport ID", item.identity.passportId],
    ["Division", item.division], ["Asset class", item.identity.assetClass],
    ["Model / fleet entry year", String(item.identity.modelYear)], ["Lifecycle", item.statusLabel],
  ];
  return <div className="commissioning-passport">
    <header className="shell commissioning-hero">
      <div><p className="eyebrow">{item.division} · Equipment Passport</p><h1>{item.fleetId}</h1><p className="commissioning-tagline">{item.slogan}</p><p>{item.overview}</p><span className="commissioning-status">{item.statusLabel}</span><p className="commissioning-note">{item.statusDetail}</p></div>
      <figure><img src={item.heroImage} alt={`${item.fleetId} passport identity graphic; not a machine photograph`} width="1200" height="900" /><figcaption>Identity graphic · approved machine photographs pending</figcaption></figure>
    </header>
    <nav className="shell commissioning-nav" aria-label="Passport sections">{["identity", "capabilities", ...(runtime ? ["runtime"] : []), "materials", "history", "service", "media"].map(id => <a key={id} href={`#${id}`}>{id}</a>)}</nav>
    <section className="section shell" id="identity"><p className="eyebrow">One physical machine</p><h2>Four identities. One record.</h2><p>FlashForge AD5X is the OEM product. {item.fleetId} is its SmashPro machine name. The operational ID connects production, runtime and maintenance; the permanent passport follows the machine.</p><dl className="spec-grid passport-spec-grid">{identities.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
    <section className="spec-section" id="capabilities"><div className="shell"><p className="eyebrow">Configured capability</p><h2>Built around fabrication.</h2><p>{item.capabilityStatement}</p><dl className="spec-grid">{item.specifications.filter(spec => spec.confirmed).map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl><ul className="commissioning-capabilities">{item.capabilities.map(capability => <li key={capability}>{capability}</li>)}</ul></div></section>
    {runtime && <section className="section shell" id="runtime"><p className="eyebrow">Break-in &amp; utilization</p><h2>{runtimeClock} verified machine runtime.</h2><p>The public passport reports only machine minutes backed by the Digital HQ runtime ledger or a documented manual-confirmed baseline. Printer completion never passes QC or closes manufacturing work.</p><dl className="spec-grid passport-spec-grid"><div><dt>Verified runtime</dt><dd>{verifiedHours.toFixed(2)} hours</dd></div><div><dt>Verified minutes</dt><dd>{verifiedMinutes} min</dd></div><div><dt>Completed runs in live ledger</dt><dd>{liveRuntime ? liveRuntime.completed_runs : "Baseline only"}</dd></div><div><dt>Tracking state</dt><dd>{runtime.trackingStatus.replaceAll("_", " ")}</dd></div></dl><div className="commissioning-callout"><h3>Automatic tracking path</h3><p>{liveRuntime ? "Digital HQ runtime rollup is online." : "Using the verified static baseline until the live rollup responds."} The local FlashForge adapter still requires live edge commissioning before unattended printer-to-passport tracking is complete.</p>{(liveRuntime?.runtime_completeness ?? runtime.additionalRuntimeStatus) === "partial_backfill" || runtime.additionalRuntimeStatus === "pending_backfill" ? <p>Additional successful break-in jobs are known, but their durations are not yet backfilled. They are intentionally excluded from the verified hour total.</p> : null}</div></section>}
    <section className="section shell" id="materials"><p className="eyebrow">Validation before production</p><h2>Material readiness.</h2><p>These are the current recorded authorization states, not blanket material or product approvals.</p><dl className="commissioning-materials">{record.materials.map(material => <div key={material.material}><dt>{material.material === "ABS_ASA_OR_ENGINEERING" ? "ABS / ASA / engineering materials" : material.material}</dt><dd>{materialLabels[material.status] ?? "Not verified"}</dd></div>)}</dl><div className="commissioning-callout"><h3>Enclosure and modifications</h3><p>{record.enclosureStatus}</p><p>{record.modificationStatus}</p></div></section>
    <section className="timeline-section" id="history"><div className="shell"><p className="eyebrow">Commissioning timeline</p><h2>A record that grows with the machine.</h2><ol className="commissioning-stages">{item.lifecycleMilestones?.map(stage => <li key={stage.id} data-state={stage.status}><strong>{stage.label}</strong><span>{stage.status === "upcoming" ? "Pending" : stage.status === "current" ? "In progress" : "Recorded"}</span></li>)}</ol><ol className="passport-timeline">{item.timeline.filter(event => event.publicDisplay).map(event => <li key={event.id}><PassportEvidenceRecord id={`history-${event.id}`} date={event.occurredAt ?? "Date not published"} phase={event.kind} title={event.title} label="Open record"><p>{event.detail}</p></PassportEvidenceRecord></li>)}</ol></div></section>
    <section className="section shell" id="service"><p className="eyebrow">Care and continuity</p><h2>Maintenance &amp; service.</h2><p>{record.maintenanceStatus}</p><p>Commissioning checks cover the build plate, nozzle and hotend, filament path, material condition and appropriate ventilation. Service intervals will follow verified OEM guidance; no schedule or completed service is inferred.</p></section>
    <section className="section shell" id="media"><p className="eyebrow">Public evidence</p><h2>Media archive.</h2><p>No approved machine photographs or videos are published in this first passport. The identity graphic is not evidence of the physical machine or its enclosure.</p><p className="commissioning-note">This public record contains approved equipment facts only. Operational records remain in Digital HQ under {item.operationalAssetId}.</p></section>
  </div>;
}
