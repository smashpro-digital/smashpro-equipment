import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { Equipment, GalleryGroup, GalleryImage } from "../types/equipment";
import { calculatePackages, calculatePassportScores } from "../domain/passport";
import { WindowSticker } from "./WindowSticker";
import { PartnerFieldSupport } from "./PartnerFieldSupport";
import "../styles/ardhi-passport-v2.css";

const image = (name: string) => `/equipment/images/${name}`;
type ArchiveChapter = "factory-build" | "finished-machine" | "export-journey" | "delivery" | "operation" | "maintenance";
const chapters: Array<{
  id: ArchiveChapter;
  label: string;
  groups: GalleryGroup[];
  timelineId: string;
}> = [
  {
    id: "factory-build",
    label: "Factory Build",
    groups: ["factory", "assembly", "hydraulics", "testing"],
    timelineId: "production-started",
  },
  {
    id: "finished-machine",
    label: "Finished Machine",
    groups: ["completed-machine", "branding"],
    timelineId: "production-complete",
  },
  {
    id: "export-journey",
    label: "Export Journey",
    groups: ["export", "shipping"],
    timelineId: "factory-departure",
  },
  {
    id: "delivery",
    label: "Delivery",
    groups: ["arrival", "commissioning"],
    timelineId: "future-5",
  },
  {
    id: "operation",
    label: "Operation",
    groups: ["jobs"],
    timelineId: "future-10",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    groups: ["maintenance"],
    timelineId: "future-15",
  },
];
const chapterForGroup = (group?: GalleryGroup) => chapters.find((chapter) => group && chapter.groups.includes(group));

