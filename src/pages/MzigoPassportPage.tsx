import { useEffect } from "react";
import { EquipmentPassportPage } from "./EquipmentDetailPage";
import "../styles/ardhi-passport-compact-overrides.css";
import "../styles/ardhi-manufacturer-pdf-compact.css";
import "../styles/mzigo-passport-overrides.css";

const SUMMARY_ICONS: Record<string, string> = {
  "Factory Model": "▱",
  Status: "✓",
  "Service Hours": "◷",
};

function alignIdentitySummary() {
  const identity = document.querySelector<HTMLElement>(".passport-identity");
  if (!identity || identity.dataset.mzigoSummary === "true") return;

  identity.innerHTML = "";
  [
    ["Factory Model", "K600"],
    ["Status", "Factory build complete"],
    ["Service Hours", "0 · pre-commissioning"],
  ].forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "passport-summary-item";
    item.dataset.icon = SUMMARY_ICONS[label];
    const title = document.createElement("span");
    const detail = document.createElement("strong");
    title.textContent = label;
    detail.textContent = value;
    item.append(title, detail);
    identity.appendChild(item);
  });
  identity.classList.add("passport-summary-row", "mzigo-passport-summary");
  identity.dataset.mzigoSummary = "true";
}

function applyLatestFactoryUpdate() {
  const updates = Array.from(document.querySelectorAll<HTMLElement>(".factory-update"));
  if (!updates.length) return;

  // EquipmentDetailPage currently renders this block twice. Keep the canonical first block only.
  updates.slice(1).forEach((duplicate) => duplicate.remove());
  const update = updates[0];
  update.classList.add("mzigo-factory-update");

  const eyebrow = update.querySelector<HTMLElement>(".factory-update__intro .eyebrow");
  if (eyebrow) eyebrow.textContent = "Latest Factory Update · Sep 9, 2026";
  const heading = update.querySelector<HTMLElement>("#factory-update-heading");
  if (heading) heading.textContent = "Completed factory build verified";

  const copy = update.querySelector<HTMLElement>(".factory-update__intro > div:last-child");
  if (copy) {
    copy.innerHTML = "";
    [
      "The latest Kylin factory evidence shows SP-MZIGO-26E fully assembled in SmashPro Custom Green with SP-MZIGO-26E identity graphics applied.",
      "The hydraulic dump bed is documented in the raised position, the electric drivetrain and control hardware are visible, and the front work lights are powered. The build has moved from chassis assembly into pre-shipment verification.",
      "The September 9 photo and video batch is preserved in the canonical Google Drive evidence folder. Full factory testing and final shipment remain separate milestones until documentary confirmation is received.",
    ].forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      copy.appendChild(paragraph);
    });
  }

  const timeline = update.querySelector<HTMLOListElement>(".factory-update__timeline ol");
  if (timeline) {
    const steps: Array<[string, "completed" | "current" | "upcoming"]> = [
      ["Deposit Paid", "completed"],
      ["Production Started", "completed"],
      ["Chassis Assembly", "completed"],
      ["Body Assembly", "completed"],
      ["SmashPro Green Finish", "completed"],
      ["Custom Branding", "completed"],
      ["Hydraulic Bed Verification", "completed"],
      ["Lighting Verification", "completed"],
      ["Pre-Shipment Verification", "current"],
      ["Final Inspection", "upcoming"],
      ["Ocean Freight", "upcoming"],
      ["U.S. Delivery", "upcoming"],
    ];
    timeline.innerHTML = "";
    steps.forEach(([label, status]) => {
      const row = document.createElement("li");
      row.className = `is-${status}`;
      const icon = document.createElement("span");
      const title = document.createElement("strong");
      const state = document.createElement("small");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = status === "completed" ? "✓" : status === "current" ? "●" : "□";
      title.textContent = label;
      state.textContent = status;
      row.append(icon, title, state);
      timeline.appendChild(row);
    });
  }

  const gallery = update.querySelector<HTMLElement>(".factory-update__gallery");
  if (gallery) {
    const note = document.createElement("aside");
    note.className = "mzigo-drive-evidence-note";
    note.innerHTML = "<strong>September 9 evidence batch</strong><span>35 uploads archived in Google Drive · completed machine, branding, raised dump bed, controls and powered lighting documented</span>";
    gallery.insertAdjacentElement("beforebegin", note);
  }
}

function applyCurrentStatus() {
  const status = document.querySelector<HTMLElement>(".status-panel strong");
  if (status) status.textContent = "Factory build complete · pre-shipment verification";
}

export function MzigoPassportPage() {
  useEffect(() => {
    alignIdentitySummary();
    applyLatestFactoryUpdate();
    applyCurrentStatus();
  }, []);

  return <EquipmentPassportPage slug="sp-mzigo-26" />;
}
