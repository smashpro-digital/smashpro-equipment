type NegotiationMedia = {
  recordId: string;
  src: string;
  alt: string;
  label: string;
  caption: string;
};

const competitorYf380Thumb = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAB4ADcDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAAECBAUDBgf/xAA4EAABAwIEAQgJAgcAAAAAAAABAAIRAxIEBSExYRMVIiNBUWKBFDJSU1RxkpOhBjNCQ0SRotHw/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABwRAQEBAAMBAQEAAAAAAAAAAAABEQISIRNBUf/aAAwDAQACEQMRAD8A9Vabibzr2KPL0fes3j1gnLb7oMxCzsRj8DQpuqVgWtG5sCDTDg4S0gjgmsZuf4LUU+Vjg0aqA/VOBDg0sr6mJtH+0G2XNDg0uEnslJ4uIAfa4a6KlTxWGxNVtZl8jTaArVrBVNWDcRCBU6b213OdXc8ewQNEKQDRUdUF0uEFCBLIr5fUraOpBwBkaha52XnKWdUn1203i0OMXXbFXz9SlUyGtUqhzha0djYk+a70MkbQMsoCe9xk/lXHuaxhc50NGskrOOZudUtawW/Myry8mk9adLD1mkdGBKvrD691dsVC1gcNG7lbizLqhCEKgOy8bicuoYZvK4rEMEu0bTbqfyvZLNfl1R7pc1h7ipR5ltUOrCys6xoNocI/7YKv6S9lYuDnFnDdenfkTKj7302uPFxQ3IaQ/p6SlmtS46YdroaS0kGIWqs+jgalJwgNa0dxWgrIgQhCqBM3XSKpA7oSTN89GwjioF0ve/4oAd70/Sn0+5g1SF1vTtnwoGJAMvu8oSQhUCEIQCELhW5S1zcwTUIDhwDlC32ShsTQAImgA3GibcbouN1nlj2uqVjYo7mOJrSeoCFG7iXOV7bdLhPuNwnKdmqVCS43Rcbq8p2apUJLjdKksvxAmSfUPRPSEXCz5MbljZFl1WYyd9m5qmN1z+A3TjUOB1njG4ylX+E3YeyOG3Yey8X4Z9OvOKAnfYuM8RaOdmm/L/ANTTUvEZdx4+elmHS3NaPDbsPZHCbpoNPJPwz6OcZzqmRhAdNGNL6xlTU8rpHayNeANbNIVvht/6ECMDlon4Z9HOGqVRkEO0aSNxZSL0eDx5Yb5MZ2X4ELncdlq24ixje9Mh4d43wtzDPsV0FM6YUUTpI80xAztvaxtqu0y3dM2et7OQjiTaju3p4hqkdLUWu2l12LgtIY57wTaMnbXmpEcWYad2uRzs4J13Oiu9gY6/K90DUIQgEIQgcWWNi5oJ80uUtH1gPmmzNppZWxy8N0g1DXHX2SOpKYkXiZp5KCQhwFy8WHW6LO/GPdI2OJsZjaxoYeYA0TBTUwFhEy3ogks78Y90ha46FwPzUfdaXKG8FlgbjRPiihhJMbGtJ5kDmgAy/JzT80ZNL5m+6aaamJJMTLnmbc0j4KRhBkbE0u0Gbqgfk/mb7oyfzBRugo2kRubED0aTZSd0g/wmeyDDdi+AOrRU/GaXnfLxRz08/IKWTHsBe4uOL0gvtOAvC0+MtEjS9uZoOo3Qe4/HsCvf4xS/rhN+OYD+cU3+oH/K8QkLC8ljcregTEHurO0GBsbYYxSH1mBTvpHgn5tRfqheHMfEIXNc27zext7a9FCg93+keCfm1F+qFBV4zgVSWH43SsyixtK03C8PT5CwkZG5RYaeaD2yXF8AlmDzjNIBYeHiNPJXPpPgf5tR/qheCIQf/9k=";
const competitorT460Thumb = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAB4ADcDASIAAhEBAxEB/8QAGwAAAwEBAAMAAAAAAAAAAAAAAAECAwQFBgf/xAA2EAABAwICBwMMAgMAAAAAAAABAAIRAxIEIRMiMTJBUWEFFSMUM1JUYnKBgpGSk6FCcXOz4f/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAMAwEAAhEDEQA/AParTcTef6yUmvRG2qwcM3BBqUW1CS9ocBBzSFKm9stgh2cgDNBo17XiWuDh0MpqG0w0Q02jkAAr4IEXNDg0uEnhKTxcQA+0jPLipdQY6s2qZub9E9E0VTVjWIhBFOm9tZznV3PB/gQMkKxTAqOqAmXCChB4rtahiarycNSl4zBIynmurD4ZzsLRFanrhga7WIj6IODacd5VpKkxFk6q6HscXyNnDXISFFJj6TLWU2ge+SrBqSJa2P7WQZU4/wCwphj+OXOKhQboWDGPD54e+St8kBx2oWbt4oQKc44ogrkOEqntLyjTDR2gWRnl1XU97g5wDndBAVDgpa07uXNTe8kaz+uqEF1Sci4jlaFBcFEFTdUna77QtmzaJ29UGaE3bxQqEpeJqmG/HRz+1Sio0GqSWyPcKgm3KAzr5v8A6gNMGWbBl4aVstm0H5Dl+0y3ZqifcJQFkNGoM9vhrWmajjLjkDsLYWVojNs/IVtQaA0kCJ6EIB28UIdvFCoSH6O43B07eKFDyBVOefKSoGRRgyHRtORR4MTDo+KidkET7zkEgzBH3OQbCqwCBOQ5FUx4eJE/EQuckQSDI4azltRDbbmkngczH7QDt4oQ7eKFQlDz4pAdyyvIVpP3j535digzuiIeCP8AIUXAHekjhpCqE7AK6pjC4uk1BGySlGdwGRdHDzhW1J9wjKB1kp6P23/VApwQb35dUCdvFCHbxQqE4hroN3waShrw4wC/4tISbUqGs9rqcMGw81V7/Q/agV4k7+XslGkbzf8AaU73+gfqmHOIzEdECLgACS/Pk0paQc3/AGlXJUValRgbZTuk5oFe32/sKE2PqGs5rmQwbChB84727R9exH5Cq72x9k+X4m6dmkKEIJ727R9exH5CqPa2PsBGPxN3EaQoQgnvbtH17EfkKZ7W7QgRj8TPHxChCBd7do+vYj8hQhCD/9k=";

const negotiationMedia: NegotiationMedia[] = [
  {
    recordId: "drive-yf380-candidate-review",
    src: competitorYf380Thumb,
    alt: "Archived July 15 Alibaba screenshot showing the competing YF380 candidate",
    label: "Competitor comparison media",
    caption: "YF380 alternative reviewed while establishing delivered DDP cost and configuration requirements.",
  },
  {
    recordId: "drive-vendor-t460-quote",
    src: competitorT460Thumb,
    alt: "Archived July 15 Alibaba screenshot documenting the competing T460 DDP offer",
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
