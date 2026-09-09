import type { AttachmentPassport } from "../types/equipment";
import { ButtonLink } from "./ButtonLink";

const statusLabel: Record<AttachmentPassport["status"], string> = {
  documented: "Documented",
  selected: "Selected · Procurement",
  ordered: "Ordered",
  "in-transit": "In transit",
  commissioning: "Commissioning",
  active: "Active",
  retired: "Retired",
  planned: "Future capability",
};

export function AttachmentShowroom({ attachments }: { attachments: AttachmentPassport[] }) {
  const groups = attachments.reduce<Record<string, AttachmentPassport[]>>((acc, item) => {
    const key = item.type;
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
  const featured = attachments.find((item) => item.featured) ?? attachments[0];

  return (
    <section className="attachment-showroom" id="attachments" aria-labelledby="attachments-title">
      <div className="shell attachment-showroom__shell">
        <div className="attachment-showroom__intro">
          <div>
            <p className="eyebrow">Attachment passports</p>
            <h2 id="attachments-title">Every attachment gets an identity. Compatibility starts at the plate.</h2>
          </div>
          <p>
            SmashPro tracks physical attachments as individual fleet assets and records fitment by mounting-interface requirements first.
            Machines can come and go; the attachment passport keeps its plate standard, hydraulic needs, history, and verified host evidence.
          </p>
        </div>

        {featured && (
          <article className="attachment-feature">
            <div className="attachment-feature__visual">
              {featured.image ? (
                <img src={featured.image} alt={featured.imageAlt ?? featured.name} loading="lazy" decoding="async" />
              ) : (
                <div className="attachment-feature__monogram"><span>{featured.width?.replace(/[^0-9]/g, "") || "SP"}</span><small>{featured.width ? "IN" : "ATT"}</small></div>
              )}
              <span className="attachment-feature__fleet">{featured.plateRequirement?.label ?? "Plate requirement pending"}</span>
            </div>
            <div className="attachment-feature__body">
              <div className="attachment-feature__topline">
                <span className={`attachment-status attachment-status--${featured.status}`}>{statusLabel[featured.status]}</span>
                <span>{featured.category}</span>
              </div>
              <p className="attachment-feature__kicker">{featured.passportId} {featured.manufacturer ? `· ${featured.manufacturer}` : ""}</p>
              <h3>{featured.name}</h3>
              <p className="attachment-feature__summary">{featured.description}</p>
              <dl className="attachment-feature__facts">
                {featured.width && <div><dt>Width</dt><dd>{featured.width}</dd></div>}
                {featured.plateRequirement && <div><dt>Plate</dt><dd>{featured.plateRequirement.label}</dd></div>}
                {featured.weight && <div><dt>Weight</dt><dd>{featured.weight}</dd></div>}
                <div><dt>Asset</dt><dd>{featured.assetTag}</dd></div>
              </dl>
              {!!featured.capabilities.length && <div className="attachment-feature__capabilities">{featured.capabilities.map((item) => <span key={item}>{item}</span>)}</div>}
              <div className="button-row attachment-feature__actions">
                <ButtonLink href={featured.publicPath}>View attachment passport</ButtonLink>
                {featured.serviceUrl && <ButtonLink href={featured.serviceUrl} variant="outline">View supported work</ButtonLink>}
              </div>
            </div>
          </article>
        )}

        <div className="attachment-type-grid">
          {Object.entries(groups).map(([type, items]) => (
            <section className="attachment-type-card" key={type} aria-labelledby={`attachment-type-${type}`}>
              <div className="attachment-type-card__heading">
                <div><p className="eyebrow">{items[0]?.category}</p><h3 id={`attachment-type-${type}`}>{items[0]?.typeLabel ?? type}</h3></div>
                <span>{items.length} {items.length === 1 ? "passport" : "passports"}</span>
              </div>
              <div className="attachment-passport-list">
                {items.map((item) => (
                  <a className="attachment-passport-row" href={item.publicPath} key={item.passportId}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.passportId} · {item.plateRequirement?.label ?? "Plate TBD"}</span>
                    </div>
                    <span className={`attachment-status attachment-status--${item.status}`}>{statusLabel[item.status]}</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="attachment-showroom__note">
          <p><strong>Compatibility rule:</strong> plate standard first, hydraulic/electrical requirements second, verified machine fitment third. A machine name alone never defines attachment compatibility.</p>
        </div>
      </div>
    </section>
  );
}