type HistoryRecord = {
  id: string;
  date: string;
  title: string;
  status: "documented" | "current" | "future";
  narrative: string;
  decision?: string;
  technical?: string;
  supplier?: string;
  payment?: string;
  photos?: string[];
  videos?: string[];
  documents?: number;
  attachments?: string[];
};
const history: HistoryRecord[] = [
  {
    id: "fleet-vision",
    date: "Planning period",
    title: "Fleet Vision Created",
    status: "documented",
    narrative: "The first flagship machine was defined as a permanent fleet asset with a public history, not a disposable equipment listing.",
    decision: "Create one durable record that can follow the machine through acquisition, work, maintenance, and retirement.",
  },
  {
    id: "supplier-research",
    date: "Planning period",
    title: "Supplier Research",
    status: "documented",
    narrative: "Manufacturers and configurations were compared against the work SmashPro expects the machine to perform.",
    supplier: "Selection evidence remains in the private procurement record.",
  },
  {
    id: "manufacturer-selected",
    date: "Before Jul 15, 2026",
    title: "Manufacturer Selected",
    status: "documented",
    narrative: "Shandong Infront Machinery Group was selected to build the YF380 platform.",
    supplier: "Shandong Infront Machinery Group",
  },
  {
    id: "procurement-opened",
    date: "Jul 15, 2026",
    title: "Alibaba Procurement Opened",
    status: "documented",
    narrative: "The supplier created two linked Alibaba order groups to support staged payments for one SP-ARDHI-26 acquisition.",
    decision: "Use an intentional split-order structure for payment flexibility without treating the records as separate machines.",
    documents: 2,
  },
  {
    id: "invoice-approved",
    date: "Jul 16, 2026",
    title: "Configuration and Proforma Invoice Approved",
    status: "documented",
    narrative: "Signed proforma invoice YF260716 established the YF380 configuration, Runtong 739 cc EPA gasoline engine, 23 HP, included bucket, tools, spares, pallet forks, green finish, SmashPro decals, export crate, and transportation.",
    technical: "$3,990 DDP commercial baseline · 30% deposit / 70% before shipment · factory warranty: 1 year or 1,000 hours",
    documents: 1,
  },
  {
    id: "payment-one",
    date: "Jul 16, 2026",
    title: "First Staged Acquisition Payment",
    status: "documented",
    narrative: "The first staged procurement payment was completed through the marketplace.",
    payment: "$1,000 completed",
  },
  {
    id: "payment-two",
    date: "Jul 23, 2026",
    title: "Second Staged Acquisition Payment",
    status: "documented",
    narrative: "The second stage completed the first intentionally split payment group for the same machine acquisition.",
    payment: "$990 completed",
  },
  {
    id: "identity-approved",
    date: "Jul–Aug 2026",
    title: "Machine Identity Approved",
    status: "documented",
    narrative: "The factory model remains YF380 while SP-ARDHI-26 becomes the permanent SmashPro fleet identity.",
    decision: "Preserve manufacturer traceability and establish a stable fleet record.",
  },
  {
    id: "branding-approved",
    date: "Jul–Aug 2026",
    title: "Branding Approved",
    status: "documented",
    narrative: "SmashPro green and machine-specific branding were approved for the factory build.",
    photos: [image("sp-ardhi-26-control-panel.jpg")],
  },
  {
    id: "hydraulic-upgrade",
    date: "Jul–Aug 2026",
    title: "Hydraulic Upgrade Approved",
    status: "documented",
    narrative: "The build was upgraded to a three-pump, three-valve hydraulic configuration.",
    decision: "Improve simultaneous function control and support the future attachment strategy.",
    photos: [image("sp-ardhi-26-hydraulic-system-installation.jpg")],
  },
  {
    id: "attachment-strategy",
    date: "Jul–Aug 2026",
    title: "Attachment Strategy Finalized",
    status: "documented",
    narrative: "The initial package was centered on the general-purpose bucket and branded pallet forks, with future hydraulic attachments reserved as later chapters.",
    attachments: ["General-purpose bucket", "Branded pallet forks"],
  },
  {
    id: "payment-three",
    date: "Aug 6, 2026",
    title: "Third Staged Acquisition Payment",
    status: "documented",
    narrative: "The third public payment stage opened the second intentionally split payment group supporting the same SP-ARDHI-26 acquisition.",
    payment: "$1,000 completed",
  },
  {
    id: "production-started",
    date: "Build period · 2026",
    title: "Production Started",
    status: "documented",
    narrative: "Factory production began on the configured YF380 platform.",
    photos: [image("sp-ardhi-26-assembly-in-progress.jpg")],
  },
  {
    id: "hydraulics-installed",
    date: "Build period · 2026",
    title: "Hydraulics Installed",
    status: "documented",
    narrative: "The upgraded hydraulic system was installed and documented during assembly.",
    photos: [image("sp-ardhi-26-hydraulic-system-installation.jpg")],
  },
  {
    id: "branding-installed",
    date: "Build period · 2026",
    title: "Branding Installed",
    status: "documented",
    narrative: "Factory-applied SmashPro identity was documented on the completed machine and attachments.",
    photos: [image("sp-ardhi-26-bucket-branding.png"), image("sp-ardhi-26-control-panel.jpg")],
  },
  {
    id: "production-complete",
    date: "Aug 18, 2026",
    title: "Production Complete",
    status: "documented",
    narrative: "The finished RAL 6018 green and black machine was documented with its bucket and pallet forks.",
    photos: [image("sp-ardhi-26-completed-build-attachments.jpg")],
  },
  {
    id: "inspection",
    date: "Aug 2026",
    title: "Inspection",
    status: "documented",
    narrative: "Factory function and attachment testing were documented before export release.",
    videos: [image("sp-ardhi-26-factory-test.mp4"), image("sp-ardhi-26-pallet-fork-test.mp4")],
  },
  {
    id: "final-payment",
    date: "Aug 20, 2026",
    title: "Final Successful Payment",
    status: "documented",
    narrative: "The final public payment stage completed the second intentionally split payment group after configuration and completion evidence was reviewed.",
    decision: "Complete the final stage only after reviewing the available configuration and completion evidence.",
    payment: "$1,269 completed",
  },
  {
    id: "purchase-protection",
    date: "Aug 2026",
    title: "Marketplace Purchase Protection Documented",
    status: "documented",
    narrative: "Alibaba displayed the order as Covered, with one year of on-site service, free replacement parts, and service requests available after delivery.",
    technical: "Separate marketplace protection layer · possible failed-service platform compensation of 2% of product amount, up to $500 · does not replace the factory warranty",
    documents: 1,
  },
  {
    id: "freight-forwarder",
    date: "Sep 2, 2026",
    title: "Freight Forwarder",
    status: "documented",
    narrative: "The machine transferred from the factory into export logistics. Exact facility information remains private.",
    supplier: "Transfer complete",
  },
  {
    id: "export-crate",
    date: "Sep 2, 2026",
    title: "Export Crate",
    status: "documented",
    narrative: "The completed machine was sealed inside its export crate for international transport.",
    videos: [image("sp-ardhi-26-factory-departure-2026-09-02.mp4")],
  },
  {
    id: "factory-departure",
    date: "Sep 2, 2026",
    title: "Factory Departure",
    status: "documented",
    narrative: "The authentic departure record shows the crated SP-ARDHI-26 leaving on the truck.",
    videos: [image("sp-ardhi-26-factory-departure-2026-09-02.mp4")],
  },
  {
    id: "container-loaded",
    date: "Sep 2, 2026",
    title: "Container Loaded",
    status: "current",
    narrative: "SP-ARDHI-26 entered the ocean-export stage aboard EVER MAX, voyage 1374-016E.",
    technical: "Estimated departure: September 6, 2026. Estimated arrival: October 5, 2026.",
  },
  {
    id: "ocean-voyage",
    date: "Current stage",
    title: "Ocean Voyage",
    status: "current",
    narrative: "The shipping record names the planned vessel and voyage. This is logistics documentation, not live GPS tracking.",
    technical: "EVER MAX · Voyage 1374-016E",
  },
  ...["Ocean Departure", "Cross Pacific", "USA Arrival", "Customs", "Released", "Delivery", "Commissioning", "First Startup", "First Fuel", "First Attachment", "First Job", "10 Hours", "50 Hours", "100 Hours", "Annual Inspection"].map(
    (title, index): HistoryRecord => ({
      id: `future-${index}`,
      date: "Reserved record",
      title,
      status: "future",
      narrative: "This permanent slot is reserved for verified evidence when the milestone occurs.",
    }),
  ),
];
const historyPhaseStarts: Record<string, string> = {
  "fleet-vision": "Planning",
  "procurement-opened": "Procurement",
  "production-started": "Production",
  "freight-forwarder": "Export",
  "future-6": "Commissioning",
  "future-10": "Operation",
  "future-14": "Maintenance",
};

