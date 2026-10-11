import { useEffect } from "react";
import { EquipmentPassportPage } from "./EquipmentDetailPage";
import "../styles/ardhi-passport-compact-overrides.css";
import "../styles/ardhi-manufacturer-pdf-compact.css";

import "../styles/ardhi-flagship.css";

import { DRIVE_EVIDENCE_HISTORY } from "../data/ardhiEvidenceHistory";

function injectDriveEvidenceHistory() {
  const timeline = document.querySelector<HTMLOListElement>(".ardhi-expandable-timeline");
  if (!timeline || timeline.dataset.driveEvidenceInjected === "true") return;

  const firstRecord = Array.from(timeline.children).find((child) => !child.classList.contains("history-phase"));
  const insertionPoint = firstRecord?.nextSibling ?? null;

  DRIVE_EVIDENCE_HISTORY.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "is-documented drive-evidence-record";
    item.id = entry.id;

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const date = document.createElement("span");
    const title = document.createElement("strong");
    const meta = document.createElement("em");

    date.textContent = entry.date;
    title.textContent = entry.title;
    meta.textContent = `documented · ${entry.photos?.length ?? 0} media · archived evidence`;
    summary.append(date, title, meta);

    const detail = document.createElement("div");
    detail.className = "history-detail";
    const narrative = document.createElement("p");
    narrative.textContent = entry.narrative;
    detail.appendChild(narrative);

    if (entry.decision) {
      const decision = document.createElement("aside");
      const label = document.createElement("b");
      label.textContent = "Decision context";
      const text = document.createElement("p");
      text.textContent = entry.decision;
      decision.append(label, text);
      detail.appendChild(decision);
    }

    if (entry.supplier) {
      const supplier = document.createElement("aside");
      const label = document.createElement("b");
      label.textContent = "Supplier comparison";
      const text = document.createElement("p");
      text.textContent = entry.supplier;
      supplier.append(label, text);
      detail.appendChild(supplier);
    }

    if (entry.photos?.length) {
      const media = document.createElement("div");
      media.className = "history-media";
      entry.photos.forEach((src) => {
        const photo = document.createElement("img");
        photo.src = src;
        photo.alt = `Factory evidence supporting ${entry.title}`;
        photo.loading = "lazy";
        photo.decoding = "async";
        media.appendChild(photo);
      });
      detail.appendChild(media);
    }

    const evidence = document.createElement("aside");
    const evidenceLabel = document.createElement("b");
    evidenceLabel.textContent = "Evidence archive";
    const evidenceText = document.createElement("p");
    evidenceText.textContent = "Archived conversation evidence";
    evidenceText.dataset.sourceReference = entry.evidence;
    evidence.append(evidenceLabel, evidenceText);
    detail.appendChild(evidence);

    const counts = document.createElement("dl");
    const mediaCount = document.createElement("div");
    const mediaLabel = document.createElement("dt");
    const mediaValue = document.createElement("dd");
    mediaLabel.textContent = "Media";
    mediaValue.textContent = String(entry.photos?.length ?? 0);
    mediaCount.append(mediaLabel, mediaValue);
    counts.appendChild(mediaCount);
    detail.appendChild(counts);

    details.append(summary, detail);
    item.appendChild(details);
    timeline.insertBefore(item, insertionPoint);
  });

  timeline.dataset.driveEvidenceInjected = "true";
}

export function ArdhiPassportPage() {
  useEffect(() => {
    injectDriveEvidenceHistory();
  }, []);

  return <EquipmentPassportPage slug="sp-ardhi-26" />;
}
