import type { ReactNode } from "react";
import type { GalleryImage } from "../types/equipment";

/** A dated, expandable public record; media and provenance stay with its event. */
export function PassportEvidenceRecord({ id, date, phase, title, label, preview, defaultOpen = false, children }: {
  id: string; date: string; phase: string; title: string; label: string;
  preview?: GalleryImage; defaultOpen?: boolean; children: ReactNode;
}) {
  return <details className="passport-evidence-record" id={id} open={defaultOpen}>
    <summary>
      {preview && <img src={preview.src} alt="" width="96" height="72" loading="lazy" />}
      <span className="passport-evidence-record__heading"><small>{date} · {phase}</small><strong>{title}</strong><em>{label}</em></span>
      <span className="passport-evidence-record__toggle" aria-hidden="true">+</span>
    </summary>
    <div className="passport-evidence-record__body">{children}</div>
  </details>;
}