const linkedDecisions: Record<string, string> = {
  "identity-approved": "Keep the YF380 factory model for manufacturer traceability while giving the machine the permanent SP-ARDHI-26 fleet identity.",
  "branding-approved": "Choose the documented RAL 6018 fleet finish and preserve SmashPro identity on the machine and primary attachments.",
  "hydraulic-upgrade": "Approve the 3 Pump / 3 Valve configuration for smoother simultaneous control and a broader attachment plan.",
  "attachment-strategy": "Plan future attachments as verified chapters instead of claiming capability before installation and proof.",
  "final-payment": "Complete the final stage only after reviewing the available configuration and completion evidence.",
};
// Two linked Alibaba order groups supported staged payments for one SP-ARDHI-26 acquisition. The public stages are not presented as a reconciliation to the separate $3,990 signed proforma baseline.
const payments = [
  ["Jul 16 · First stage", "$1,000", "Completed"],
  ["Jul 23 · Second stage", "$990", "Completed"],
  ["Aug 6 · Third stage", "$1,000", "Completed"],
  ["Aug 20 · Final stage", "$1,269", "Completed"],
];
type MapStop = {
  id: string;
  label: string;
  marker: string;
  x: number;
  y: number;
  timelineId: string;
  title: string;
  status: "complete" | "current" | "future";
  image?: string;
  lines: readonly string[];
  highlights: readonly string[];
};
const mapStops: readonly MapStop[] = [
  {
    id: "china",
    label: "China",
    marker: "CN",
    x: 82,
    y: 25,
    timelineId: "production-complete",
    title: "Factory origin",
    status: "complete",
    image: image("sp-ardhi-26-factory-assembly-floor.jpg"),
    lines: ["Shandong Infront Machinery Group", "Factory model · YF380", "Fleet identity · SP-ARDHI-26", "Production complete"],
    highlights: ["RAL 6018 finish", "SmashPro branding", "3 Pump / 3 Valve", "Bucket and branded pallet forks", "Inspection documented"],
  },
  {
    id: "forwarder",
    label: "Freight Forwarder",
    marker: "BOX",
    x: 72,
    y: 42,
    timelineId: "freight-forwarder",
    title: "Export transfer",
    status: "complete",
    image: image("sp-ardhi-26-factory-departure-poster-2026-09-02.jpg"),
    lines: ["Transfer completed", "Export crate prepared", "Container loading documented", "Facility details withheld"],
    highlights: ["Departure video", "Pallet documentation", "Export record"],
  },
  {
    id: "pacific",
    label: "Pacific Ocean",
    marker: "SEA",
    x: 49,
    y: 40,
    timelineId: "ocean-voyage",
    title: "Ocean export",
    status: "current",
    lines: ["Vessel · EVER MAX", "Voyage · 1374-016E", "Estimated departure · Sep 6, 2026", "Estimated arrival · Oct 5, 2026"],
    highlights: ["Current documented stage", "Not live GPS"],
  },
  {
    id: "usa",
    label: "United States",
    marker: "US",
    x: 24,
    y: 31,
    timelineId: "future-2",
    title: "United States entry",
    status: "future",
    lines: ["Future · Port arrival", "Future · Customs", "Future · Release"],
    highlights: ["Exact port pending verified record"],
  },
  {
    id: "south-carolina",
    label: "South Carolina",
    marker: "SC",
    x: 29,
    y: 49,
    timelineId: "future-5",
    title: "Regional destination",
    status: "future",
    lines: ["Future · Delivery", "Future · Commissioning", "Future · First startup", "Future · First job"],
    highlights: ["Approximate region only", "Private address withheld"],
  },
  {
    id: "fleet",
    label: "SmashPro Fleet",
    marker: "HQ",
    x: 34,
    y: 57,
    timelineId: "future-6",
    title: "Lifetime fleet record",
    status: "future",
    lines: ["Commissioning", "Service hours", "Jobs", "Maintenance", "Retirement"],
    highlights: ["Permanent passport destination"],
  },
];

