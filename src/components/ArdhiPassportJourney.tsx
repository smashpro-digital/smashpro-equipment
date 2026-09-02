import { useMemo, useState } from "react";
import type { Equipment, GalleryGroup, GalleryImage } from "../types/equipment";
import "../styles/ardhi-passport-v2.css";

const groupLabels: Array<[GalleryGroup, string]> = [
  ["factory", "Factory"], ["assembly", "Assembly"], ["branding", "Branding"],
  ["hydraulics", "Hydraulics"], ["testing", "Testing"], ["export", "Export"],
  ["shipping", "Shipping"], ["arrival", "Arrival"], ["commissioning", "Commissioning"],
  ["jobs", "Jobs"], ["maintenance", "Maintenance"], ["completed-machine", "Completed Machine"],
];

const mapStops = [
  { id: "china", label: "China", flag: "🇨🇳", x: 77, y: 37, title: "Factory origin", lines: ["Shandong Infront Machinery Group", "Manufacturer · YF380", "Production complete"], image: "/equipment/images/sp-ardhi-26-factory-assembly-floor.jpg" },
  { id: "forwarder", label: "Freight Forwarder", flag: "↗", x: 67, y: 49, title: "Export logistics", lines: ["Machine transferred from the factory", "Crated and prepared for export", "Exact facility withheld"] },
  { id: "pacific", label: "Pacific Ocean", flag: "🌊", x: 46, y: 42, title: "Ocean export", lines: ["Vessel · EVER MAX", "Voyage · 1374-016E", "Estimated arrival · Oct 5, 2026"] },
  { id: "usa", label: "United States", flag: "🇺🇸", x: 25, y: 40, title: "United States entry", lines: ["DDP shipping", "Seller-managed delivery through import", "Port and customs milestones pending"] },
  { id: "south-carolina", label: "South Carolina", flag: "📍", x: 28, y: 54, title: "Approximate destination", lines: ["SmashPro Fleet HQ", "South Carolina", "Private street address withheld"] },
];

function daysBetween(from: string, to: Date) {
  return Math.max(0, Math.ceil((to.getTime() - new Date(`${from}T00:00:00Z`).getTime()) / 86_400_000));
}

