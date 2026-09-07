import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/build-connections.css";

const lifecycleLabels: Record<string, string> = {
  planned: "Planned", active: "Active", paused: "Paused", completed: "Completed", archived: "Archived",
};
const phaseLabels: Record<string, string> = {
  planning: "Planning", inspection: "Inspection", teardown: "Teardown", repair: "Repair",
  fabrication: "Fabrication", assembly: "Assembly", validation: "Validation", follow_up: "Follow-up",
};
type BuildStatus = { lifecycle: string; phase: string; reviewed: string };
type PublicRecord = { build?: { canonical_path?: unknown; lifecycle?: unknown; phase?: unknown; source_updated_at?: unknown } };

/** Navigation and an optional public projection, never a second editable build record. */
export function BuildConnections() {
  const { pathname } = useLocation();
  const path = pathname.replace(/^\/equipment(?=\/)/, "").replace(/\/$/, "");
  const isCart = path === "/golf-cart-tech-build.html";
  const isPcm = path === "/catalog/sp-pcm-001";
  const canonicalPath = isCart ? "/equipment/golf-cart-tech-build.html" : isPcm ? "/rebirth/" : "";
  const [status, setStatus] = useState<BuildStatus | null>(null);

  useEffect(() => {
    setStatus(null);
    if (!canonicalPath) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4000);
    fetch("/wp-json/smashpro/v1/garage-builds", {
      signal: controller.signal, credentials: "omit", headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) return;
        const records: unknown = await response.json();
        if (!Array.isArray(records)) return;
        const record = records.find((item: unknown) => {
          if (!item || typeof item !== "object") return false;
          return (item as PublicRecord).build?.canonical_path === canonicalPath;
        }) as PublicRecord | undefined;
        const build = record?.build;
        if (!build || typeof build.lifecycle !== "string" || typeof build.phase !== "string") return;
        if (!Object.hasOwn(lifecycleLabels, build.lifecycle) || !Object.hasOwn(phaseLabels, build.phase)) return;
        const reviewed = typeof build.source_updated_at === "string" && /^\d{4}-\d{2}-\d{2}$/.test(build.source_updated_at)
          ? build.source_updated_at : "";
        if (!controller.signal.aborted) setStatus({ lifecycle: lifecycleLabels[build.lifecycle], phase: phaseLabels[build.phase], reviewed });
      })
      .catch(() => { /* The canonical links remain usable when the API is unavailable. */ })
      .finally(() => window.clearTimeout(timeout));
    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, [canonicalPath]);

  if (!canonicalPath) return null;
  return (
    <aside className="build-connections" aria-label="Related Garage build">
      <div className="build-connections__inner">
        <nav aria-label="Garage project connections">
          <a href="/garage/builds/">Builds &amp; Restorations</a>
          {isPcm ? <a href="/rebirth/">Project Rebirth: the truck behind SP-PCM-001</a> : <span>Golf Cart Tech Build</span>}
        </nav>
        {status && <p>Project record: <strong>{status.lifecycle}</strong> · {status.phase}{status.reviewed && <> · Reviewed <time dateTime={status.reviewed}>{status.reviewed}</time></>}</p>}
      </div>
    </aside>
  );
}
