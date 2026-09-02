import type { EquipmentPartner } from "../types/equipment";
import "../styles/partner-field-support.css";

const publicStatuses = new Set<EquipmentPartner["status"]>(["confirmed", "active", "completed"]);

export function PartnerFieldSupport({ partners = [] }: { partners?: EquipmentPartner[] }) {
  const visiblePartners = partners.filter(({ status }) => publicStatuses.has(status));
  if (!visiblePartners.length) return null;

  return <section className="section shell partner-support" aria-labelledby="partner-support-title">
    <div className="section-heading"><div><p className="eyebrow">Equipment Provenance</p><h2 id="partner-support-title">Partners &amp; Field Support</h2></div><p>Only confirmed relationships appear in this public equipment record.</p></div>
    <div className="partner-support__grid">{visiblePartners.map((partner) => <article key={partner.id}>
      <div className="partner-support__logo">{partner.logo ? <img src={partner.logo} alt={`${partner.brand} logo`} loading="lazy" decoding="async" /> : <span aria-hidden="true">{partner.brand.split(/\s+/).map((word) => word[0]).join("").slice(0, 3)}</span>}</div>
      <div className="partner-support__body"><small>{partner.category}</small><h3>{partner.brand}</h3><strong>{partner.relationship}</strong><p>{partner.description}</p><em>{partner.status}</em>
        {partner.website || partner.storyUrl ? <div>{partner.website ? <a href={partner.website} target="_blank" rel="noopener noreferrer">Visit website</a> : null}{partner.storyUrl ? <a href={partner.storyUrl}>Related record</a> : null}</div> : null}
      </div>
    </article>)}</div>
  </section>;
}
