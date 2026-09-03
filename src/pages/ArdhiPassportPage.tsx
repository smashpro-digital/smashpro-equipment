import { useEffect } from "react";
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

type EvidenceHistoryEntry = {
  id: string;
  date: string;
  title: string;
  narrative: string;
  evidence: string;
  decision?: string;
  supplier?: string;
};

const DRIVE_EVIDENCE_HISTORY: EvidenceHistoryEntry[] = [
  {
    id: "drive-vendor-t460-quote",
    date: "Jul 15, 2026 · 5:31 PM",
    title: "Alternative T460 DDP Quote Compared",
    narrative:
      "A competing supplier quoted a T460 mini loader at $4,799 DDP, including shipping, packaging, import duties, VAT, customs clearance, and truck delivery, with unloading left to the buyer.",
    evidence: "Archived Alibaba conversation screenshot · Screenshot_20260715_061727_Alibabacom.jpg",
    supplier: "Competing Alibaba supplier · T460 offer",
    decision:
      "Use delivered-cost structure, machine capability, supplier confidence, and included support as comparison points rather than selecting on listing price alone.",
  },
  {
    id: "drive-yf380-candidate-review",
    date: "Jul 15, 2026 · 5:36–5:48 PM",
    title: "YF380 Candidate Reviewed During Supplier Search",
    narrative:
      "Another supplier presented its YF380 configuration with machine photos. SmashPro asked specifically for the total delivered cost to South Carolina and clarified whether the offer was DDP.",
    evidence: "Archived Alibaba conversation screenshot · Screenshot_20260715_061100_Alibabacom.jpg",
    supplier: "Competing Alibaba supplier · YF380 candidate",
    decision:
      "Normalize supplier comparisons around delivered South Carolina cost and comparable machine configuration before choosing a manufacturer.",
  },
  {
    id: "drive-low-price-offer-review",
    date: "Jul 15, 2026 · 5:57 PM",
    title: "Low-Price Machine Offer and Support Package Evaluated",
    narrative:
      "A competing seller emphasized a low machine price while offering a free attachment plus a toolbox, common tools, and filter elements. The exchange became part of the early supplier-value comparison record.",
    evidence: "Archived Alibaba conversation screenshot · Screenshot_20260715_055806_Alibabacom.jpg",
    supplier: "Competing Alibaba supplier · low-price package",
    decision:
      "Treat free accessories and spares as secondary to machine configuration, transport certainty, supplier credibility, and long-term support.",
  },
  {
    id: "drive-factory-branding-evidence",
    date: "Aug 11, 2026 · archive timestamp",
    title: "Branded Factory Machine Evidence Archived",
    narrative:
      "Factory imagery in the machine archive documents the bright-green and black build with SmashPro phone and web branding applied at the control-console end of the machine, along with the installed hydraulic routing and operator controls.",
    evidence: "Factory image archive · 4240822497785.PNM.jpg",
    decision:
      "Preserve factory imagery as build evidence so branding, configuration, and condition can be traced against the finished fleet asset.",
  },
  {
    id: "drive-yf380-spec-archived",
    date: "Aug 16–17, 2026",
    title: "YF380 Manufacturer Specification Record Archived",
    narrative:
      "The YF380 manufacturer specification PDF was saved into the machine evidence folder, creating a dated reference point for factory specifications alongside the procurement and build record.",
    evidence: "380(2026-08-16 20_13_52).pdf · Drive archive created Aug 17, 2026",
    decision:
      "Keep manufacturer specifications beside conversation and factory-photo evidence so future service decisions can distinguish factory claims from observed machine history.",
  },
];

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
    meta.textContent = "documented · archived evidence";
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
      const text = document.createElement("span");
      text.textContent = entry.decision;
      decision.append(label, text);
      detail.appendChild(decision);
    }

    if (entry.supplier) {
      const supplier = document.createElement("aside");
      const label = document.createElement("b");
      label.textContent = "Supplier comparison";
      const text = document.createElement("span");
      text.textContent = entry.supplier;
      supplier.append(label, text);
      detail.appendChild(supplier);
    }

    const evidence = document.createElement("aside");
    const evidenceLabel = document.createElement("b");
    evidenceLabel.textContent = "Evidence archive";
    const evidenceText = document.createElement("span");
    evidenceText.textContent = entry.evidence;
    evidence.append(evidenceLabel, evidenceText);
    detail.appendChild(evidence);

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
