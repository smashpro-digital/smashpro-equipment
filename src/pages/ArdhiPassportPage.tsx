import { useEffect } from "react";
import { buildTransitMetrics } from "../domain/equipmentJobLifecycle";
import { EquipmentPassportPage } from "./EquipmentDetailPage";
import "../styles/ardhi-passport-compact-overrides.css";
import "../styles/ardhi-manufacturer-pdf-compact.css";

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

    const statsSection = document.querySelector<HTMLElement>(".ardhi-journey-stats");
    if (!statsSection) return;

    statsSection.classList.add("lifecycle-metrics-section");
    const description = statsSection.querySelector<HTMLElement>(".section-heading > p");
    if (description) description.textContent = "Lifecycle metrics follow the machine from transit into active jobs.";

    const metrics = buildTransitMetrics({
      approximateDistanceMiles: 7300,
      journeyStage: 2,
      journeyStageCount: 7,
      journeyStageLabel: "Ocean export",
      arrivalDate: "2026-10-05T00:00:00Z",
      productionCompleteDate: "2026-08-18T00:00:00Z",
    });
    const cards = Array.from(statsSection.querySelectorAll<HTMLElement>(".ardhi-counter-grid > article"));

    metrics.forEach((metric, index) => {
      const card = cards[index];
      if (!card) return;
      card.dataset.metricId = metric.id;
      card.innerHTML = `<span>${metric.label}</span><strong>${metric.value}</strong>${metric.detail ? `<small>${metric.detail}</small>` : ""}`;
    });
  }, []);

  return <EquipmentPassportPage slug="sp-ardhi-26" />;
}
