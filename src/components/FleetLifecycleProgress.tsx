import { useEffect, useRef, useState, type CSSProperties } from "react";

export type FleetLifecycleStage = {
  id: string;
  label: string;
  status: "complete" | "current" | "pending";
  progress: number;
};

export type FleetLifecycleMetric = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
};

type FleetLifecycleProgressProps = {
  stages: FleetLifecycleStage[];
  metrics: FleetLifecycleMetric[];
  currentStage: string;
  nextStage: string;
};

function LifecycleCounter({ active, value, suffix = "" }: { active: boolean; value: number; suffix?: string }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / 900);
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return <>{shown.toLocaleString()}{suffix}</>;
}

export function FleetLifecycleProgress({ stages, metrics, currentStage, nextStage }: FleetLifecycleProgressProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      observer.disconnect();
    }, { threshold: 0.3 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`section shell fleet-lifecycle-progress${started ? " is-started" : ""}`} aria-labelledby="fleet-lifecycle-title">
      <div className="section-heading">
        <div><p className="eyebrow">Fleet Journey Progress</p><h2 id="fleet-lifecycle-title">The record moves with the machine.</h2></div>
        <p>Distance is approximate and does not represent live tracking.</p>
      </div>
      <div className="fleet-lifecycle-state" aria-label={`Current stage ${currentStage}. Next stage ${nextStage}.`}>
        <div><span>Current Stage</span><strong>{currentStage}</strong></div>
        <div><span>Next Stage</span><strong>{nextStage}</strong></div>
      </div>
      <div className="fleet-lifecycle-metrics">
        {metrics.map((metric) => <article key={metric.id}><span>{metric.label}</span><strong><LifecycleCounter active={started} value={metric.value} suffix={metric.suffix} /></strong></article>)}
      </div>
      <ol className="fleet-lifecycle-stages" aria-label="Fleet lifecycle stages">
        {stages.map((stage, index) => (
          <li className={`is-${stage.status}`} key={stage.id}>
            <div><strong>{stage.label}</strong><span>{stage.status === "complete" ? "✓ Complete" : stage.status === "current" ? "● Current" : "○ Pending"}</span></div>
            <i aria-hidden="true"><b style={{ "--lifecycle-progress": stage.progress / 100, "--lifecycle-delay": `${index * 180}ms` } as CSSProperties} /></i>
          </li>
        ))}
      </ol>
    </section>
  );
}
