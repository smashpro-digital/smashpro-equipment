import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Equipment, GalleryGroup, GalleryImage } from "../types/equipment";
import { calculatePackages, calculatePassportScores } from "../domain/passport";
import { WindowSticker } from "./WindowSticker";
import { PartnerFieldSupport } from "./PartnerFieldSupport";
import { ShipmentJourney } from "./ShipmentJourney";
import { useShipment } from "../hooks/useShipment";
import { stageText } from "../domain/shipment";
import { PassportHero } from "./PassportHero";
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
  outcome?: string;
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
    supplier: "Factory conversation confirmed the upgraded three-pump, three-valve configuration during production.",
    outcome: "The completed machine was documented with the upgraded hydraulic system installed for future powered attachments.",
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
    id: "grapple-ordered",
    date: "Sep 9, 2026",
    title: "Loflin Root Grapple Build Ordered",
    status: "current",
    narrative: "SmashPro placed the order for the 42-inch Loflin Mini Root Grapple through HighWay Attachments. The attachment is in the vendor build cycle and is not yet installed or available for customer work.",
    decision: "Advance the selected U.S.-built grapple into production while preserving delivery, physical fitment, hydraulic commissioning, and service-release gates.",
    supplier: "Loflin Fabrication · retail order through HighWay Attachments, Denton, NC",
    payment: "$297 deposit completed · $2,000 balance due on build completion",
    documents: 1,
    outcome: "Quoted lead time is 4–6 weeks, producing an approximate October 7–21 build-completion planning window. Fabrication and completion photos have been requested.",
  },
  ...["Ocean Departure", "Cross Pacific", "USA Arrival", "Customs", "Released", "Delivery", "Commissioning", "First Startup", "First Fuel", "First Attachment", "First Job", "10 Hours", "50 Hours", "100 Hours", "Annual Inspection"].map(
    (title, index): HistoryRecord => ({
      id: `future-${index}`,
      date: "Reserved record",
      title,
      status: "future",
      narrative: "This permanent slot is reserved for verified evidence when the milestone occurs.",
    }),
  ).filter((_, index) => index >= 6),
];
const historyPhaseStarts: Record<string, string> = {
  "fleet-vision": "Planning",
  "procurement-opened": "Procurement",
  "production-started": "Production",
  "freight-forwarder": "Export",
  "grapple-ordered": "Attachment Build",
  "future-6": "Commissioning",
  "future-10": "Operation",
  "future-14": "Maintenance",
};
const historyPhaseByRecord = history.reduce<Record<string, string>>((phases, record) => {
  const phase = historyPhaseStarts[record.id] ?? phases.__current;
  phases[record.id] = phase;
  phases.__current = phase;
  return phases;
}, {});

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
export function ArdhiPassportJourney({ item }: { item: Equipment }) {
  const shipment = useShipment();
  const [expandedRecord, setExpandedRecord] = useState<string>();
  const [collapsedHistoryPhases, setCollapsedHistoryPhases] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState<ArchiveChapter>("factory-build");
  const [lightbox, setLightbox] = useState<GalleryImage>();
  const [stickerOpen, setStickerOpen] = useState(false);
  const [stickerZoom, setStickerZoom] = useState(1);
  const [pendingStickerAction, setPendingStickerAction] = useState<"png" | "pdf">();
  const [pageProgress, setPageProgress] = useState(0);
  const [nowViewing, setNowViewing] = useState(["Passport", "Identity", "SP-ARDHI-26"]);
  const historyRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const stickerModalRef = useRef<HTMLDivElement>(null);
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
            const view = (entry.target as HTMLElement).dataset.view;
            if (view) setNowViewing(view.split("|"));
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.14 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!lightbox) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(undefined);
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [lightbox]);
  useEffect(() => {
    if (!stickerOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const modal = stickerModalRef.current;
    requestAnimationFrame(() => modal?.querySelector<HTMLElement>("button")?.focus());
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setStickerOpen(false); return; }
      if (event.key !== "Tab" || !modal) return;
      const controls = Array.from(modal.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')).filter((control) => !control.hasAttribute("disabled"));
      if (!controls.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previousFocus?.focus(); };
  }, [stickerOpen]);
  useEffect(() => {
    if (!stickerOpen || !pendingStickerAction) return;
    const frame = requestAnimationFrame(() => {
      const sticker = stickerModalRef.current?.querySelector<HTMLElement>("[data-window-sticker-certificate]");
      if (pendingStickerAction === "png" && sticker) void toPng(sticker, { cacheBust: true, pixelRatio: 2, backgroundColor: "#ffffff" }).then((dataUrl) => { const link = document.createElement("a"); link.download = `${item.fleetId}-window-sticker.png`; link.href = dataUrl; link.click(); });
      if (pendingStickerAction === "pdf") window.print();
      setPendingStickerAction(undefined);
    });
    return () => cancelAnimationFrame(frame);
  }, [item.fleetId, pendingStickerAction, stickerOpen]);
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      setPageProgress(total > 0 ? Math.min(100, Math.round((scrollY / total) * 100)) : 0);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-view]");
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(({ isIntersecting }) => isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const view = (visible?.target as HTMLElement | undefined)?.dataset.view;
      if (view) setNowViewing(view.split("|"));
    }, { threshold: [0.25, 0.5, 0.75] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const selectChapter = (next: ArchiveChapter) => {
    const selected = chapters.find(({ id }) => id === next) ?? chapters[0];
    setChapter(next);
    setExpandedRecord(selected.timelineId);
  };
  const investigateRecord = (record: HistoryRecord) => {
    setExpandedRecord(record.id);
    const recordIndex = history.findIndex(({ id }) => id === record.id);
    const phaseEntry = history.slice(0, recordIndex + 1).reverse().find(({ id }) => historyPhaseStarts[id]);
    setNowViewing(["History", phaseEntry ? historyPhaseStarts[phaseEntry.id] : "Record", record.title]);
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
  const toggleHistoryPhase = (phase: string) => {
    setCollapsedHistoryPhases((current) => {
      const next = new Set(current);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };
  useEffect(() => {
    const openLinkedRecord = () => {
      const match = window.location.hash.match(/^#history-(.+)$/);
      if (!match) return;
      const record = history.find(({ id }) => id === match[1]);
      if (!record) return;
      const phase = historyPhaseByRecord[record.id];
      setCollapsedHistoryPhases((current) => {
        if (!current.has(phase)) return current;
        const next = new Set(current);
        next.delete(phase);
        return next;
      });
      investigateRecord(record);
      requestAnimationFrame(() => historyRefs.current[record.id]?.scrollIntoView({ behavior: "smooth", block: "center" }));
    };
    const collapseExpandedRecord = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpandedRecord(undefined);
    };
    openLinkedRecord();
    window.addEventListener("hashchange", openLinkedRecord);
    document.addEventListener("keydown", collapseExpandedRecord);
    return () => {
      window.removeEventListener("hashchange", openLinkedRecord);
      document.removeEventListener("keydown", collapseExpandedRecord);
    };
  }, []);
  const packages = calculatePackages(item.upgrades, item.packageRules);
  const scores = calculatePassportScores(item);
  const scrollToRecord = (id: string, viewing: string[]) => {
    setNowViewing(viewing);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const openSticker = (action?: "png" | "pdf") => { setStickerZoom(1); setStickerOpen(true); setPendingStickerAction(action); };
  const assetStatus = [
    ["Passport", item.identity.model],
    ["Factory Model", item.identity.factoryModel],
    ["Service Hours", "0.0"],
    ["Status", stageText(shipment)],
    ["Vessel", shipment.data?.vessel?.name ?? "Awaiting verification"],
    ["ETA", shipment.data?.eta ?? "Awaiting confirmation"],
    ["Fleet Asset", "#001"],
  ];
  const specificationGroups = Object.entries(
    item.specifications.reduce<Record<string, typeof item.specifications>>((groups, specification) => {
      (groups[specification.group ?? "General"] ??= []).push(specification);
      return groups;
    }, {}),
  );
  return (
    <div className="ardhi-documentary">
      <PassportHero titleId="ardhi-v2-title" image={item.heroImage} alt="SP-ARDHI-26 completed flagship fleet machine">
          <p className="eyebrow">SP-ARDHI-26</p>
          <h1 id="ardhi-v2-title">
            SmashPro Flagship
            <br />
            Fleet Asset <span>#001</span>
          </h1>
          <p>
            Factory Complete <b>·</b> {stageText(shipment)}
          </p>
          <div className="ardhi-v2-hero__actions">
            <a href="#passport" onClick={() => setNowViewing(["Passport", "Identity", "SP-ARDHI-26"])}>📘 Passport</a>
            <a href="#journey" onClick={() => setNowViewing(["Journey", "Shipment record", stageText(shipment)])}>🌎 Journey</a>
            <a href="#history" onClick={() => setNowViewing(["History", "Export", "Factory departure"])}>📜 History</a>
            <a href="#service" onClick={() => setNowViewing(["Service", "Future Record", "Awaiting commissioning"])}>🛠 Service</a>
          </div>
      </PassportHero>
      <nav className="passport-rail" aria-label="Equipment passport chapters">
        <div className="shell">
          <a href="#passport" onClick={() => setNowViewing(["Passport", "Identity", "SP-ARDHI-26"])}>Passport</a>
          <a href="#journey" onClick={() => setNowViewing(["Journey", "Shipment record", stageText(shipment)])}>Journey</a>
          <a href="#history" onClick={() => setNowViewing(["History", "Export", "Factory departure"])}>History</a>
          <a href="#service" onClick={() => setNowViewing(["Service", "Future Record", "Awaiting commissioning"])}>Service</a>
        </div>
      </nav>
      <aside className="mini-passport" aria-label={`SP-ARDHI-26 reading progress ${pageProgress}%`}>
        <div>
          <strong>SP-ARDHI-26</strong>
          <span>{stageText(shipment)}</span>
        </div>
        <b>2 / 7</b>
        <i style={{ width: `${pageProgress}%` }} />
      </aside>
      <div className="now-viewing" aria-live="polite"><span>Now Viewing</span><strong>SP-ARDHI-26</strong>{nowViewing.map((part) => <span key={part}>→ {part}</span>)}</div>
      <section className="section shell ardhi-passport-ledger passport-reveal" id="passport" data-passport-reveal data-view="Passport|Identity|SP-ARDHI-26" aria-labelledby="passport-ledger-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Equipment Passport</p>
            <h2 id="passport-ledger-title">Identity and current operating status.</h2>
          </div>
          <p>Everything needed to identify and verify SP-ARDHI-26 in the first two minutes.</p>
        </div>
        <dl className="asset-status-ribbon" aria-label="Asset status ribbon">
          {assetStatus.map(([label, value]) => (
            <div className={label === "Status" ? "is-active" : undefined} key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <section className="sticker-document-reference" aria-labelledby="window-sticker-card-title">
          <div><span aria-hidden="true">🏷</span><p className="eyebrow">Official Equipment Window Sticker</p><h3 id="window-sticker-card-title">SP-ARDHI-26</h3><p>Fleet Asset #001 · Official configuration record</p><dl><div><dt>Current Status</dt><dd>{item.statusLabel}</dd></div><div><dt>Last Updated</dt><dd>September 2026</dd></div></dl></div>
          <div className="sticker-document-actions"><button type="button" onClick={() => openSticker()}>View Full Sticker</button><button type="button" onClick={() => openSticker("png")}>Download PNG</button><button type="button" onClick={() => openSticker("pdf")}>Download PDF</button></div>
        </section>
        <div className="ardhi-overview-grid" id="overview-title">
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
        <details className="passport-specifications" id="specifications">
          <summary><span>Specifications</span><strong>{item.specifications.length + 3} verified asset fields</strong></summary>
          <div className="passport-specifications__groups">
            <section>
              <h3>Operational Record</h3>
              <dl>
                <div><dt>Current owner</dt><dd>SmashPro Fleet</dd></div>
                <div><dt>Commissioning</dt><dd>Pending</dd></div>
                <div><dt>Service hours</dt><dd>0.0 verified hours</dd></div>
              </dl>
            </section>
            {specificationGroups.map(([group, specifications]) => (
              <section key={group}>
                <h3>{group}</h3>
                <dl>
                  {specifications.map((specification) => (
                    <div key={`${group}-${specification.label}`}><dt>{specification.label}</dt><dd>{specification.value}</dd></div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </details>
      </section>
      <section className={`section shell ardhi-document-library passport-reveal ${history.find(({ id }) => id === expandedRecord)?.documents ? "is-linked" : ""}`} id="documents" data-passport-reveal data-view="Documents|Library|Verification records" aria-labelledby="document-library-title">
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
            <span className="document-status is-verified">Verified</span>
            <h3>Equipment Passport</h3>
            <p>Permanent identity, configuration, journey, service, work, and maintenance history.</p>
            <small>Updated Sep 2, 2026 · Web passport</small>
            <a href="#passport-ledger-title">Open Passport</a>
          </article>
          <article className="is-available window-sticker-library-card">
            <img src={image("sp-ardhi-26-window-sticker-preview.png")} alt="Preview of the official SP-ARDHI-26 equipment window sticker" loading="lazy" decoding="async" />
            <span className="document-status is-verified">Verified</span><h3>Equipment Window Sticker</h3><p>Permanent configuration and identity certificate for SP-ARDHI-26.</p><small>Updated September 2026 · PNG / PDF / Print</small><button type="button" onClick={() => openSticker()}>View Full Sticker</button>
          </article>
          {item.documents.filter(({ kind, publicDisplay, url }) => kind === "manual" && publicDisplay && url).map((document) => (
            <article className="is-available operator-manual-library-card" key={document.id}>
              <img src={image("sp-ardhi-26-operator-manual-loader-preview.png")} alt="Side-view line illustration of the mini loader from the verified operator manual" loading="lazy" decoding="async" />
              <span className="document-status is-verified">Verified</span>
              <h3>{document.title}</h3>
              <p>{document.description}</p>
              <small>Revision: {document.revision} · Source: {document.source} · Received: {document.dateReceived}</small>
              <div className="document-library-actions">
                <a href={document.url} target="_blank" rel="noopener noreferrer">View PDF</a>
                <a href={document.url} download={document.downloadName}>Download PDF</a>
              </div>
            </article>
          ))}
          {["Maintenance Manual", "Parts Manual", "Bill of Lading", "Packing List", "Inspection Sheet"].map((title, index) => (
            <article className="is-reserved" key={title}>
              <div aria-hidden="true">
                <span>⌁</span> Blueprint record
              </div>
              <span className="document-status is-pending">{index < 2 ? "Pending Arrival" : "Awaiting Verification"}</span>
              <h3>{title}</h3>
              <p>This slot activates when a verified public file enters the equipment record.</p>
              <small>Upon arrival · Status pending</small>
            </article>
          ))}
        </div>
      </section>
      <ShipmentJourney result={shipment} refresh={shipment.refresh} />
      <section className="timeline-section ardhi-history passport-reveal" id="history" data-passport-reveal data-view="History|Export|Documented archive" aria-labelledby="ardhi-history-title">
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
                    <button
                      type="button"
                      aria-expanded={!collapsedHistoryPhases.has(historyPhaseStarts[record.id])}
                      onClick={() => toggleHistoryPhase(historyPhaseStarts[record.id])}
                    >
                      <span>{historyPhaseStarts[record.id]}</span>
                    <i aria-hidden="true">↓</i>
                    </button>
                  </li>
                ) : null}
                <li
                  ref={(node) => {
                    historyRefs.current[record.id] = node;
                  }}
                  id={`history-${record.id}`}
                  className={`is-${record.status} ${expandedRecord === record.id ? "is-highlighted" : ""}`}
                  hidden={collapsedHistoryPhases.has(historyPhaseByRecord[record.id])}
                >
                  <details
                    open={expandedRecord === record.id}
                    onToggle={(event) => {
                      if (event.currentTarget.open) investigateRecord(record);
                      else setExpandedRecord((current) => current === record.id ? undefined : current);
                    }}
                  >
                    <summary>
                      <span>{record.date}</span>
                      <strong>{record.title}</strong>
                      <em>
                        {record.status} · {historyPhaseByRecord[record.id] === "Production" ? "Factory" : "Archive"}
                        {(record.photos?.length ?? 0) + (record.videos?.length ?? 0) > 0 && ` · ${(record.photos?.length ?? 0) + (record.videos?.length ?? 0)} media`}
                        {!!record.documents && ` · ${record.documents} documents`}
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
                            <b>Supplier messages</b>
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
                      {record.outcome ? <aside className="history-outcome"><b>Outcome</b><p>{record.outcome}</p></aside> : null}
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
                      <nav className="history-related" aria-label={`Related records for ${record.title}`}>
                        <span>Related records</span>
                        <button type="button" onClick={() => scrollToRecord("journey", ["Journey", record.title, "Location history"])}>Journey</button>
                        <button type="button" onClick={() => scrollToRecord("evidence", ["Evidence", record.title, selectedChapter.label])}>Media</button>
                        <button type="button" onClick={() => scrollToRecord("documents", ["Documents", record.title, `${record.documents ?? 0} linked`])}>Documents</button>
                      </nav>
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
      <section className="section shell ardhi-archive passport-reveal" id="evidence" data-passport-reveal data-view="Evidence|Historical Archive|Factory Build" aria-labelledby="archive-title">
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
      <section className="section shell ardhi-service-record passport-reveal" id="service" data-passport-reveal data-view="Service|Future Record|Awaiting commissioning" aria-labelledby="service-record-title">
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
      {stickerOpen ? <div className="sticker-viewer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setStickerOpen(false); }}><div className="sticker-viewer" id="window-sticker-viewer" ref={stickerModalRef} role="dialog" aria-modal="true" aria-labelledby="sticker-viewer-title"><header><div><p className="eyebrow">Official equipment certificate</p><h2 id="sticker-viewer-title">Equipment Window Sticker</h2></div><div className="sticker-viewer__tools"><button type="button" onClick={() => setStickerZoom((zoom) => Math.max(.75, zoom - .25))} aria-label="Zoom out">−</button><output aria-label="Current zoom">{Math.round(stickerZoom * 100)}%</output><button type="button" onClick={() => setStickerZoom((zoom) => Math.min(2, zoom + .25))} aria-label="Zoom in">+</button><button type="button" onClick={() => setPendingStickerAction("png")}>Download PNG</button><button type="button" onClick={() => setPendingStickerAction("pdf")}>Download PDF</button><button type="button" onClick={() => window.print()}>Print</button><button type="button" onClick={() => setStickerOpen(false)}>Close</button></div></header><div className="sticker-viewer__viewport" aria-label="Zoomable and pannable window sticker"><div className="sticker-viewer__stage" style={{ width: `${stickerZoom * 100}%` }}><div style={{ transform: `scale(${stickerZoom})` }}><WindowSticker item={item} packages={packages} scores={scores} compact showActions={false}/></div></div></div></div></div> : null}
      {lightbox ? (
        <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={lightbox.alt} onClick={() => setLightbox(undefined)}>
          <button type="button" onClick={() => setLightbox(undefined)} aria-label="Close media lightbox">
            ×
          </button>
          <img src={lightbox.src} alt={lightbox.alt} />
          <p>{lightbox.caption}</p>
        </div>
      ) : null}
    </div>
  );
}
