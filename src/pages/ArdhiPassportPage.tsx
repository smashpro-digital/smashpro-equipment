import { useEffect } from "react";
import { EquipmentPassportPage } from "./EquipmentDetailPage";
import "../styles/ardhi-passport-compact-overrides.css";

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

export function ArdhiPassportPage() {
  useEffect(() => {
    const passportRows = Array.from(document.querySelectorAll<HTMLElement>(".ardhi-passport-ledger > dl > div"));
    passportRows.forEach((row) => {
      const label = row.querySelector("dt")?.textContent?.trim();
      if (label && PASSPORT_FIELDS_TO_HIDE.has(label)) row.hidden = true;
    });

    document.querySelector<HTMLElement>(".ardhi-passport-ledger .document-card")?.classList.add("is-compact-manufacturer-card");

    const statsSection = document.querySelector<HTMLElement>(".ardhi-journey-stats");
    if (!statsSection) return;

    const description = statsSection.querySelector<HTMLElement>(".section-heading > p");
    if (description) description.textContent = "Journey-only metrics. Distance is approximate and does not represent live GPS tracking.";

    const cards = Array.from(statsSection.querySelectorAll<HTMLElement>(".ardhi-counter-grid > article"));
    const arrival = new Date("2026-10-05T00:00:00Z");
    const daysRemaining = Math.max(0, Math.ceil((arrival.getTime() - Date.now()) / 86_400_000));

    if (cards[1]) cards[1].innerHTML = `<span>Journey stage</span><strong>2 / 7</strong><small>Ocean export</small>`;
    if (cards[2]) cards[2].innerHTML = `<span>Estimated days remaining</span><strong>${daysRemaining}</strong><small>To Oct 5 arrival estimate</small>`;

    const distanceLabel = cards[0]?.querySelector("span");
    if (distanceLabel) distanceLabel.textContent = "Approximate journey distance";
    const ageLabel = cards[3]?.querySelector("span");
    if (ageLabel) ageLabel.textContent = "Days since production complete";
  }, []);

  return <EquipmentPassportPage slug="sp-ardhi-26" />;
}
