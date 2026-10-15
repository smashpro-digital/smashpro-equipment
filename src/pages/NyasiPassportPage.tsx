import { Link } from "react-router-dom";
import { PageFrame } from "../components/PageFrame";
import { SeoSchema } from "../components/SeoSchema";
import { NyasiPassport } from "../components/NyasiPassport";
import { FleetEquipmentCard } from "../components/FleetEquipmentCard";
import { PassportSection } from "../components/PassportExperience";
import { equipment } from "../data/equipment";
import { nyasiEquipment } from "../data/nyasiEquipment";

/** Thin route composition; content and reusable presentation stay outside the page. */
export function NyasiPassportPage() {
  return <PageFrame><SeoSchema item={nyasiEquipment} title="SP-NYASI-26 Equipment Passport | Remote Mower | SmashPro" />
    <nav className="shell breadcrumbs" aria-label="Breadcrumb"><Link to="/">Equipment</Link><span>/</span><span aria-current="page">Passport SP-NYASI-26</span></nav>
    <NyasiPassport item={nyasiEquipment} />
    <div className="nyasi-related"><PassportSection id="related-equipment" eyebrow="Connected field fleet" title="Different roles. Shared purpose." description="Explore the compact loader and material transporter alongside NYASI."><div className="fleet-grid">{equipment.filter(item => ["SP-ARDHI-26", "SP-MZIGO-26E"].includes(item.fleetId)).map(item => <FleetEquipmentCard key={item.fleetId} item={item} />)}</div></PassportSection></div>
  </PageFrame>;
}
