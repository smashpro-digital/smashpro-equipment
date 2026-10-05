import { useEffect } from "react";
import { EquipmentPassportPage } from "./EquipmentDetailPage";
import "../styles/ardhi-passport-compact-overrides.css";
import "../styles/ardhi-manufacturer-pdf-compact.css";

import { DRIVE_EVIDENCE_HISTORY } from "../data/ardhiEvidenceHistory";

const PASSPORT_FIELDS_TO_HIDE = new Set([
  "Passport Number",
  "Fleet Class",
  "Hydraulics",
  "Operating Weight",
  "Fuel",
  "Engine",
  "Commissioning",
  "Current Owner",
]);

const PASSPORT_FIELD_ICONS: Record<string, string> = {
  "Factory Model": "▱",
  Status: "✓",
  "Service Hours": "◷",
};


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
    const passportRows = Array.from(document.querySelectorAll<HTMLElement>(".ardhi-passport-ledger > dl > div"));
    passportRows.forEach((row) => {
      const label = row.querySelector("dt")?.textContent?.trim();
      if (label && PASSPORT_FIELDS_TO_HIDE.has(label)) {
        row.hidden = true;
        return;
      }
      if (label && PASSPORT_FIELD_ICONS[label]) {
        row.classList.add("passport-summary-item");
        row.dataset.icon = PASSPORT_FIELD_ICONS[label];
      }
    });
    document.querySelector<HTMLElement>(".ardhi-passport-ledger > dl")?.classList.add("passport-summary-row");

    document.querySelector<HTMLElement>(".ardhi-passport-ledger .document-card")?.classList.add("is-compact-manufacturer-card");
    injectDriveEvidenceHistory();

    const statsSection = document.querySelector<HTMLElement>(".ardhi-journey-stats");
    if (!statsSection) return;

    const description = statsSection.querySelector<HTMLElement>(".section-heading > p");
    if (description) description.textContent = "Journey-only metrics. Distance is approximate and does not represent live GPS tracking.";

    const cards = Array.from(statsSection.querySelectorAll<HTMLElement>(".ardhi-counter-grid > article"));
    if (cards[2]) cards[2].innerHTML = `<span>Forwarder arrival target</span><strong>Oct 5</strong><small>Estimate · live shipment truth comes from Digital HQ</small>`;

    const distanceLabel = cards[0]?.querySelector("span");
    if (distanceLabel) distanceLabel.textContent = "Approximate journey distance";
    const ageLabel = cards[3]?.querySelector("span");
    if (ageLabel) ageLabel.textContent = "Days since production complete";
  }, []);

  return <EquipmentPassportPage slug="sp-ardhi-26" />;
}
