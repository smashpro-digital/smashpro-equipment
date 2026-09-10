import { Link } from "react-router-dom";
import { equipment } from "../data/equipment";
import { PageFrame } from "../components/PageFrame";
import { SeoSchema } from "../components/SeoSchema";
import { ArdhiPassportJourney } from "../components/ArdhiPassportJourney";
import { MzigoPassport } from "../components/MzigoPassport";

export function EquipmentPassportPage({ slug }: { slug: string }) {
  const item = equipment.find(entry => entry.slug === slug)!;
  const related = equipment.find(entry => entry.slug !== slug)!;
  return <PageFrame><SeoSchema item={item} />
    <nav className="shell breadcrumbs" aria-label="Breadcrumb"><Link to="/">Equipment</Link><span>/</span><span aria-current="page">Passport {item.fleetId}</span></nav>
    {item.slug === "sp-ardhi-26" ? <ArdhiPassportJourney item={item} /> : <MzigoPassport item={item} />}
    <section className="related shell"><div><p className="eyebrow">Related equipment passport</p><h2>{related.fleetId}</h2><p>{related.capabilityStatement}</p></div><Link className="related-image" to={related.publicPath}><img src={related.heroImage} alt={related.fleetId} width="1536" height="1024" loading="lazy" /><span>Open passport →</span></Link></section>
  </PageFrame>;
}
