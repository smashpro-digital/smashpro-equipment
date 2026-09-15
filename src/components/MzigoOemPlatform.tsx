import type { Equipment } from "../types/equipment";
import {
  approvedMzigoMedia,
  mzigoCollaboration,
  mzigoConfirmedProduction,
  mzigoEngineeringCallouts,
  mzigoEvidenceCategories,
  mzigoMarketSegments,
  mzigoOptionGroups,
  mzigoPublicationChannels,
  mzigoRoadmap,
  mzigoShippingEvidenceSlots,
  mzigoSystemLinks,
} from "../data/mzigoPlatform";
import { mzigoMediaAnchor } from "../domain/mzigoArchive";

const recordSections = [
  { title: "Engineering", detail: "Component-level observations link to the dated factory archive. Ratings remain qualified by their source.", href: "#engineering" },
  { title: "Procurement", detail: "The public record confirms the deposit and current payment stage without publishing private amounts or terms.", href: "#history" },
  { title: "Factory Updates", detail: "Dated factory evidence preserves assembly, finish, revisions, QC status and build approval.", href: "#mzigo-build-story" },
  { title: "Shipping", detail: "Crating through commissioning remain explicit lifecycle placeholders until documented.", href: "#shipping-evidence" },
  { title: "Maintenance", detail: "The machine remains pre-commissioning with no completed maintenance events.", href: "#service" },
  { title: "Documents, Downloads and Manuals", detail: "Public documents appear only after their source and public status are verified.", href: "#documents" },
  { title: "Service Notes", detail: "Operational notes will be added to the unit record after commissioning and documented work.", href: "#service" },
  { title: "Production History", detail: "The archive retains early assembly alongside later as-built evidence so revisions remain traceable.", href: "#evidence" },
  { title: "Upgrade Roadmap", detail: "Future options are separated from installed Founders Edition configuration.", href: "#product-roadmap" },
  { title: "Known Issues", detail: "Manufacturer ratings, rated recovery points, shipment evidence and operating guidance remain open documentation items.", href: "#verification" },
  { title: "Future Improvements", detail: "Field validation will inform fenders, hitch, recovery, lighting, wheel, tire, electrical and fleet-technology packages.", href: "#platform-options" },
];