function daysBetween(from: string, to: Date) {
  return Math.max(0, Math.ceil((to.getTime() - new Date(`${from}T00:00:00Z`).getTime()) / 86_400_000));
}
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const started = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - started) / 900);
          setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return (
    <span ref={ref}>
      {shown.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ArdhiPassportJourney({ item }: { item: Equipment }) {
  const [activeStop, setActiveStop] = useState<MapStop>(mapStops[0]);
  const [expandedRecord, setExpandedRecord] = useState<string>();
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState<ArchiveChapter>("factory-build");
  const [lightbox, setLightbox] = useState<GalleryImage>();
  const [stickerOpen, setStickerOpen] = useState(false);
  const [pageProgress, setPageProgress] = useState(0);
  const historyRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const today = new Date();
  const daysSinceBuild = daysBetween("2026-08-18", today);
  const daysUntilArrival = Math.max(0, Math.ceil((new Date("2026-10-05T00:00:00Z").getTime() - today.getTime()) / 86_400_000));
  const selectedChapter = chapters.find(({ id }) => id === chapter) ?? chapters[0];
  const filteredMedia = useMemo(
    () =>
      item.gallery
        .filter((media) => {
          const text = `${media.alt} ${media.caption} ${media.group ?? ""}`.toLowerCase();
          return selectedChapter.groups.includes(media.group ?? "factory") && text.includes(query.trim().toLowerCase());
        })
        .sort((a, b) => (a.capturedAt ?? "").localeCompare(b.capturedAt ?? "")),
    [item.gallery, query, selectedChapter],
  );
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-passport-reveal]");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.14 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!stickerOpen && !lightbox) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStickerOpen(false);
        setLightbox(undefined);
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [stickerOpen, lightbox]);
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      setPageProgress(total > 0 ? Math.min(100, Math.round((scrollY / total) * 100)) : 0);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  const activateStop = (stop: MapStop, synchronize = false) => {
    setActiveStop(stop);
    if (!synchronize) return;
    const record = history.find(({ id }) => id === stop.timelineId);
    if (record) investigateRecord(record);
    requestAnimationFrame(() =>
      historyRefs.current[stop.timelineId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      }),
    );
  };
  const selectChapter = (next: ArchiveChapter) => {
    const selected = chapters.find(({ id }) => id === next) ?? chapters[0];
    setChapter(next);
    setExpandedRecord(selected.timelineId);
  };
  const investigateRecord = (record: HistoryRecord) => {
    setExpandedRecord(record.id);
    const stop = mapStops.find(({ timelineId }) => timelineId === record.id);
    if (stop) setActiveStop(stop);
    const futureIndex = record.id.startsWith("future-") ? Number(record.id.slice(7)) : -1;
    let nextChapter: ArchiveChapter | undefined;
    if (["production-started", "hydraulics-installed"].includes(record.id)) nextChapter = "factory-build";
    else if (["branding-installed", "production-complete", "inspection"].includes(record.id)) nextChapter = "finished-machine";
    else if (["freight-forwarder", "export-crate", "factory-departure", "container-loaded", "ocean-voyage"].includes(record.id) || (futureIndex >= 0 && futureIndex <= 4)) nextChapter = "export-journey";
    else if (futureIndex >= 5 && futureIndex <= 6) nextChapter = "delivery";
    else if (futureIndex >= 7 && futureIndex <= 13) nextChapter = "operation";
    else if (futureIndex >= 14) nextChapter = "maintenance";
    if (nextChapter) setChapter(nextChapter);
  };
  const packages = calculatePackages(item.upgrades, item.packageRules);
  const scores = calculatePassportScores(item);
  const passport = [
    ["Passport Number", "SP-ARDHI-26"],
    ["Factory Model", "YF380"],
    ["Fleet Class", "Mini Skid Loader"],
    ["Status", "Ocean Export"],
    ["Hydraulics", "3 Pump · 3 Valve"],
    ["Operating Weight", "880 kg"],
    ["Fuel", "30 L"],
    ["Engine", "23 HP"],
    ["Commissioning", "Pending"],
    ["Service Hours", "0.0"],
    ["Current Owner", "SmashPro Fleet"],
  ];
  return (
    <main className="ardhi-documentary">
      <section className="ardhi-v2-hero" aria-labelledby="ardhi-v2-title">
        <img src={item.heroImage} alt="SP-ARDHI-26 completed flagship fleet machine" />
        <div className="ardhi-v2-hero__shade" />
        <div className="shell ardhi-v2-hero__copy">
          <p className="eyebrow">SP-ARDHI-26</p>
          <h1 id="ardhi-v2-title">
            SmashPro Flagship
            <br />
            Fleet Asset <span>#001</span>
          </h1>
          <p>
            Factory Complete <b>·</b> Ocean Export <b>·</b> Current Vessel: EVER MAX
          </p>
          <div className="ardhi-v2-hero__actions">
            <a href="#passport-ledger-title">View Passport</a>
            <a href="#journey-map-title">Track Journey</a>
            <a href="#ardhi-history-title">Explore History</a>
            <a href="#document-library-title">View Documents</a>
          </div>
        </div>
      </section>
      <nav className="passport-rail" aria-label="Equipment passport chapters">
        <div className="shell">
          <strong>Equipment Passport</strong>
          <a href="#passport-ledger-title">Passport</a>
          <a href="#journey-map-title">Journey Map</a>
          <a href="#ardhi-history-title">Historical Timeline</a>
          <a href="#service-record">Service Records</a>
        </div>
      </nav>
      <aside className="mini-passport" aria-label={`SP-ARDHI-26 reading progress ${pageProgress}%`}>
        <div>
          <strong>SP-ARDHI-26</strong>
          <span>Ocean Transit · EVER MAX</span>
        </div>
        <b>2 / 7</b>
        <i style={{ width: `${pageProgress}%` }} />
      </aside>
      <section className="section shell ardhi-passport-ledger passport-reveal" id="identity" data-passport-reveal aria-labelledby="passport-ledger-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Equipment Passport</p>
            <h2 id="passport-ledger-title">Identity, specifications, and official records.</h2>
          </div>
          <p>Everything needed to identify and verify SP-ARDHI-26 in the first two minutes.</p>
        </div>
        <dl>
          {passport.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="ardhi-overview-grid" id="overview-title">
          <article>
            <img src={item.heroImage} alt="SP-ARDHI-26 official hero view" loading="lazy" decoding="async" />
            <span>Official Hero Image</span>
            <h3>Machine portrait</h3>
            <a href={item.heroImage} target="_blank" rel="noopener noreferrer">
              View full size
            </a>
          </article>
          <article className="document-card">
            <img src={image("sp-ardhi-26-yf380-manufacturer-preview.png")} alt="First-page preview of the YF380 manufacturer specification PDF" loading="lazy" decoding="async" />
            <span>Manufacturer PDF</span>
            <h3>YF380 Specification Sheet</h3>
            <p>Shandong Infront Machinery Group Co., Ltd.</p>
            <dl>
              <div>
                <dt>File size</dt>
                <dd>1.16 MB</dd>
              </div>
              <div>
                <dt>Pages</dt>
                <dd>1</dd>
              </div>
              <div>
                <dt>File type</dt>
                <dd>PDF</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>Aug 16, 2026</dd>
              </div>
            </dl>
            <div>
              <a href={item.documents[0]?.url} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
              <a href={item.documents[0]?.url} download={item.documents[0]?.downloadName}>
                Download PDF
              </a>
            </div>
          </article>
        </div>
        <div className="overview-sticker-intro">
          <div>
            <span>Passport document</span>
            <h3>Official Window Sticker</h3>
            <p>Open the machine's printable identity document, then print or download it as PNG or PDF.</p>
          </div>
          <div>
            <button type="button" onClick={() => setStickerOpen(true)}>
              Open Document
            </button>
          </div>
        </div>
      </section>
      {stickerOpen ? (
        <div className="passport-drawer-backdrop" role="presentation" onMouseDown={() => setStickerOpen(false)}>
          <aside className="passport-drawer" role="dialog" aria-modal="true" aria-label="SP-ARDHI-26 window sticker" onMouseDown={(event) => event.stopPropagation()}>
            <button className="passport-drawer__close" type="button" onClick={() => setStickerOpen(false)} aria-label="Close window sticker">
              ×
            </button>
            <WindowSticker item={item} packages={packages} scores={scores} compact />
          </aside>
        </div>
      ) : null}
      <section className={`section shell ardhi-document-library passport-reveal ${history.find(({ id }) => id === expandedRecord)?.documents ? "is-linked" : ""}`} data-passport-reveal aria-labelledby="document-library-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Document Library</p>
            <h2 id="document-library-title">Records that stay with the machine.</h2>
          </div>
          <p>Verified files are available now. Awaiting-verification cards preserve the record structure without claiming documents that have not arrived.</p>
        </div>
        <div>
          <article className="is-available">
            <img src={item.heroImage} alt="SP-ARDHI-26 equipment passport cover" loading="lazy" decoding="async" />
            <span>Living record</span>
            <h3>Equipment Passport</h3>
            <p>Permanent identity, configuration, journey, service, work, and maintenance history.</p>
            <small>Updated Sep 2, 2026 · Web passport</small>
            <a href="#passport-ledger-title">Open Passport</a>
          </article>
          {["Operator Manual", "Maintenance Manual", "Parts Manual", "Bill of Lading", "Packing List", "Inspection Sheet"].map((title) => (
            <article className="is-reserved" key={title}>
              <div aria-hidden="true">
                <span>⌁</span> Awaiting Verification
              </div>
              <span>Pending public release</span>
              <h3>{title}</h3>
              <p>This slot activates when a verified public file enters the equipment record.</p>
              <small>Upon arrival · Status pending</small>
            </article>
          ))}
        </div>
      </section>
      <section className="section shell ardhi-live-status passport-reveal" data-passport-reveal aria-labelledby="live-status-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Live Equipment Status</p>
            <h2 id="live-status-title">Documented position in the journey.</h2>
          </div>
          <p>Logistics status only. No live GPS location is claimed or displayed.</p>
        </div>
        <div className="ardhi-status-grid">
          <article className="is-current">
            <span>Current Status</span>
            <strong>Container Loaded</strong>
            <small>Journey stage 2 of 7</small>
          </article>
          <article>
            <span>Current Vessel</span>
            <strong>EVER MAX</strong>
            <small>Voyage 1374-016E</small>
          </article>
          <article>
            <span>Estimated Arrival</span>
            <strong>October 5</strong>
            <small>2026 estimate</small>
          </article>
          <article>
            <span>Days Since Production</span>
            <strong>
              <AnimatedNumber value={daysSinceBuild} />
            </strong>
            <small>Since Aug 18, 2026</small>
          </article>
          <article>
            <span>Estimated Days Remaining</span>
            <strong>
              <AnimatedNumber value={daysUntilArrival} />
            </strong>
            <small>Schedule estimate</small>
          </article>
          <article>
            <span>Approximate Journey Distance</span>
            <strong>
              <AnimatedNumber value={7300} suffix=" mi" />
            </strong>
            <small>Regional route estimate · not GPS</small>
          </article>
        </div>
      </section>
      <section className="ardhi-map-section passport-reveal" data-passport-reveal aria-labelledby="journey-map-title">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Interactive Expedition Journey</p>
              <h2 id="journey-map-title">From factory floor to fleet.</h2>
            </div>
            <p>Select a regional stop to inspect its record. Click it to synchronize with the historical timeline.</p>
          </div>
          <div className="ardhi-map-layout">
            <div className="ardhi-map" role="group" aria-label="Approximate journey map from China across the Pacific to South Carolina">
              <svg viewBox="0 0 100 64" role="img" aria-label="Regional route only; no private coordinates">
                <path className="ardhi-map__land" d="M7 10l22-6 18 9-7 13-14 1-7 13-12-6zm52-5 15-4 21 10-4 16-16 7-8 19-11-11 7-16z" />
                <path className="ardhi-map__route" d="M82 25 C75 32 67 38 49 40 S31 33 24 31 L29 49 L34 57" />
                <g className="ardhi-map__ship" aria-hidden="true">
                  <circle r="2.2" />
                  <text y="-3">EVER MAX</text>
                </g>
                {mapStops.map((stop) => (
                  <g
                    key={stop.id}
                    className={`${activeStop.id === stop.id ? "is-active" : ""} is-${stop.status}`}
                    transform={`translate(${stop.x} ${stop.y})`}
                    onMouseEnter={() => activateStop(stop)}
                    onFocus={() => activateStop(stop)}
                    onClick={() => activateStop(stop, true)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        activateStop(stop, true);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open and synchronize ${stop.label} journey details`}
                  >
                    <circle r="3.7" />
                    <text y="1.2">{stop.marker}</text>
                    <text className="ardhi-map__label" y="7">
                      {stop.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <aside className="ardhi-map-card" aria-live="polite">
              {activeStop.image ? <img src={activeStop.image} alt={`Authentic project media for ${activeStop.label}`} loading="lazy" decoding="async" /> : <span className="ardhi-map-card__flag">{activeStop.marker}</span>}
              <p className="eyebrow">{activeStop.label}</p>
              <h3>{activeStop.title}</h3>
              <ul>
                {activeStop.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="map-highlights">
                {activeStop.highlights.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
              <button type="button" onClick={() => activateStop(activeStop, true)}>
                Open matching history record
              </button>
            </aside>
          </div>
        </div>
      </section>
      <section className="section shell ardhi-journey-stats passport-reveal" data-passport-reveal aria-labelledby="journey-stats-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Journey Statistics</p>
            <h2 id="journey-stats-title">The record moves with the machine.</h2>
          </div>
          <p>Figures animate once when they enter view. Distance is approximate and does not represent live tracking.</p>
        </div>
        <div className="ardhi-counter-grid">
          <article>
            <span>Approximate distance</span>
            <strong>
              <AnimatedNumber value={7300} suffix=" mi" />
            </strong>
          </article>
          <article>
            <span>Operating weight</span>
            <strong>
              <AnimatedNumber value={880} suffix=" kg" />
            </strong>
          </article>
          <article>
            <span>Fuel capacity</span>
            <strong>
              <AnimatedNumber value={30} suffix=" L" />
            </strong>
          </article>
          <article>
            <span>Days since build</span>
            <strong>
              <AnimatedNumber value={daysSinceBuild} />
            </strong>
          </article>
        </div>
        <div className="journey-progress" aria-label="Factory and export complete; ocean current; United States and delivery pending">
          {[
            ["Factory", 100],
            ["Export", 100],
            ["Ocean", 12],
            ["USA", 0],
            ["Delivery", 0],
          ].map(([label, value], index) => (
            <div
              style={
                {
                  "--progress-delay": `${index * 100}ms`,
                } as React.CSSProperties
              }
              key={String(label)}
            >
              <span>{label}</span>
              <i>
                <b style={{ width: `${value}%` }} />
              </i>
              <small>{Number(value) === 100 ? "complete" : Number(value) ? "current" : "pending"}</small>
            </div>
          ))}
        </div>
      </section>
      <section className="timeline-section ardhi-history passport-reveal" data-passport-reveal aria-labelledby="ardhi-history-title">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Permanent Historical Record</p>
              <h2 id="ardhi-history-title">Every event keeps its evidence and reason.</h2>
            </div>
            <p>Expand any entry for narrative, decisions, media, supplier notes, technical notes, payments, attachments, and document counts.</p>
          </div>
          <ol className="ardhi-expandable-timeline">
            {history.map((record) => (
              <Fragment key={record.id}>
                {historyPhaseStarts[record.id] ? (
                  <li className="history-phase">
                    <span>{historyPhaseStarts[record.id]}</span>
                    <i aria-hidden="true">↓</i>
                  </li>
                ) : null}
                <li
                  ref={(node) => {
                    historyRefs.current[record.id] = node;
                  }}
                  id={`history-${record.id}`}
                  className={`is-${record.status} ${expandedRecord === record.id ? "is-highlighted" : ""}`}
                >
                  <details
                    open={expandedRecord === record.id}
                    onToggle={(event) => {
                      if (event.currentTarget.open) setExpandedRecord(record.id);
                      else if (expandedRecord === record.id) setExpandedRecord(undefined);
                    }}
                  >
                    <summary onClick={() => investigateRecord(record)}>
                      <span>{record.date}</span>
                      <strong>{record.title}</strong>
                      <em>
                        {record.status} · {(record.photos?.length ?? 0) + (record.videos?.length ?? 0)} media · {record.documents ?? 0} documents
                      </em>
                    </summary>
                    <div className="history-detail">
                      <p>{record.narrative}</p>
                      {record.decision || linkedDecisions[record.id] ? (
                        <aside>
                          <b>Decision</b>
                          <p>{record.decision ?? linkedDecisions[record.id]}</p>
                        </aside>
                      ) : null}
                      <div className="history-notes">
                        {record.supplier ? (
                          <p>
                            <b>Supplier notes</b>
                            {record.supplier}
                          </p>
                        ) : null}
                        {record.technical ? (
                          <p>
                            <b>Technical notes</b>
                            {record.technical}
                          </p>
                        ) : null}
                        {record.payment ? (
                          <p>
                            <b>Payment history</b>
                            {record.payment}
                          </p>
                        ) : null}
                        {record.attachments?.length ? (
                          <p>
                            <b>Attachments</b>
                            {record.attachments.join(" · ")}
                          </p>
                        ) : null}
                      </div>
                      {record.photos?.length ? (
                        <div className="history-media">
                          {record.photos.map((src) => (
                            <img key={src} src={src} alt={`Authentic evidence for ${record.title}`} loading="lazy" decoding="async" />
                          ))}
                        </div>
                      ) : null}
                      {record.videos?.length ? (
                        <div className="history-media">
                          {record.videos.map((src) => (
                            <video key={src} controls preload="metadata" poster={image("sp-ardhi-26-factory-departure-poster-2026-09-02.jpg")}>
                              <source src={src} type="video/mp4" />
                            </video>
                          ))}
                        </div>
                      ) : null}
                      <dl>
                        <div>
                          <dt>Media</dt>
                          <dd>{(record.photos?.length ?? 0) + (record.videos?.length ?? 0)}</dd>
                        </div>
                        <div>
                          <dt>Documents</dt>
                          <dd>{record.documents ?? 0}</dd>
                        </div>
                        <div>
                          <dt>Status</dt>
                          <dd>{record.status}</dd>
                        </div>
                        <div>
                          <dt>Specifications</dt>
                          <dd>{record.status === "future" ? "Pending" : item.specifications.length}</dd>
                        </div>
                      </dl>
                    </div>
                  </details>
                </li>
              </Fragment>
            ))}
          </ol>
        </div>
      </section>
      <section className="ardhi-payment-section passport-reveal" data-passport-reveal aria-labelledby="payments-title">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Payment History</p>
              <h2 id="payments-title">Acquisition milestones, documented.</h2>
            </div>
            <p>Public staged-payment summary only. Order identifiers, payment instruments, processing fees, addresses, and private accounting remain protected.</p>
          </div>
          <div className="payment-total">
            <span>Documented marketplace stages</span>
            <strong>$4,259</strong>
            <small>Two intentional payment groups for one machine · separate from the $3,990 signed proforma baseline</small>
          </div>
          <ol>
            {payments.map(([title, value, status], index) => (
              <li className={status === "Completed" ? "is-complete" : "is-pending"} key={title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{value}</p>
                </div>
                <small>{status}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section shell ardhi-archive passport-reveal" data-passport-reveal aria-labelledby="archive-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated Historical Archive</p>
            <h2 id="archive-title">Follow the machine's story.</h2>
          </div>
          <p>Each authentic asset has one primary home. Timeline entries reference the record without repeating media.</p>
        </div>
        <nav className="archive-chapters" aria-label="SP-ARDHI-26 historical chapters">
          {chapters.map(({ id, label }, index) => (
            <button type="button" className={chapter === id ? "is-active" : ""} aria-pressed={chapter === id} onClick={() => selectChapter(id)} key={id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </button>
          ))}
        </nav>
        <>
          <div className="archive-tools">
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${selectedChapter.label}`} aria-label={`Search ${selectedChapter.label} media`} />
          </div>
          <div className="archive-grid">
            {filteredMedia.map((media) => (
              <article key={media.src} className={media.kind === "video" ? "is-video" : undefined}>
                {media.kind === "video" ? (
                  <div className="archive-video">
                    <video controls preload="metadata" poster={media.poster}>
                      <source src={media.src} type="video/mp4" />
                    </video>
                    <span className="archive-play" aria-hidden="true">
                      ▶
                    </span>
                    <i aria-hidden="true">
                      <b />
                    </i>
                  </div>
                ) : (
                  <button type="button" onClick={() => setLightbox(media)} aria-label={`Enlarge ${media.alt}`}>
                    <img src={media.src} alt={media.alt} loading="lazy" decoding="async" />
                  </button>
                )}
                <div className="archive-caption">
                  <span>{chapterForGroup(media.group)?.label ?? selectedChapter.label}</span>
                  <p>{media.caption}</p>
                  <small>
                    {media.capturedAt ? `Captured ${media.capturedAt}` : "Verified project media"}
                    {media.kind === "video" ? " · Video" : " · Image"}
                  </small>
                </div>
              </article>
            ))}
          </div>
          {!filteredMedia.length ? <p className="empty-state">No verified media has been added to this chapter yet.</p> : null}
        </>
      </section>
      <PartnerFieldSupport partners={item.partners} />
      <section className="section shell ardhi-service-record passport-reveal" id="service-record" data-passport-reveal aria-labelledby="service-record-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Future Record</p>
            <h2 id="service-record-title">Service and operational history.</h2>
          </div>
          <p>Commissioning, jobs, operating hours, inspections, attachments, and maintenance will accumulate here as verified events in this same passport.</p>
        </div>
        <div className="service-record-status">
          <span>Current state</span>
          <strong>Awaiting commissioning</strong>
          <small>0.0 verified service hours</small>
        </div>
      </section>
      {lightbox ? (
        <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={lightbox.alt} onClick={() => setLightbox(undefined)}>
          <button type="button" onClick={() => setLightbox(undefined)} aria-label="Close media lightbox">
            ×
          </button>
          <img src={lightbox.src} alt={lightbox.alt} />
          <p>{lightbox.caption}</p>
        </div>
      ) : null}
    </main>
  );
}
