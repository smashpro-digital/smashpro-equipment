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

const BUILD_CHAPTERS = [
  ["01", "Factory Identity", "The K600 platform reaches its SmashPro identity stage: custom green bodywork, SP-MZIGO-26E fleet graphics, QR treatment and branded control surfaces turn the factory platform into a recognizable fleet asset.", "Completed machine profile + fleet identity"],
  ["02", "SmashPro Branding", "Branding is integrated across the dump body, rear structure and control face rather than treated as a single decal. The finished machine now reads visually as SP-MZIGO-26E from multiple working angles.", "Side identity, rear branding + control panel"],
  ["03", "Electric Drive Architecture", "With the dump body raised, the chassis exposes centrally packaged battery enclosures, electric drive hardware, controller modules and high-current cabling distributed around the frame. The layout keeps major electrical mass low and between the axles.", "Battery, motor + controller detail"],
  ["04", "Hydraulic Dump System", "A large central hydraulic lift cylinder forms the spine of the dumping system. The raised-bed evidence also documents the reservoir, pump, valve hardware, wiring and chassis support structure that make the material carrier a functional dump platform rather than a simple powered cart.", "Raised bed, lift cylinder + hydraulic hardware"],
  ["05", "Factory-Complete Machine", "The final exterior views bring the system together: compact four-wheel stance, aggressive jobsite tires, powered work lights, remote-operated electric propulsion, hydraulic dumping and the finished SmashPro body package. The machine has moved from assembly into pre-shipment verification.", "Factory-complete walkaround + working systems"],
] as const;

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

function addBuildStory() {
  if (document.querySelector(".mzigo-build-story")) return;
  const update = document.querySelector<HTMLElement>(".factory-update");
  if (!update) return;

  const section = document.createElement("section");
  section.className = "section shell mzigo-build-story";
  section.setAttribute("aria-labelledby", "mzigo-build-story-title");
  section.innerHTML = `
    <header class="mzigo-build-story__intro">
      <p class="eyebrow">Build Story · September 9, 2026</p>
      <h2 id="mzigo-build-story-title">From factory platform to SmashPro fleet machine.</h2>
      <p class="large-copy">SP-MZIGO-26E emerged from final assembly as SmashPro's first custom electric material carrier, combining remote-controlled 4WD propulsion, a hydraulic dump body, integrated work lighting, custom fleet branding, and a purpose-built electrical and hydraulic architecture into one compact hauling platform.</p>
    </header>
    <div class="mzigo-build-story__chapters">
      ${BUILD_CHAPTERS.map(([number, title, copy, media]) => `
        <article class="mzigo-build-chapter">
          <div class="mzigo-build-chapter__copy"><span>${number}</span><h3>${title}</h3><p>${copy}</p></div>
          <div class="mzigo-media-placeholder" role="img" aria-label="Image placeholder for ${media}">
            <span>Factory evidence reserved</span><strong>${media}</strong><small>September 9 media will populate this frame after server promotion.</small>
          </div>
        </article>`).join("")}
    </div>`;
  update.insertAdjacentElement("afterend", section);
}

function applyLatestFactoryUpdate() {
  const updates = Array.from(document.querySelectorAll<HTMLElement>(".factory-update"));
  if (!updates.length) return;
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
      ["Deposit Paid", "completed"], ["Production Started", "completed"], ["Chassis Assembly", "completed"], ["Body Assembly", "completed"], ["SmashPro Green Finish", "completed"], ["Custom Branding", "completed"], ["Hydraulic Bed Verification", "completed"], ["Lighting Verification", "completed"], ["Pre-Shipment Verification", "current"], ["Final Inspection", "upcoming"], ["Ocean Freight", "upcoming"], ["U.S. Delivery", "upcoming"],
    ];
    timeline.innerHTML = "";
    steps.forEach(([label, status]) => {
      const row = document.createElement("li");
      row.className = `is-${status}`;
      const icon = document.createElement("span"); const title = document.createElement("strong"); const state = document.createElement("small");
      icon.setAttribute("aria-hidden", "true"); icon.textContent = status === "completed" ? "✓" : status === "current" ? "●" : "□"; title.textContent = label; state.textContent = status;
      row.append(icon, title, state); timeline.appendChild(row);
    });
  }

  const gallery = update.querySelector<HTMLElement>(".factory-update__gallery");
  if (gallery && !update.querySelector(".mzigo-drive-evidence-note")) {
    const note = document.createElement("aside");
    note.className = "mzigo-drive-evidence-note";
    note.innerHTML = "<strong>September 9 evidence batch</strong><span>Factory-complete machine, branding, raised dump bed, controls, electric drive architecture, hydraulic hardware and powered lighting documented. Production image frames below are reserved for this verified media.</span>";
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
    addBuildStory();
    applyCurrentStatus();
  }, []);
  return <EquipmentPassportPage slug="sp-mzigo-26" />;
}