export function MzigoOemPlatform({ item }: { item: Equipment }) {
  const tieDown = item.gallery.find(media => media.id === "sp-mzigo-26e-tie-down-anchor-detail-2026-09-14");
  const remote = item.gallery.find(media => media.id === "sp-mzigo-26e-remote-controller-2026-09-09");
  const approved = item.gallery.find(media => media.id === "sp-mzigo-26e-build-approved-left-profile-2026-09-15");
  return <>
    <section className="section shell mzigo-engineering" id="engineering" aria-labelledby="mzigo-engineering-title">
      <div className="section-heading"><div><p className="eyebrow">Engineering record</p><h2 id="mzigo-engineering-title">Engineering / Under-Bed Details.</h2></div><p>These callouts describe photographed configuration and access. They do not turn visible hardware into an unverified rating or certification.</p></div>
      <div className="mzigo-engineering-grid">{mzigoEngineeringCallouts.filter(callout => !["Tie-down anchors", "Remote controller"].includes(callout.title)).map(callout => {
        const media = callout.mediaId ? item.gallery.find(entry => entry.id === callout.mediaId) : undefined;
        return <article key={callout.title}><span>{callout.status}</span><h3>{callout.title}</h3><p>{callout.detail}</p>{media && <a href={`#${mzigoMediaAnchor(media)}`}>Open evidence →</a>}</article>;
      })}</div>
    </section>

    <section className="section shell mzigo-build-acceptance" id="build-acceptance" aria-labelledby="mzigo-build-acceptance-title">
      <div className="section-heading"><div><p className="eyebrow">Build acceptance</p><h2 id="mzigo-build-acceptance-title">Securement, controls and approval.</h2></div><p>Each record keeps the supplied fact, visible evidence and remaining limitation together.</p></div>
      <div className="mzigo-acceptance-grid">
        <article id="tie-down-system"><span>Factory-installed</span><h3>Tie-Down System</h3>{tieDown && <img src={tieDown.src} alt={tieDown.alt} width={tieDown.width} height={tieDown.height} loading="lazy" decoding="async" />}<p>The supplier reports bilateral tie-down / rope anchor hardware. It is recorded only as transport securement hardware; no recovery or load rating is claimed.</p>{tieDown && <a href={`#${mzigoMediaAnchor(tieDown)}`}>Open tie-down evidence →</a>}</article>
        <article id="remote-control"><span>Supplied controller</span><h3>Remote Control</h3>{remote && <img src={remote.src} alt={remote.alt} width={remote.width} height={remote.height} loading="lazy" decoding="async" />}<p>The handheld controller is photographed as a supplied item. Range, ingress protection and operating limits remain subject to manufacturer documentation.</p>{remote && <a href={`#${mzigoMediaAnchor(remote)}`}>Open controller evidence →</a>}</article>
        <article id="qc-build-approval"><span>Supplier-reported / SmashPro-approved</span><h3>QC / Build Approval</h3>{approved && <img src={approved.src} alt={approved.alt} width={approved.width} height={approved.height} loading="lazy" decoding="async" />}<p>The September 15 status records quality inspection complete and physical-build approval by SmashPro. The formal QC report, payment, export and commissioning evidence remain pending.</p>{approved && <a href={`#${mzigoMediaAnchor(approved)}`}>Open completed-machine evidence →</a>}</article>
      </div>
    </section>

    <section className="section shell mzigo-production-notes" id="production-notes" aria-labelledby="mzigo-production-title">
      <div className="section-heading"><div><p className="eyebrow">Production notes</p><h2 id="mzigo-production-title">Founders Edition configuration.</h2></div><p>The installed record is kept separate from the future option program.</p></div>
      <ul>{mzigoConfirmedProduction.map(note => <li key={note}>{note}</li>)}</ul>
    </section>

    <section className="section shell mzigo-oem-collaboration" id="oem-collaboration" aria-labelledby="mzigo-oem-title">
      <div className="section-heading"><div><p className="eyebrow">OEM collaboration</p><h2 id="mzigo-oem-title">One build becomes a repeatable brief.</h2></div><p>{mzigoCollaboration.summary}</p></div>
      <div className="mzigo-collaboration-grid"><article><span>Factory collaborator</span><h3>{mzigoCollaboration.partner}</h3><p>The OEM identity remains visible in the record; SmashPro configuration does not replace manufacturer-of-record information.</p></article><article><span>Lessons recorded</span><ul>{mzigoCollaboration.lessons.map(lesson => <li key={lesson}>{lesson}</li>)}</ul></article><article><span>Documented willingness</span><ul>{mzigoCollaboration.capabilities.map(capability => <li key={capability}>{capability}</li>)}</ul></article></div>
    </section>

    <section className="section shell mzigo-platform" id="product-platform" aria-labelledby="mzigo-platform-title">
      <div className="section-heading"><div><p className="eyebrow">Product platform · SP-MTC-001</p><h2 id="mzigo-platform-title">A fleet proof-of-concept with a catalog future.</h2></div><p>SP-MTC-001 is the separate product definition. SP-MZIGO-26E remains the permanent identity of this physical fleet asset.</p></div>
      <div className="mzigo-market-segments" aria-label="Supported product program segments">{mzigoMarketSegments.map(segment => <span key={segment}>{segment}</span>)}</div>
      <div className="mzigo-option-groups" id="platform-options">{mzigoOptionGroups.map(group => <details key={group.title}><summary><strong>{group.title}</strong><span>{group.options.length} configurable areas</span></summary><ul>{group.options.map(option => <li key={option}>{option}</li>)}</ul></details>)}</div>
    </section>

    <section className="section shell mzigo-media-pipeline" id="media-pipeline" aria-labelledby="mzigo-media-pipeline-title">
      <div className="section-heading"><div><p className="eyebrow">Approved media pipeline</p><h2 id="mzigo-media-pipeline-title">One evidence record, deliberate reuse.</h2></div><p>Only media with an explicit channel approval is selected. This metadata does not publish to an external service by itself.</p></div>
      <div className="mzigo-media-categories">{mzigoEvidenceCategories.map(category => <article key={category.id}><strong>{item.gallery.filter(media => media.evidenceCategory === category.id).length}</strong><span>{category.label}</span></article>)}</div>
      <dl className="mzigo-publication-channels">{mzigoPublicationChannels.map(channel => <div key={channel.id}><dt>{channel.label}</dt><dd>{approvedMzigoMedia(item.gallery, channel.id).length} approved assets</dd></div>)}</dl>
    </section>

    <section className="section shell mzigo-systems" id="fleet-integration" aria-labelledby="mzigo-systems-title">
      <div className="section-heading"><div><p className="eyebrow">Fleet integration</p><h2 id="mzigo-systems-title">Stable IDs across every system.</h2></div><p>Future integrations must reference the existing catalog, passport and fleet identities. This page does not create a second registry.</p></div>
      <div className="mzigo-system-grid">{mzigoSystemLinks.map(link => <article key={link.system}><span>{link.status}</span><h3>{link.system}</h3><p>{link.detail}</p></article>)}</div>
    </section>

    <section className="section shell mzigo-shipping-evidence" id="shipping-evidence" aria-labelledby="mzigo-shipping-evidence-title">
      <div className="section-heading"><div><p className="eyebrow">Next evidence cycle</p><h2 id="mzigo-shipping-evidence-title">Shipping evidence queue.</h2></div><p>The September 15 update says final payment is planned this week. It remains pending until a payment record exists. Every later milestone advances independently from its own evidence.</p></div>
      <div className="mzigo-evidence-slots">{mzigoShippingEvidenceSlots.map(slot => <details key={slot.id}><summary><span><strong>{slot.title}</strong><small>{slot.status}</small></span><span aria-hidden="true">+</span></summary><div><p><b>Required evidence:</b> {slot.evidence}</p><p>{slot.advance}</p></div></details>)}</div>
    </section>

    <section className="section shell mzigo-roadmap" id="product-roadmap" aria-labelledby="mzigo-roadmap-title">
      <div className="section-heading"><div><p className="eyebrow">SP-MZIGO roadmap</p><h2 id="mzigo-roadmap-title">Prove, commission, learn, repeat.</h2></div><p>The roadmap records intent without claiming that a future machine, option or sales program already exists.</p></div>
      <ol>{mzigoRoadmap.map(entry => <li key={entry.title}><span>{entry.status}</span><h3>{entry.title}</h3><p>{entry.detail}</p></li>)}</ol>
    </section>

    <section className="section shell mzigo-record-index" id="passport-record" aria-labelledby="mzigo-record-index-title">
      <div className="section-heading"><div><p className="eyebrow">Equipment Passport</p><h2 id="mzigo-record-index-title">The complete living record.</h2></div><p>Expandable records keep the long-form Passport navigable while preserving its evidence, history and future work.</p></div>
      {recordSections.map(section => <details key={section.title}><summary><strong>{section.title}</strong><span aria-hidden="true">+</span></summary><div><p>{section.detail}</p><a href={section.href}>Open related record →</a></div></details>)}
    </section>
  </>;
}
