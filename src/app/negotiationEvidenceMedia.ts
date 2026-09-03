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
    src: "/equipment/images/competitor-yf380-machine.jpg",
    alt: "Competing orange YF380 mini skid steer presented during the July 15 supplier comparison",
    label: "Competitor comparison media",
    caption: "YF380 alternative reviewed while establishing delivered DDP cost and configuration requirements.",
  },
  {
    recordId: "drive-vendor-t460-quote",
    src: "/equipment/images/competitor-t460-ddp-quote.jpg",
    alt: "Archived Alibaba conversation documenting the competing T460 4,799 dollar DDP offer",
    label: "Competitor quote evidence",
    caption: "T460 alternative used to compare the complete door-to-door cost structure, not merely factory price.",
  },
  {
    recordId: "drive-ddp-benchmark-negotiation",
    src: "/equipment/images/sp-ardhi-26-completed-build-attachments.jpg",
    alt: "Infront YF380 platform shown with attachments during the selected supplier evaluation",
    label: "Selected-supplier machine evidence",
    caption: "Infront machine imagery supports the selected-supplier side of the delivered-value and configuration comparison.",
  },
  {
    recordId: "drive-configuration-branding-confirmed",
    src: "/equipment/images/sp-ardhi-26-control-panel.jpg",
    alt: "SmashPro-branded Infront YF380 control panel documented during the build",
    label: "Selected-supplier build evidence",
    caption: "Factory evidence supports the transition from configuration and branding approval into the physical branded build.",
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

function reconcileFactoryEvidence() {
  document.querySelectorAll<HTMLElement>(".drive-evidence-record .history-detail").forEach((detail) => {
    const evidenceArchive = findEvidenceArchive(detail);
    if (!evidenceArchive) return;

    const sourceMedia = detail.querySelector<HTMLElement>(".history-media");
    const sourceImages = sourceMedia ? Array.from(sourceMedia.querySelectorAll<HTMLImageElement>("img")) : [];

    if (sourceImages.length) {
      evidenceArchive.querySelector("p")?.remove();
      sourceImages.forEach((sourceImage, index) => {
        const marker = `factory-${index}-${sourceImage.src}`;
        if (evidenceArchive.querySelector(`[data-evidence-source="${CSS.escape(marker)}"]`)) return;
        const thumb = buildThumbnail(
          sourceImage.src,
          sourceImage.alt || "Archived factory evidence",
          sourceImages.length > 1 ? `Factory evidence ${index + 1}` : "Factory / conversation evidence",
        );
        thumb.dataset.evidenceSource = marker;
        evidenceArchive.appendChild(thumb);
      });
      sourceMedia?.remove();
      return;
    }

    const rawEvidence = evidenceArchive.querySelector<HTMLParagraphElement>("p");
    if (rawEvidence && /\.(?:jpe?g|png|webp|pnm)\b/i.test(rawEvidence.textContent ?? "")) {
      rawEvidence.textContent = "Archived conversation evidence";
    }
  });
}

function updateEvidencePresentation() {
  attachNegotiationMedia();
  reconcileFactoryEvidence();
}

export function installNegotiationEvidenceMedia() {
  updateEvidencePresentation();
  const observer = new MutationObserver(() => updateEvidencePresentation());
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
}
