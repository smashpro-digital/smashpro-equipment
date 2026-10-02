import { attachments } from "../data/attachments";
import { equipment } from "../data/equipment";
import { ButtonLink } from "../components/ButtonLink";
import { EquipmentCard } from "../components/EquipmentCard";
import { PageFrame } from "../components/PageFrame";
import { AttachmentShowroom } from "../components/AttachmentShowroom";
import type { Equipment } from "../types/equipment";

const standards = ["Maintained equipment", "Contractor eligibility", "Inspection process", "Clear rental terms", "Equipment support", "Growing attachment library"];
const rentalSteps = ["Browse", "Verify eligibility", "Request dates", "Complete inspection", "Put it to work", "Return and close out"];
const passportPillars = [
  ["01", "Digital identity", "A permanent Passport connects the machine, factory model, evidence and future service record."],
  ["02", "Factory-to-fleet history", "Lifecycle states advance only when payment, build, logistics, delivery or commissioning evidence supports them."],
  ["03", "Attachment traceability", "Machine, implement, fitment, procurement state and field validation remain distinct records."],
  ["04", "MicroFab support", "Fabrication equipment helps prototype and build tools for the field without being classified as Field Fleet."],
];

export function HomePage() {
  const byShowroomOrder = (a: Equipment, b: Equipment) => a.showroomOrder - b.showroomOrder;
  const fieldFleet = equipment.filter(item => item.showroomGroup === "field-fleet").sort(byShowroomOrder);
  const fabrication = equipment.filter(item => item.showroomGroup === "fabrication").sort(byShowroomOrder);
  return <PageFrame>
    <section className="home-hero">
      <img src="/equipment/images/sp-ardhi-26-hero.png" alt="SmashPro compact tracked loader prepared for project work" width="1536" height="1024" fetchPriority="high" />
      <div className="home-hero__shade" /><div className="ambient-light" aria-hidden="true" /><div className="shell home-hero__content"><p className="eyebrow">Official SmashPro Equipment Showroom</p><h1>Built to Move the Work Forward.</h1><p>Connected equipment documented from procurement and factory evidence through field deployment.</p><p className="motto">Power. Precision. Purpose.</p><div className="button-row"><ButtonLink href="#fleet">Explore Field Fleet</ButtonLink><ButtonLink href="#passports" variant="outline">How Passports Work</ButtonLink></div></div>
      <div className="hero-rail"><span>EXPO 26</span><p>Field Fleet.<br />Attachments.<br />MicroFab.</p></div>
    </section>

    <div className="home-flow expo-showroom">
      <nav className="showroom-jump shell" aria-label="Equipment showroom sections"><a href="#fleet">Field Fleet</a><a href="#passports">Passports</a><a href="#attachments">Attachments</a><a href="#fabrication">Fabrication</a><a href="#development">Development</a></nav>

      <section className="section shell showroom-group showroom-group--field" id="fleet" aria-labelledby="field-fleet-title"><div className="section-heading"><div><p className="eyebrow">01 / Field Fleet</p><h2 id="field-fleet-title">Three machines. Complementary roles.</h2></div><p>ARDHI moves earth and handles material. MZIGO transports loads remotely. NYASI is configured for remote vegetation management. Public status reflects evidence, not availability.</p></div><div className="showroom-role-strip" aria-label="Field Fleet roles"><span>Earthmoving</span><span>Material transport</span><span>Vegetation management</span></div><div className="equipment-grid equipment-grid--field">{fieldFleet.map(item => <EquipmentCard key={item.fleetId} item={item} />)}</div></section>

      <section className="passport-system" id="passports" aria-labelledby="passport-system-title"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Connected Equipment</p><h2 id="passport-system-title">Every asset keeps its history.</h2></div><p>An Equipment Passport is the persistent public identity. It does not make every asset Field Fleet, and it never advances a milestone without evidence.</p></div><div className="passport-pillar-grid">{passportPillars.map(([number,title,copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <AttachmentShowroom attachments={attachments} />

      <section className="section shell showroom-group showroom-group--fabrication" id="fabrication" aria-labelledby="fabrication-title"><div className="section-heading"><div><p className="eyebrow">03 / Fabrication + MicroFab</p><h2 id="fabrication-title">Tools that build for the field.</h2></div><p>Fabrication assets support prototypes, fixtures, adapters and field-ready solutions. They keep their own Equipment Passports without entering the primary Field Fleet lineup.</p></div><div className="fabrication-intro"><strong>FIELD FLEET</strong><span>goes to the job</span><i aria-hidden="true">→</i><strong>MICROFAB</strong><span>helps build for the job</span></div><div className="equipment-grid equipment-grid--fabrication">{fabrication.map(item => <EquipmentCard key={item.fleetId} item={item} />)}</div></section>

      <section className="section shell development-lab" id="development" aria-labelledby="development-title"><div className="section-heading"><div><p className="eyebrow">04 / Development Lab</p><h2 id="development-title">Projects earning their next chapter.</h2></div><p>Concepts and prototypes remain discoverable while staying visually and semantically separate from acquired equipment.</p></div><div className="development-grid">
        <article><div><p className="eyebrow">Dream-build concept</p><h3>SP-GARI-26E</h3><p>An older electric golf cart considered for a lithium-powered, connected shop and promotional build. No donor vehicle or production asset is claimed.</p></div><ButtonLink href="/equipment/golf-cart-tech-build.html" variant="outline">Explore concept</ButtonLink></article>
        <article><div><p className="eyebrow">Product development</p><h3>Project Rebirth / SP-PCM-001</h3><p>A documented prototype path from an F-150 packaging problem toward a possible Power Control Module. No retail release or compatibility claim exists.</p></div><ButtonLink href="/equipment/catalog/sp-pcm-001/" variant="outline">Follow prototype</ButtonLink></article>
      </div></section>

      <section className="section shell split-section"><div><p className="eyebrow">Why SmashPro Fleet</p><h2>Readiness is part of the equipment.</h2><p>Rental access is a documented operating relationship built around people, machines, projects, attachments and condition.</p></div><div className="standards-list">{standards.map((item,index) => <div key={item}><span>0{index+1}</span><h3>{item}</h3><p>{index===0?"Fleet care and operating readiness are treated as core requirements.":index===1?"Access may depend on approval, insurance, certification and account standing.":"Clear steps support safer, more predictable equipment use."}</p></div>)}</div></section>
      <section className="process-section" id="rental-process"><div className="shell"><p className="eyebrow">Rental process</p><div className="section-heading"><h2>From request to closeout.</h2><p>This is the intended rental journey. Public availability and launch timing have not been announced.</p></div><ol className="process-grid">{rentalSteps.map((step,index) => <li key={step}><span>{String(index+1).padStart(2,"0")}</span><h3>{step}</h3></li>)}</ol></div></section>
      <section className="contractor-cta" id="contractors"><div className="shell"><p className="eyebrow">Equipment + project support</p><h2>Start with the right record.</h2><p>Ask about a machine, attachment, fabrication need or future project. Availability remains subject to readiness and review.</p><div className="button-row"><ButtonLink href="https://smashpro.app/contact" variant="primary">Contact SmashPro</ButtonLink><ButtonLink href="#fleet" variant="outline">Review Field Fleet</ButtonLink></div></div></section>
    </div>
  </PageFrame>;
}
