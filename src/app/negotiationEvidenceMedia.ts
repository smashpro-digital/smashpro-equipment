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

function attachNegotiationMedia() {
  negotiationMedia.forEach((media) => {
    const record = document.getElementById(media.recordId);
    const detail = record?.querySelector<HTMLElement>(".history-detail");
    if (!detail || detail.querySelector(`[data-negotiation-media="${media.recordId}"]`)) return;

    const figure = document.createElement("figure");
    figure.className = "negotiation-evidence-media";
    figure.dataset.negotiationMedia = media.recordId;

    const image = document.createElement("img");
    image.src = media.src;
    image.alt = media.alt;
    image.loading = "lazy";
    image.decoding = "async";

    const figcaption = document.createElement("figcaption");
    const label = document.createElement("strong");
    const caption = document.createElement("span");
    label.textContent = media.label;
    caption.textContent = media.caption;
    figcaption.append(label, caption);
    figure.append(image, figcaption);

    const evidenceArchive = Array.from(detail.querySelectorAll("aside")).find((node) =>
      node.querySelector("b")?.textContent?.includes("Evidence archive"),
    );
    detail.insertBefore(figure, evidenceArchive ?? null);
  });
}

export function installNegotiationEvidenceMedia() {
  attachNegotiationMedia();
  const observer = new MutationObserver(() => attachNegotiationMedia());
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
}
