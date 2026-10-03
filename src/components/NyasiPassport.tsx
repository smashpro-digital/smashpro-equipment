import type { Equipment } from "../types/equipment";
import { PassportHero } from "./PassportHero";
import { FleetLifecycleProgress } from "./FleetLifecycleProgress";
import { PassportEvidenceRecord } from "./PassportEvidenceRecord";
import { nyasiEvidenceSlots, nyasiLifecycle } from "../data/nyasiEquipment";
import "../styles/nyasi-passport.css";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function NyasiPassport({ item }: { item: Equipment }) {
  return <main className="nyasi-passport" id="passport">
    <PassportHero titleId="nyasi-title" image={item.heroImage} srcSet={item.heroMedia?.srcSet} sizes="100vw" width={item.heroMedia?.width} height={item.heroMedia?.height} alt={item.heroMedia?.alt ?? "SP-NYASI-26 identity artwork; production photography is pending"} className="nyasi-hero">
      <p className="eyebrow">Identity / promotional artwork · Evidence-bound passport</p>
      <h1 id="nyasi-title">SP-NYASI-26 <span>Nyasi</span></h1>
      <p>{item.slogan}</p><p>{item.overview}</p>
      <div className="nyasi-status"><strong>Current stage</strong><span>Production pending</span><small>Initial payment paid. Production is expected after the current Chinese holiday; no production date is confirmed.</small></div>
      <nav aria-label="Passport sections"><a href="#identity">Identity</a><a href="#journey">Journey</a><a href="#configuration">Configuration</a><a href="#evidence">Evidence</a></nav>
    </PassportHero>

    <section className="section shell" id="identity"><div className="section-heading"><div><p className="eyebrow">Permanent fleet identity</p><h2>A remote tracked platform with a documented purpose.</h2></div><p>{item.passportExplanation}</p></div>
      <div className="nyasi-facts"><article><span>Fleet ID</span><strong>{item.fleetId}</strong></article><article><span>Passport ID</span><strong>{item.identity.passportId}</strong></article><article><span>Factory model</span><strong>{item.identity.factoryModel}</strong></article><article><span>Supplier</span><strong>{item.manufacturer}</strong></article></div>
      <p className="nyasi-source">Digital HQ owns the canonical procurement record. This public passport publishes only supported, public-safe facts and keeps private invoice, payment, contact, and delivery details out of the page.</p>
    </section>

    <div id="journey"><FleetLifecycleProgress stages={nyasiLifecycle} metrics={[{id:"paid",label:"Initial payment (USD)",value:600},{id:"balance",label:"Remaining balance (USD)",value:1565},{id:"total",label:"Order total (USD)",value:2165}]} currentStage="Production pending" nextStage="Production in progress" description="Milestones advance only when source evidence is received. No live production or shipment tracking is claimed." eyebrow="Procurement to operations" title="One evidence-gated production journey." /></div>

    <section className="section shell" id="configuration"><div className="section-heading"><div><p className="eyebrow">Confirmed configuration</p><h2>Built around remote vegetation and snow work.</h2></div><p>The purchased configuration is separated from removed options and future ideas.</p></div>
      <div className="nyasi-columns"><article><h3>Power and control</h3><ul><li>RATO 225 cc gasoline engine</li><li>Brushless drive system</li><li>Tracked, remote-controlled LM500 platform</li></ul></article><article><h3>Factory appearance</h3><ul><li>SmashPro green finish</li><li>Custom decals, artwork pending</li><li>Headlights, light covers, and cover plates</li></ul></article><article><h3>Purchased work package</h3><ul><li>Remote mower platform · {money.format(1230)}</li><li>Tow hook · {money.format(60)}</li><li>Remote-lift dozer / snow pusher · {money.format(180)}</li><li>DDP freight · {money.format(695)}</li></ul></article><article className="is-excluded"><h3>Not included</h3><ul><li>Top storage rack — removed from order</li><li>Side cutter — not purchased</li><li>No conceptual accessory is represented as purchased</li></ul></article></div>
      <div className="nyasi-payment"><span>Order total <strong>{money.format(2165)}</strong></span><span>Initial payment paid <strong>{money.format(600)}</strong></span><span>Remaining balance <strong>{money.format(1565)}</strong></span></div>
    </section>

    <section className="section shell" id="evidence"><div className="section-heading"><div><p className="eyebrow">Evidence archive</p><h2>Empty slots remain visibly pending.</h2></div><p>Reference material is recorded privately. Supplier production media will appear only after it is received and approved for publication.</p></div>
      <div className="nyasi-evidence-list">{nyasiEvidenceSlots.map((record, index) => <PassportEvidenceRecord key={record.id} id={`evidence-${record.id}`} date={record.status === "Pending" ? "Pending" : "2026-09-29"} phase="Evidence" title={record.title} label={record.status} defaultOpen={index === 0}><p>{record.detail}</p></PassportEvidenceRecord>)}</div>
    </section>

    <section className="section shell" id="history"><div className="section-heading"><div><p className="eyebrow">Permanent history</p><h2>The record begins with supported procurement events.</h2></div><p>Later milestones remain absent until evidence supports them.</p></div><div className="nyasi-evidence-list">{item.timeline.map((event) => <PassportEvidenceRecord key={event.id} id={`history-${event.id}`} date={event.occurredAt ?? "Current"} phase={event.kind === "purchase" ? "Procurement" : "Status"} title={event.title} label="Recorded"><p>{event.detail}</p></PassportEvidenceRecord>)}</div></section>

    <section className="section shell nyasi-future" id="service"><p className="eyebrow">Future operational record</p><h2>Ready for verified history, without pretending it exists.</h2><div><article><h3>Commissioning</h3><p>Pending U.S. delivery, inspection, serial verification, and first startup.</p></article><article><h3>Service history</h3><p>No service events or operating hours have been recorded.</p></article><article><h3>Field work</h3><p>No jobs, revenue, locations, or performance claims are published.</p></article></div></section>
  </main>;
}