export function ArdhiPassportJourney({ item }: { item: Equipment }) {
  const [activeStop, setActiveStop] = useState(mapStops[0]);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<GalleryGroup | "all">("all");
  const [lightbox, setLightbox] = useState<GalleryImage>();
  const today = new Date();
  const arrival = new Date("2026-10-05T00:00:00Z");
  const daysSinceBuild = daysBetween("2026-08-18", today);
  const daysUntilArrival = Math.max(0, Math.ceil((arrival.getTime() - today.getTime()) / 86_400_000));
  const filteredMedia = useMemo(() => item.gallery.filter((media) => {
    const matchesGroup = group === "all" || media.group === group;
    const text = `${media.alt} ${media.caption} ${media.group ?? ""}`.toLowerCase();
    return matchesGroup && text.includes(query.trim().toLowerCase());
  }), [group, item.gallery, query]);

  const passport = [
    ["Passport Number", "SP-ARDHI-26"], ["Factory Model", "YF380"], ["Fleet Class", "Mini Skid Loader"],
    ["Status", "Ocean Export"], ["Hydraulics", "3 Pump · 3 Valve"], ["Operating Weight", "880 kg"],
    ["Fuel", "30 L"], ["Engine", "23 HP"], ["Commissioning", "Pending"],
    ["Service Hours", "0.0"], ["Current Owner", "SmashPro Fleet"],
  ];

  return <>
    <section className="ardhi-v2-hero" aria-labelledby="ardhi-v2-title">
      <video controls preload="metadata" poster="/equipment/images/sp-ardhi-26-factory-departure-poster-2026-09-02.jpg" playsInline aria-label="SP-ARDHI-26 wooden export crate leaving the factory on a truck">
        <source src="/equipment/images/sp-ardhi-26-factory-departure-2026-09-02.mp4" type="video/mp4" />
      </video>
      <div className="ardhi-v2-hero__shade" />
      <div className="shell ardhi-v2-hero__copy"><p className="eyebrow">Permanent Equipment Passport · SPP-2026-0001</p><h1 id="ardhi-v2-title">SP-ARDHI-26</h1><p>Factory departure documented. The machine’s public history begins here.</p><div><span>Ocean Export</span><span>YF380</span><span>0.0 Service Hours</span></div></div>
    </section>

    <section className="section shell ardhi-passport-ledger" aria-labelledby="passport-ledger-title"><div className="section-heading"><div><p className="eyebrow">Equipment Passport</p><h2 id="passport-ledger-title">Identity that travels with the machine.</h2></div><p>A permanent public record of configuration, movement, commissioning, service, and work history.</p></div><dl>{passport.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>

    <section className="ardhi-map-section" aria-labelledby="journey-map-title"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Interactive World Journey</p><h2 id="journey-map-title">From factory floor to fleet.</h2></div><p>Select a stop to inspect the verified record. Locations are intentionally approximate.</p></div><div className="ardhi-map-layout"><div className="ardhi-map" role="group" aria-label="Interactive approximate shipping map"><svg viewBox="0 0 100 64" role="img" aria-label="Approximate route from China across the Pacific to South Carolina"><path className="ardhi-map__land" d="M8 15l13-7 18 4 8 9-9 8-12 1-7 11-10-4zm50-3 12-7 21 7-3 15-14 7-8 16-9-8 5-15z"/><path className="ardhi-map__route" d="M77 37 C67 28 57 30 46 42 S31 43 25 40 L28 54"/>{mapStops.map((stop) => <g key={stop.id} className={activeStop.id === stop.id ? "is-active" : ""} transform={`translate(${stop.x} ${stop.y})`} onMouseEnter={() => setActiveStop(stop)} onFocus={() => setActiveStop(stop)} onClick={() => setActiveStop(stop)} role="button" tabIndex={0} aria-label={`Open ${stop.label} journey details`}><circle r="3.8"/><text y="-5">{stop.flag}</text></g>)}</svg></div><aside className="ardhi-map-card" aria-live="polite">{activeStop.image ? <img src={activeStop.image} alt="Authentic SP-ARDHI-26 factory floor record" loading="lazy" decoding="async" /> : <span className="ardhi-map-card__flag">{activeStop.flag}</span>}<p className="eyebrow">{activeStop.label}</p><h3>{activeStop.title}</h3><ul>{activeStop.lines.map((line) => <li key={line}>{line}</li>)}</ul>{activeStop.id === "china" ? <small>Manufacturer logo is not published because no approved source asset is available.</small> : null}</aside></div></div></section>

    <section className="section shell ardhi-journey-stats" aria-labelledby="journey-stats-title"><div className="section-heading"><div><p className="eyebrow">Journey Statistics</p><h2 id="journey-stats-title">The record moves with the machine.</h2></div></div><div className="ardhi-counter-grid"><article><span>Distance traveled</span><strong>Pending verified route</strong></article><article><span>Current stage</span><strong>Container Loaded</strong></article><article><span>Days since build complete</span><strong>{daysSinceBuild}</strong></article><article><span>Days until estimated arrival</span><strong>{daysUntilArrival}</strong></article></div><div className="journey-progress" aria-label="Journey progress: factory and export complete; ocean, United States, and delivery upcoming">{[["Factory",100],["Export",100],["Ocean",8],["USA",0],["Delivery",0]].map(([label,value]) => <div key={String(label)}><span>{label}</span><i><b style={{width:`${value}%`}} /></i><small>{Number(value) === 100 ? "complete" : Number(value) ? "current" : "upcoming"}</small></div>)}</div></section>

    <section className="timeline-section ardhi-history" aria-labelledby="ardhi-history-title"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Historical Record</p><h2 id="ardhi-history-title">Every event keeps its evidence.</h2></div><p>Expand a record to see its notes, media, documents, specifications, and logistics context.</p></div><ol className="ardhi-expandable-timeline">{item.timeline.map((event) => <li key={event.id} className={event.milestone ? "is-milestone" : ""}><details><summary><span>{event.occurredAt ?? "Date private"}</span><strong>{event.title}</strong><em>{event.videos?.length ?? 0} video · {event.photos?.length ?? 0} photos</em></summary><div>{event.detail?.split("\n").map((line) => <p key={line}>{line}</p>)}{event.videos?.map((src) => <video key={src} controls preload="metadata" poster="/equipment/images/sp-ardhi-26-factory-departure-poster-2026-09-02.jpg"><source src={src} type="video/mp4" /></video>)}<dl><div><dt>Documents</dt><dd>{item.documents.filter(({publicDisplay}) => publicDisplay).length}</dd></div><div><dt>Specifications</dt><dd>{item.specifications.length}</dd></div><div><dt>Maintenance</dt><dd>{item.serviceHistory.length || "No service due"}</dd></div></dl></div></details></li>)}</ol><div className="future-ledger"><h3>Reserved future records</h3>{["Ocean Departure","Cross Pacific","Port Arrival","Customs","Released","Delivered","First Startup","First Fuel","First Attachment","First Job","10 Hours","50 Hours","100 Hours","Annual Service"].map((label) => <span key={label}>{label}</span>)}</div></div></section>

    <section className="section shell ardhi-archive" aria-labelledby="archive-title"><div className="section-heading"><div><p className="eyebrow">Build Archive</p><h2 id="archive-title">Search the complete visual record.</h2></div><p>Authentic project media only. Empty chapters remain visible as placeholders for the next verified record.</p></div><div className="archive-tools"><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search captions, systems, or stages" aria-label="Search SP-ARDHI-26 media"/><div>{[["all","All"],...groupLabels].map(([id,label]) => <button type="button" className={group === id ? "is-active" : ""} onClick={() => setGroup(id as GalleryGroup | "all")} key={id}>{label}</button>)}</div></div><div className="archive-grid">{filteredMedia.map((media) => <article key={media.src}>{media.kind === "video" ? <video controls preload="metadata" poster={media.poster}><source src={media.src} type="video/mp4" /></video> : <button type="button" onClick={() => setLightbox(media)} aria-label={`Enlarge ${media.alt}`}><img src={media.src} alt={media.alt} loading="lazy" decoding="async" /></button>}<span>{groupLabels.find(([id]) => id === media.group)?.[1] ?? "Archive"}</span><p>{media.caption}</p></article>)}</div>{!filteredMedia.length ? <p className="empty-state">No verified media has been added to this chapter yet.</p> : null}</section>

    {lightbox ? <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={lightbox.alt} onClick={() => setLightbox(undefined)}><button type="button" onClick={() => setLightbox(undefined)} aria-label="Close media lightbox">×</button><img src={lightbox.src} alt={lightbox.alt}/><p>{lightbox.caption}</p></div> : null}
  </>;
}
