import { useEffect } from "react";
import { EquipmentPassportPage } from "./EquipmentDetailPage";
import "../styles/ardhi-passport-compact-overrides.css";
import "../styles/ardhi-manufacturer-pdf-compact.css";

const image = (name: string) => `/equipment/images/${name}`;

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
  photos?: string[];
};

// Evidence below is sourced only from the Drive folder named "Chat hiatory".
// Private addresses, contact details, and tax/address discussions are intentionally excluded
// from the public Passport projection even when they appear in the archived conversations.
const DRIVE_EVIDENCE_HISTORY: EvidenceHistoryEntry[] = [
  {
    id: "drive-low-price-offer-review",
    date: "Jul 15, 2026 · 5:58–5:59 AM",
    title: "Early Supplier Value Package Compared",
    narrative:
      "A competing supplier emphasized a low machine price and offered a free attachment, toolbox, common tools, and filter elements. The exchange became part of the initial comparison between purchase price and practical operating support.",
    evidence:
      "Chat history · Screenshot_20260715_055806_Alibabacom.jpg · Screenshot_20260715_055923_Alibabacom.jpg",
    supplier: "Competing Alibaba supplier",
    decision:
      "Treat accessories and spares as part of total value, but not as substitutes for transport certainty, machine configuration, and supplier support.",
  },
  {
    id: "drive-yf380-candidate-review",
    date: "Jul 15, 2026 · 6:11 AM",
    title: "Competing YF380 Candidate Reviewed",
    narrative:
      "Another supplier presented a YF380 candidate with machine imagery. SmashPro immediately asked for the total delivered cost to South Carolina and whether the quotation was DDP.",
    evidence: "Chat history · Screenshot_20260715_061100_Alibabacom.jpg",
    supplier: "Competing Alibaba supplier · YF380 candidate",
    decision:
      "Normalize supplier comparisons around true delivered South Carolina cost rather than factory or listing price.",
  },
  {
    id: "drive-vendor-t460-quote",
    date: "Jul 15, 2026 · 6:17 AM",
    title: "$4,799 T460 Door-to-Door Alternative Documented",
    narrative:
      "A competing supplier quoted a T460 at $4,799 DDP and described the price as including the machine, shipping, packaging, import duties, VAT, customs clearance, and truck delivery to the destination, with unloading left to the buyer.",
    evidence: "Chat history · Screenshot_20260715_061727_Alibabacom.jpg",
    supplier: "Competing Alibaba supplier · T460 offer",
    decision:
      "Use full delivered-cost structure as a comparison point, not headline machine price alone.",
  },
  {
    id: "drive-ddp-benchmark-negotiation",
    date: "Jul 15, 2026 · 6:20–7:10 AM",
    title: "$3,990 DDP Became the Negotiating Benchmark",
    narrative:
      "SmashPro told competing suppliers that the strongest door-to-door DDP quotation received was $3,990 including shipping, customs, taxes, and delivery. Suppliers were invited to match that delivered price or add value through attachments, spare parts, or upgraded hydraulics.",
    evidence:
      "Chat history · Screenshot_20260715_062045_Alibabacom.jpg · Screenshot_20260715_071029_Alibabacom.jpg",
    supplier: "Multiple competing Alibaba suppliers",
    decision:
      "Compare complete operating packages at a common delivered-cost baseline, with hydraulics, attachments, spares, and long-term support as explicit decision variables.",
  },
  {
    id: "drive-supplier-experience-review",
    date: "Jul 15, 2026 · 7:13 AM",
    title: "Supplier Experience and Quality Claims Weighed",
    narrative:
      "One competing factory responded to the pricing challenge by emphasizing 12 years of export experience, machine quality, and service rather than attempting to win only on price.",
    evidence: "Chat history · Screenshot_20260715_071351_Alibabacom.jpg",
    supplier: "Competing Alibaba supplier",
    decision:
      "Include supplier maturity, export experience, and after-sales confidence alongside price in the selection process.",
  },
  {
    id: "drive-competing-final-package",
    date: "Jul 15, 2026 · 7:35 AM",
    title: "Competing $3,990 Package Added Spares and Fork Option",
    narrative:
      "A competing supplier returned at the $3,990 benchmark with extra filter elements and a belt and offered to substitute a fork for another attachment. The exchange clarified the tradeoffs between matched delivered price and included equipment.",
    evidence: "Chat history · Screenshot_20260715_073532_Alibabacom.jpg",
    supplier: "Competing Alibaba supplier",
    decision:
      "Continue evaluating total machine utility after a supplier matched the target price rather than selecting on price match alone.",
  },
  {
    id: "drive-technical-support-comparison",
    date: "Jul 15, 2026 · 9:39 AM",
    title: "Hydraulics and After-Sales Support Compared",
    narrative:
      "A competing machine was described as 23 hp with a 380 kg rated load and a standard dual-pump, dual-valve hydraulic system. The supplier also described one year of maintenance support, 24-hour online technical guidance, and accessory-shipping support.",
    evidence:
      "Chat history · Screenshot_20260715_093941_Alibabacom.jpg · Screenshot_20260715_093949_Alibabacom.jpg",
    supplier: "Competing Alibaba supplier",
    decision:
      "Use hydraulic architecture and after-sales capability as technical selection criteria, helping explain the later preference for a stronger hydraulic configuration.",
  },
  {
    id: "drive-configuration-branding-confirmed",
    date: "Jul 15, 2026 · 10:28–10:29 AM",
    title: "Configuration and Branding Approval Workflow Confirmed",
    narrative:
      "The selected supplier confirmed agreement on the discussed machine information and committed to provide detailed invoice information. For SmashPro branding, the factory agreed to prepare the sticker design, send it for approval, and print and apply it only after final confirmation.",
    evidence:
      "Chat history · Screenshot_20260715_102857_Alibabacom.jpg · Screenshot_20260715_102900_Alibabacom.jpg",
    supplier: "Selected supplier conversation",
    decision:
      "Require written configuration detail and a formal approval checkpoint before factory branding is printed and applied.",
  },
  {
    id: "drive-four-payment-structure",
    date: "Jul 15, 2026 · 10:39 AM",
    title: "Four Payments Mapped to Two Alibaba Orders",
    narrative:
      "The selected supplier explained that the requested four-payment plan would be implemented through two linked Alibaba orders because each order supported two installments. The supplier stated that the two order groups would ultimately be combined and shipped together as one machine acquisition.",
    evidence: "Chat history · Screenshot_20260715_103946_Alibabacom.jpg",
    supplier: "Selected supplier conversation",
    decision:
      "Use two linked marketplace orders to support four staged payments while keeping one combined machine shipment and marketplace order protection.",
  },
  {
    id: "drive-contract-drafted",
    date: "Jul 15, 2026 · 9:43 PM",
    title: "Draft Purchase Contract Prepared for Review",
    narrative:
      "Later that day, the selected supplier sent the drafted contract/order materials for review. The archive documents that commercial terms were being formalized before the production phase advanced.",
    evidence:
      "Chat history · Screenshot_20260715_214332_Alibabacom.jpg · Screenshot_20260715_214343_Alibabacom.jpg",
    supplier: "Selected supplier conversation",
    decision:
      "Review marketplace order documents before proceeding; private address and platform tax details remain outside the public Passport record.",
  },
  {
    id: "drive-production-authorized",
    date: "Jul 16, 2026 · morning",
    title: "Production Authorized with Evidence Expectations",
    narrative:
      "After the order documents were drafted, SmashPro asked the factory to begin production and requested progress updates, photos, and videos as the machine was built, with the SmashPro branding reviewed before application. The supplier agreed to report progress and follow the agreement.",
    evidence: "Chat history · July 16 production-start conversation and Gallery timestamp record",
    supplier: "Selected supplier conversation",
    decision:
      "Make production evidence part of the acquisition process instead of waiting until shipment to verify the machine.",
  },
  {
    id: "drive-powder-coat-assembly",
    date: "Jul 28, 2026 · 7:34 AM",
    title: "Powder Coating and Assembly Sequence Documented",
    narrative:
      "The factory reported that powder coating was being handled urgently and expected the structural parts to be ready for assembly within roughly one to two days. It described assembly, commissioning, and testing as the next stages once coated structural parts were complete.",
    evidence: "Chat history · July 28 factory-progress conversation and Gallery timestamp record",
    supplier: "Selected supplier conversation",
    decision:
      "Track production by physical manufacturing stage so later factory photos can be tied to an explainable build sequence.",
    photos: [image("sp-ardhi-26-assembly-in-progress.jpg"), image("sp-ardhi-26-factory-assembly-floor.jpg")],
  },
  {
    id: "drive-attachment-expansion-priced",
    date: "Jul 28, 2026 · 7:34 AM",
    title: "Future Hydraulic Attachment Expansion Priced",
    narrative:
      "During the build, the supplier provided a preliminary attachment price list that included a grapple bucket, auger with multiple bits, trencher, landscape rake, brush cutter, and stump grinder, while noting that DDP shipping for heavy accessories depended on weight.",
    evidence: "Chat history · July 28 attachment-pricing conversation and Gallery timestamp record",
    supplier: "Selected supplier conversation",
    decision:
      "Keep the first-machine package focused while documenting a future powered-attachment roadmap for expansion after commissioning.",
    photos: [image("sp-ardhi-26-hydraulic-system-installation.jpg")],
  },
  {
    id: "drive-factory-operation-proof",
    date: "Aug 3, 2026 · 10:36 PM capture",
    title: "Green Build Shown Operating on Factory Floor",
    narrative:
      "The chat archive contains factory-floor media showing a bright-green compact loader being operated among other machines during the build period. The image provides a dated visual checkpoint between assembly planning and later completed-machine evidence.",
    evidence: "Chat history · Screenshot_20260803_223648_Alibabacom.jpg",
    decision:
      "Retain in-process operating media as production evidence rather than relying only on finished-machine photographs.",
    photos: [image("sp-ardhi-26-factory-assembly-floor.jpg")],
  },
  {
    id: "drive-branded-machine-chat-evidence",
    date: "Build-period chat archive",
    title: "SmashPro-Branded Machine Evidence Preserved in Conversation Archive",
    narrative:
      "The Chat history folder also preserves multiple images of the green-and-black YF380 with SmashPro branding applied, including factory and outdoor views. These images support the progression from approved artwork to a physically branded machine.",
    evidence:
      "Chat history · Alibabaac0a62b90a607c0c281399e09b737f3d_original.png · Alibaba50007cc3b4166a5ad8ece411fbbc3ad0_original.png · 4242703936515.PNM image series",
    decision:
      "Use original conversation media as supporting build evidence while keeping marketing composites separate from manufacturing proof.",
    photos: [
      image("sp-ardhi-26-control-panel.jpg"),
      image("sp-ardhi-26-bucket-branding.png"),
      image("sp-ardhi-26-completed-build-attachments.jpg"),
    ],
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