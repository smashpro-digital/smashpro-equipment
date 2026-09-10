import { useEffect, useRef, useState } from "react";
import type { Equipment, GalleryImage } from "../types/equipment";
import { mzigoArchiveChapters, mzigoArchiveSelection, mzigoArchiveTarget, mzigoMediaAnchor } from "../domain/mzigoArchive";

function ArchiveVideo({ media }: { media: GalleryImage }) {
  const [failed, setFailed] = useState(false);
  return <div className="archive-video">
    <video controls playsInline preload="metadata" poster={media.poster} width={media.width} height={media.height} aria-label={media.alt} onError={() => setFailed(true)}>
      <source src={media.src} type="video/mp4" onError={() => setFailed(true)} />
      Your browser cannot play this video. <a href={media.src}>Open the original video.</a>
    </video>
    {failed && <p role="status">The video could not load. <a href={media.src}>Open the original MP4.</a></p>}
  </div>;
}

export function MzigoMediaArchive({ item }: { item: Equipment }) {
  const [chapterId, setChapterId] = useState("factory-build");
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<string>();
  const [lightbox, setLightbox] = useState<GalleryImage>();
  const dialog = useRef<HTMLDialogElement>(null);
  const chapter = mzigoArchiveChapters.find(entry => entry.id === chapterId)!;
  const chapterMedia = mzigoArchiveSelection(item.gallery, chapterId);
  const filteredMedia = mzigoArchiveSelection(item.gallery, chapterId, query);
  const concepts = item.gallery.filter(media => !media.group);

  useEffect(() => {
    const followHash = () => {
      const destination = mzigoArchiveTarget(item.gallery, window.location.hash);
      if (!destination) return;
      setChapterId(destination.chapterId);
      setQuery("");
      setTarget(destination.anchor);
    };
    followHash();
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, [item.gallery]);

  useEffect(() => {
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      const record = document.getElementById(target);
      record?.scrollIntoView({ block: "start" });
      record?.focus({ preventScroll: true });
      setTarget(undefined);
    });
    return () => cancelAnimationFrame(frame);
  }, [chapterId, query, target]);

  useEffect(() => {
    if (lightbox && !dialog.current?.open) dialog.current?.showModal();
  }, [lightbox]);

  const selectChapter = (id: string) => {
    setChapterId(id);
    setQuery("");
    setTarget(undefined);
    window.history.replaceState(window.history.state, "", `#mzigo-archive-${id}`);
  };

  return <section className="section shell ardhi-archive mzigo-media-archive" id="evidence" aria-labelledby="mzigo-archive-title">
    <div className="section-heading"><div><p className="eyebrow">Curated Historical Archive</p><h2 id="mzigo-archive-title">Follow the machine's story.</h2></div><p>From the first exposed chassis to the finished electric carrier. Explore the original factory photographs and videos, with each chapter added as it happens.</p></div>
    <nav className="archive-chapters" aria-label="SP-MZIGO-26E historical chapters">
      {mzigoArchiveChapters.map((entry, index) => {
        const count = mzigoArchiveSelection(item.gallery, entry.id).length;
        return <button type="button" key={entry.id} className={entry.id === chapterId ? "is-active" : ""} aria-pressed={entry.id === chapterId} aria-controls="mzigo-archive-panel" onClick={() => selectChapter(entry.id)}>
          <span>{String(index + 1).padStart(2, "0")}</span>{entry.label}<small>{count ? `${count} records` : "Awaiting evidence"}</small>
        </button>;
      })}
    </nav>
    <div id="mzigo-archive-panel" role="region" aria-labelledby={`mzigo-archive-${chapterId}`}>
      <div className="mzigo-archive-intro"><h3 id={`mzigo-archive-${chapterId}`} tabIndex={-1}>{chapter.label}</h3><p>{chapter.description}</p></div>
      {!!chapterMedia.length && <div className="archive-tools"><input type="search" value={query} onChange={event => {
        setQuery(event.target.value);
        window.history.replaceState(window.history.state, "", `#mzigo-archive-${chapterId}`);
      }} placeholder={`Search ${chapter.label}`} aria-label={`Search ${chapter.label} media`} /><p role="status">{filteredMedia.length} of {chapterMedia.length} records · {chapterMedia.filter(media => media.kind === "video").length} video</p></div>}
      <div className="archive-grid">
        {filteredMedia.map(media => <article key={media.src} id={mzigoMediaAnchor(media)} tabIndex={-1} className={media.kind === "video" ? "is-video" : undefined}>
          {media.kind === "video" ? <ArchiveVideo media={media} /> : <button type="button" onClick={() => setLightbox(media)} aria-label={`Enlarge ${media.alt}`}><img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" /></button>}
          <div className="archive-caption"><span>{media.group?.replaceAll("-", " ")}</span><p>{media.caption}</p><small><time dateTime={media.capturedAt}>{media.capturedAt}</time> · {media.kind === "video" ? "Video" : "Photograph"}</small><a href={media.src} target="_blank" rel="noopener noreferrer">{media.kind === "video" ? "Open original video" : "Open original photo"}</a></div>
        </article>)}
      </div>
      {!filteredMedia.length && <div className="empty-state"><p>{chapterMedia.length ? `No records match “${query}” in ${chapter.label}.` : chapter.empty}</p>{!!chapterMedia.length && <button type="button" onClick={() => setQuery("")}>Clear search</button>}</div>}
    </div>
    {!!concepts.length && <aside className="mzigo-archive-concepts"><p>Design history · Concept artwork, separate from factory evidence.</p>{concepts.map(media => <a href={media.src} key={media.src} target="_blank" rel="noopener noreferrer">{media.caption}</a>)}</aside>}
    <dialog ref={dialog} className="mzigo-archive-lightbox" aria-label="Factory photograph viewer" onClose={() => setLightbox(undefined)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {lightbox && <><button type="button" autoFocus onClick={() => dialog.current?.close()}>Close photograph</button><img src={lightbox.src} alt={lightbox.alt} /><p>{lightbox.caption}</p><a href={lightbox.src} target="_blank" rel="noopener noreferrer">Open original photo</a></>}
    </dialog>
  </section>;
}
