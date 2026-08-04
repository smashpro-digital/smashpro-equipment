import { Link } from "react-router-dom";
import type { Equipment } from "../types/equipment";

export function EquipmentCard({ item }: { item: Equipment }) {
  const preferredSpecs = item.slug === "sp-mzigo-26"
    ? ["Machine type", "Payload", "Power source", "Electric drive system"]
    : ["Model reference", "Machine type", "Drive", "Hydraulics"];
  const quickSpecs = preferredSpecs.map((label) => item.specifications.find((spec) => spec.label === label)).filter((spec): spec is NonNullable<typeof spec> => Boolean(spec));
  return (
    <article className="equipment-card">
      <div className="equipment-card__media"><img src={item.heroImage} alt={`${item.fleetId} ${item.category}`} width="1536" height="1024" loading="lazy" /><span className="card-status">Fleet build</span></div>
      <div className="equipment-card__overlay" />
      <div className="equipment-card__content">
        <p className="card-fleet-id">{item.fleetId}</p><h3>{item.name}</h3><p className="category-label">{item.category}</p><p className="card-capability">{item.capabilityStatement}</p>
        <dl className="mini-specs">{quickSpecs.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>
        <Link className="card-cta" to={item.publicPath} aria-label={`View ${item.fleetId} equipment details`}>View Equipment <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
