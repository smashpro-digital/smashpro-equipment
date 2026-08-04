import { Link } from "react-router-dom";
import type { Equipment } from "../types/equipment";

export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <article className="equipment-card">
      <img src={item.heroImage} alt={`${item.fleetId} ${item.category}`} width="1536" height="1024" loading="lazy" />
      <div className="equipment-card__overlay" />
      <div className="equipment-card__content">
        <div className="card-meta"><span>{item.fleetId}</span><span className="status-dot">{item.statusLabel}</span></div>
        <h3>{item.name}</h3><p className="category-label">{item.category}</p><p>{item.capabilityStatement}</p>
        <div className="mini-specs">{item.specifications.slice(1, 4).map((spec) => <span key={spec.label}><small>{spec.label}</small>{spec.value}</span>)}</div>
        <Link className="text-link" to={item.publicPath}>View Equipment <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
