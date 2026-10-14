import { Link } from "react-router-dom";
import type { Equipment } from "../types/equipment";
import { fleetCardSpecs } from "../domain/fleetCard";

export function FleetEquipmentCard({ item }: { item: Equipment }) {
  const media = item.cardMedia ?? item.heroMedia;
  const name = item.showroomCard?.name ?? item.name;
  const specs = fleetCardSpecs(item);
  return <article className="equipment-card fleet-card" data-fleet-id={item.fleetId}>
    <figure className="fleet-card__media">
      <img src={item.cardMedia?.src ?? item.heroImage} srcSet={media?.srcSet} sizes="(min-width: 1600px) 342px, (min-width: 768px) 50vw, 100vw" alt={media?.alt ?? `${item.fleetId} ${item.category}`} width={media?.width ?? 1536} height={media?.height ?? 1024} loading="lazy" decoding="async" />
      {item.showroomCard?.imageLabel && <figcaption>{item.showroomCard.imageLabel}</figcaption>}
    </figure>
    <div className="fleet-card__body">
      <p className="fleet-card__role">{item.showroomCard?.role ?? item.identity.assetClass}</p>
      <h3>{name}</h3>
      <p className="fleet-card__identity">{item.fleetId}{item.identity.factoryModel && <> / {item.identity.factoryModel}</>}</p>
      <p className="fleet-card__status">{item.statusLabel}</p>
      <p className="fleet-card__description">{item.capabilityStatement}</p>
      {specs.length > 0 && <dl className="fleet-card__specs">{specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>}
      <Link className="fleet-card__link" to={item.publicPath} aria-label={`Explore ${name} equipment (${item.fleetId})`}>Explore equipment <span aria-hidden="true">&rarr;</span></Link>
    </div>
  </article>;
}
