import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "../types/equipment";
import "../styles/passport-factory-gallery.css";

type EvidenceMedia = GalleryImage & {
  rotation?: -90; objectPosition?: string; title: string; originalSrc: string; srcSet?: string; equipmentId: string; source: string;
  evidenceDate: string; lifecycle: string; classification: string;
};

/** Same archive cards and native-dialog interaction as the existing Passport archives. */
export function PassportFactoryGallery({ media }: { media: EvidenceMedia[] }) {
  const [selected, setSelected] = useState<EvidenceMedia>();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (selected && !dialog.current?.open) dialog.current?.showModal(); }, [selected]);
  return <div className="passport-factory-gallery">
    <div className="archive-grid">{media.map(entry => <article id={entry.id} key={entry.id}>
      {entry.kind === "video"
        ? <video controls playsInline preload="none" poster={entry.poster} width={entry.width} height={entry.height} aria-label={entry.title}>
            <source src={entry.src} type="video/mp4" />
            Your browser cannot play this video. Use the MP4 link below.
          </video>
        : <button type="button" className="factory-photo-frame" data-rotation={entry.rotation} aria-label={`Enlarge ${entry.title}`} onClick={() => setSelected(entry)}>
            <img style={{ objectPosition: entry.objectPosition }} src={entry.src} srcSet={entry.srcSet} sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 380px" alt={entry.alt} width={entry.width} height={entry.height} loading="lazy" decoding="async" />
          </button>}
      <div className="archive-caption">
        <h3>{entry.title}</h3><p>{entry.caption}</p>
        <p><small>{entry.equipmentId} &middot; {entry.classification}<br />Supplied <time dateTime={entry.evidenceDate}>{entry.evidenceDate}</time> &middot; {entry.source}<br />{entry.lifecycle} &middot; Capture date unverified</small></p>
        {entry.kind === "video" && <a href={entry.src} target="_blank" rel="noopener noreferrer">Open playable MP4</a>}
      </div>
    </article>)}</div>
    <dialog ref={dialog} className="passport-factory-dialog" aria-label="Factory photograph viewer" onClose={() => setSelected(undefined)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {selected && <><button type="button" autoFocus onClick={() => dialog.current?.close()}>Close photograph</button><div className="factory-photo-expanded" data-rotation={selected.rotation}><img src={selected.src} alt={selected.alt} width={selected.width} height={selected.height} /></div><p>{selected.caption}</p></>}
    </dialog>
  </div>;
}
