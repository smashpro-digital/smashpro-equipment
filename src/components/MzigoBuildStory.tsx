import { mzigoBuildChapters } from "../data/mzigoFactoryMedia";
import { mzigoMediaAnchor } from "../domain/mzigoArchive";
import { PassportEvidenceRecord } from "./PassportEvidenceRecord";

export function MzigoBuildStory() {
  return <section className="section shell mzigo-build-story" id="mzigo-build-story" aria-labelledby="mzigo-build-story-title">
    <header className="mzigo-build-story__intro">
      <p className="eyebrow">Build Story · September 9, 2026</p>
      <h2 id="mzigo-build-story-title">From factory platform to SmashPro fleet machine.</h2>
      <p>Five documented views from September 9. Open a record for verified observations and operational context, then follow its links to the original media in the archive. These are phases of one factory update, not separate completion dates.</p>
    </header>
    <div className="mzigo-build-story__chapters">{mzigoBuildChapters.map(chapter => <article className={`mzigo-build-chapter mzigo-build-chapter--${chapter.number}`} key={chapter.number} aria-labelledby={`mzigo-chapter-${chapter.number}`}>
      <PassportEvidenceRecord id={`mzigo-record-${chapter.number}`} date="Sep 9, 2026" phase={`Factory build · ${chapter.number}`} title={chapter.title} preview={chapter.image} label={`Documented · ${1 + chapter.supporting.length} ${chapter.supporting.length ? "photos" : "photo"}${chapter.video ? " + walkaround" : ""} · Open evidence`}>
      <div className="mzigo-build-chapter__copy"><h3 id={`mzigo-chapter-${chapter.number}`}>{chapter.title}</h3><p>{chapter.narrative}</p></div>
      <ul className="mzigo-record-media-links">{[chapter.image, ...chapter.supporting, ...(chapter.video ? [chapter.video] : [])].map(media => <li key={media.src}><a href={`#${mzigoMediaAnchor(media)}`}>{media.kind === "video" ? "Watch in archive" : "View in archive"} · {media.caption}</a></li>)}</ul>
      <div className="mzigo-evidence-context"><div><strong>Verified in the media</strong><ul>{chapter.verified.map(fact => <li key={fact}>{fact}</li>)}</ul></div><div><strong>Operational meaning</strong><p>{chapter.takeaway}</p><small>Visual evidence documents configuration; it does not establish engineering ratings, inspection approval or readiness for service.</small></div></div>
      </PassportEvidenceRecord>
    </article>)}</div>
    <footer className="mzigo-build-story__next"><p className="eyebrow">The next chapter</p><h3>From factory completion to the journey home.</h3><p>Pre-shipment verification is current. Final inspection, ocean freight and U.S. delivery are still ahead; their evidence will join the passport as those stages happen.</p></footer>
  </section>;
}
