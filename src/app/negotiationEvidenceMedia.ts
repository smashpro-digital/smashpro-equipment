type NegotiationMedia = {
  recordId: string;
  src: string;
  alt: string;
  label: string;
  caption: string;
};

const negotiationMedia: NegotiationMedia[] = [
  {
    recordId: "drive-yf380-candidate-review",
    src: "/equipment/images/competitor-yf380-machine.svg",
    alt: "Competing orange YF380 mini skid steer presented during the July 15 supplier comparison",
    label: "Competitor comparison media",
    caption: "YF380 alternative reviewed while establishing delivered DDP cost and configuration requirements.",
  },
  {
    recordId: "drive-vendor-t460-quote",
    src: "/equipment/images/competitor-t460-ddp-quote.svg",
    alt: "Archived Alibaba conversation documenting the competing T460 4,799 dollar DDP offer",
    label: "Competitor quote evidence",
    caption: "T460 alternative used to compare the complete door-to-door cost structure, not merely factory price.",
  },
  {
    recordId: "drive-ddp-benchmark-negotiation",
    src: "/equipment/images/infront-negotiation-front.svg",
    alt: "Infront mini skid steer reference machine with attachment lineup supplied during procurement evaluation",
    label: "Selected-supplier reference media",
    caption: "Infront platform imagery used alongside the $3,990 DDP benchmark while comparing machine utility, attachments, and delivered value.",
  },
  {
    recordId: "drive-configuration-branding-confirmed",
    src: "/equipment/images/infront-negotiation-front.svg",
    alt: "Infront mini skid steer reference platform shown during configuration and branding discussions",
    label: "Selected-supplier reference media",
    caption: "Reference platform supporting the transition from price negotiation into final configuration and branding controls. This is not presented as final-build proof.",
  },
];

function findEvidenceArchive(detail: HTMLElement) {
  return Array.from(detail.querySelectorAll<HTMLElement>("aside")).find((node) =>
    node.querySelector("b")?.textContent?.includes("Evidence archive"),
  );
}

function buildThumbnail(src: string, alt: string, label: string) {
  const thumb = document.createElement("figure");
  thumb.className = "evidence-archive-thumbnail";

  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  image.decoding = "async";

  const caption = document.createElement("figcaption");
  caption.textContent = label;
  thumb.append(image, caption);
  return thumb;
}

function attachNegotiationMedia() {
  negotiationMedia.forEach((media) => {
    const record = document.getElementById(media.recordId);
    const detail = record?.querySelector<HTMLElement>(".history-detail");
    if (!detail) return;

    const evidenceArchive = findEvidenceArchive(detail);
    if (!evidenceArchive) return;

    evidenceArchive.querySelector("p")?.remove();
    if (!evidenceArchive.querySelector(`[data-evidence-thumb="${media.recordId}"]`)) {
      const thumb = buildThumbnail(media.src, media.alt, media.label);
      thumb.dataset.evidenceThumb = media.recordId;
      evidenceArchive.appendChild(thumb);
    }
  });
}

function replaceFactoryEvidenceFilenames() {
  document.querySelectorAll<HTMLElement>(".drive-evidence-record .history-detail").forEach((detail) => {
    const evidenceArchive = findEvidenceArchive(detail);
    if (!evidenceArchive || evidenceArchive.querySelector(".evidence-archive-thumbnail")) return;

    const sourceImage = detail.querySelector<HTMLImageElement>(".history-media img");
    if (!sourceImage) return;

    evidenceArchive.querySelector("p")?.remove();
    const title = detail.closest("li")?.querySelector("summary strong")?.textContent ?? "Archived evidence";
    evidenceArchive.appendChild(buildThumbnail(sourceImage.src, sourceImage.alt || title, "Factory / conversation evidence"));
  });
}

function updateEvidencePresentation() {
  attachNegotiationMedia();
  replaceFactoryEvidenceFilenames();
}

export function installNegotiationEvidenceMedia() {
  updateEvidencePresentation();
  const observer = new MutationObserver(() => updateEvidencePresentation());
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
}
