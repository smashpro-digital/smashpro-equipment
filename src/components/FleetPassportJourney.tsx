import { useEffect, useState } from "react";
import { FleetLifecycleProgress, type FleetLifecycleStage, type FleetLifecycleMetric } from "./FleetLifecycleProgress";
import "../styles/fleet-passport-journey.css";

export type PassportLocation = {
  label: string;
  verification: string;
  observedAt: string;
  evidenceHref: string;
};

/** Public location evidence and lifecycle presentation; no vessel or coordinates are inferred. */
export function FleetPassportJourney({ assetId, stages, location, description, metrics }: {
  assetId: string; stages: FleetLifecycleStage[]; location: PassportLocation;
  description: string; metrics: FleetLifecycleMetric[];
}) {
  const current = stages.findIndex(stage => stage.status === "current");
  const currentStage = stages[current]?.label ?? "Awaiting verified stage";
  const nextStage = stages.slice(current + 1).find(stage => stage.status === "pending")?.label ?? "No pending milestone";
  return <section id="journey" className="fleet-passport-journey" aria-label={`${assetId} journey`}>
    <div className="shell fleet-location-panel">
      <div><p className="eyebrow">Current location · last documented</p><h2>{location.label}</h2><p>{location.verification} · <time dateTime={location.observedAt}>{location.observedAt}</time></p><a href={location.evidenceHref}>Open location evidence →</a></div>
      <dl><div><dt>Current stage</dt><dd>{currentStage}</dd></div><div><dt>Next milestone · pending</dt><dd>{nextStage}</dd></div><div><dt>Lifecycle position</dt><dd>{current < 0 ? "—" : current + 1} / {stages.length}</dd></div></dl>
    </div>
    <FleetLifecycleProgress stages={stages} metrics={metrics} currentStage={currentStage} nextStage={nextStage} eyebrow="Fleet journey" title="Evidence advances the journey." description={description} />
  </section>;
}

/** Navigation context and reading progress are separate from verified lifecycle position. */
export function PassportReadingStatus({ assetId, stages }: { assetId: string; stages: FleetLifecycleStage[] }) {
  const [section, setSection] = useState("Passport");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const headings = ["passport", "journey", "history", "service"];
    let frame = 0;
    const update = () => {
      frame = 0;
      const active = headings.filter(id => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 160).at(-1) ?? "passport";
      setSection(active[0].toUpperCase() + active.slice(1));
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(range > 0 ? Math.min(100, Math.max(0, window.scrollY / range * 100)) : 0);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  const current = stages.findIndex(stage => stage.status === "current");
  return <aside className="passport-reading-status" aria-label="Passport reading context">
    <div><span>Now viewing</span><strong>{assetId} → {section}</strong></div>
    <div><span>{stages[current]?.label ?? "Awaiting verified stage"}</span><b>{current < 0 ? "—" : current + 1} / {stages.length}</b></div>
    <progress max="100" value={progress} aria-label="Page reading progress" />
  </aside>;
}
