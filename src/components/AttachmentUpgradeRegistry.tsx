import type { AttachmentPassport } from "../types/equipment";
import { ButtonLink } from "./ButtonLink";

/** Upgrades stay under their existing physical attachment, never another asset. */
export function AttachmentUpgradeRegistry({ item }: { item: AttachmentPassport }) {
  if (!item.upgrades?.length) return null;
  return <section className="section shell bucket-upgrade-registry" id="attachment-upgrades" aria-labelledby="upgrade-title">
    <div className="section-heading"><div><p className="eyebrow">Upgrade registry / {item.passportId}</p><h2 id="upgrade-title">One bucket.<br />Six new possibilities.</h2></div><p>Purchased components, documented decisions and physical verification. The original attachment keeps its permanent identity.</p></div>
    {item.upgrades.map(upgrade => <article className="bucket-upgrade" key={upgrade.id}>
      <header><p className="eyebrow">{upgrade.id}</p><span className="bucket-upgrade-state">{upgrade.status}</span><h3>{upgrade.manufacturer} {upgrade.partNumber}<br />Six-Tooth Digging Upgrade</h3><p>{upgrade.description}</p></header>
      <dl className="spec-grid"><div><dt>Product</dt><dd>{upgrade.manufacturer} {upgrade.partNumber}</dd></div><div><dt>Quantity</dt><dd>{upgrade.quantity} individual teeth</dd></div><div><dt>Purchase confirmed</dt><dd><time dateTime={upgrade.purchasedAt}>November 5, 2026</time></dd></div><div><dt>Installation</dt><dd>{upgrade.installationStatus}</dd></div><div><dt>Field test</dt><dd>{upgrade.fieldTestStatus}</dd></div>{upgrade.costs && <div><dt>Purchase total</dt><dd>{upgrade.costs.total}<small>Subtotal {upgrade.costs.subtotal} / tax {upgrade.costs.tax} / {upgrade.costs.shipping.toLowerCase()} shipping</small></dd></div>}</dl>
      {upgrade.milestones && <ol className="bucket-upgrade-timeline" aria-label="Upgrade milestones">{upgrade.milestones.map((stage, index) => <li key={stage.id} className={`is-${stage.status}`} aria-current={stage.status === "current" ? "step" : undefined}><span aria-hidden="true">{stage.status === "completed" ? "✓" : String(index + 1).padStart(2, "0")}</span><small>{stage.status === "completed" ? "Documented" : stage.status === "current" ? "Current / unverified" : "Pending evidence"}</small><h4>{stage.label}</h4>{stage.date && <time dateTime={stage.date}>{stage.date}</time>}{stage.notes && <p>{stage.notes}</p>}</li>)}</ol>}
      <div className="bucket-upgrade__engineering"><div><h4>Published dimensions / physical verification pending</h4><dl>{upgrade.specifications?.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl><p>Seller diagram references are not verified measurements of the delivered parts or the factory bucket.</p></div><div><h4>Fitment checkpoints</h4><ul>{upgrade.fitmentRequirements?.map(check => <li key={check}>{check}</li>)}</ul><h4>Electric Green transformation / evaluation only</h4><p>{upgrade.coatingPlan}</p></div></div>
      {upgrade.articleUrl && <ButtonLink href={upgrade.articleUrl}>Follow the installation and field journal</ButtonLink>}
      {upgrade.procurementDocument && <p className="bucket-procurement-source">Procurement record: <a href={`https://github.com/smashpro-digital/smashpro-equipment/blob/main/${upgrade.procurementDocument}`}>{upgrade.procurementDocument.split('/').pop()}</a>. Private receipt and order information are excluded.</p>}
    </article>)}
  </section>;
}
