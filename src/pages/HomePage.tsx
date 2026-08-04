import { attachments } from "../data/attachments";
import { equipment } from "../data/equipment";
import { ButtonLink } from "../components/ButtonLink";
import { EquipmentCard } from "../components/EquipmentCard";
import { PageFrame } from "../components/PageFrame";

const capabilities = ["Landscaping", "Material transport", "Property cleanup", "Loading and unloading", "Tight-access work", "Contractor rentals"];
const standards = ["Maintained equipment", "Contractor eligibility", "Inspection process", "Clear rental terms", "Equipment support", "Growing attachment library"];
const rentalSteps = ["Browse", "Verify eligibility", "Request dates", "Complete inspection", "Put it to work", "Return and close out"];

export function HomePage() {
  return (
    <PageFrame>
      <section className="home-hero">
        <img src="/equipment/images/ardhibanner.png" alt="SmashPro compact tracked loader prepared for project work" width="1536" height="1024" />
        <div className="home-hero__shade" /><div className="ambient-light" aria-hidden="true" /><div className="shell home-hero__content"><p className="eyebrow">Official SmashPro Fleet Showroom</p><h1>Built to Move the Work Forward.</h1><p>Professional-grade compact equipment selected for capability, access, and project support—from moving earth to moving the load.</p><p className="motto">Power. Precision. Purpose.</p><div className="button-row"><ButtonLink href="#fleet">Explore Equipment</ButtonLink><ButtonLink href="https://smashpro.app/contact" variant="outline">Request Availability</ButtonLink></div></div>
        <div className="hero-rail"><span>01</span><p>Compact capability.<br />Professional standards.</p></div>
      </section>

      <div className="home-flow">
      <section className="section shell" id="fleet"><div className="section-heading"><div><p className="eyebrow">Featured fleet</p><h2>Equipment with a defined purpose.</h2></div><p>Every fleet asset is documented around the work it supports. Availability is published only when the operating program is ready.</p></div><div className="equipment-grid">{equipment.map((item) => <EquipmentCard key={item.fleetId} item={item} />)}</div></section>

      <section className="capability-section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Work capabilities</p><h2>Made for the places work gets difficult.</h2></div><p>Compact equipment expands what a prepared crew can move, handle, and finish.</p></div><div className="capability-grid">{capabilities.map((item, index) => <div key={item}><span>0{index + 1}</span><h3>{item}</h3></div>)}</div></div></section>

      <section className="section shell split-section"><div><p className="eyebrow">Why SmashPro Fleet</p><h2>Readiness is part of the equipment.</h2><p>Rental access is more than a key handoff. It is a documented operating relationship built around people, machines, projects, and condition.</p></div><div className="standards-list">{standards.map((item, index) => <div key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{index === 0 ? "Fleet care and operating readiness are treated as core requirements." : index === 1 ? "Access may depend on approval, insurance, certification, and account standing." : "Clear steps support safer, more predictable equipment use."}</p></div>)}</div></section>

      <section className="process-section" id="rental-process"><div className="shell"><p className="eyebrow">Rental process</p><div className="section-heading"><h2>From request to closeout.</h2><p>This is the intended rental journey. Public availability and launch timing have not been announced.</p></div><ol className="process-grid">{rentalSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step}</h3></li>)}</ol></div></section>

      <section className="section shell" id="attachments"><div className="section-heading"><div><p className="eyebrow">Attachment library</p><h2>One fleet. More ways to work.</h2></div><p>Only the bucket and pallet forks are documented with the initial Ardhi fleet record. Remaining attachments are planned, not offered.</p></div><div className="attachment-grid">{attachments.map((item) => <article key={item.name}><span className={item.status === "included" ? "badge badge--live" : "badge"}>{item.status === "included" ? "Documented" : "Future"}</span><h3>{item.name}</h3><p>{item.category}</p></article>)}</div></section>

      <section className="contractor-cta" id="contractors"><div className="shell"><p className="eyebrow">For independent contractors</p><h2>Fleet access begins with readiness.</h2><p>SP Fleet rental access may require account approval, equipment-specific qualification, insurance, certification, and agreement to inspection and rental terms. A public SPgO network URL has not yet been approved.</p><div className="button-row"><ButtonLink href="https://smashpro.app/contact" variant="primary">Request SPgO Network Access</ButtonLink><ButtonLink href="https://smashpro.app/contact" variant="outline">Ask About Eligibility</ButtonLink></div></div></section>
      </div>
    </PageFrame>
  );
}
