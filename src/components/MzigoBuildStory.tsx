import { useState } from "react";
import type { GalleryImage } from "../types/equipment";
import { mzigoBuildChapters } from "../data/mzigoFactoryMedia";

function EvidencePhoto({ media }: { media: GalleryImage }) {
  return <figure>
    <a href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge image: ${media.alt}`}>
      <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" />
    </a>
    <figcaption>{media.caption}</figcaption>
  </figure>;
}

function Walkaround({ media }: { media: GalleryImage }) {
  const [failed, setFailed] = useState(false);
  return <figure className="mzigo-build-video">
    <video controls playsInline preload="metadata" poster={media.poster} width={media.width} height={media.height} aria-label={media.alt} onError={() => setFailed(true)}>
      <source src={media.src} type="video/mp4" onError={() => setFailed(true)} />
      Your browser cannot play this video. <a href={media.src}>Open the factory walkaround.</a>
    </video>
    <figcaption>{media.caption} <a href={media.src}>Open video</a></figcaption>
    {failed && <p role="status">The factory walkaround could not load. <a href={media.src}>Try opening the MP4 directly.</a></p>}
  </figure>;
}

export function MzigoBuildStory() {
  return <section className="section shell mzigo-build-story" aria-labelledby="mzigo-build-story-title">
    <header className="mzigo-build-story__intro">
      <p className="eyebrow">Build Story · September 9, 2026</p>
      <h2 id="mzigo-build-story-title">From factory platform to SmashPro fleet machine.</h2>
      <p className="large-copy">First, meet the machine. Then follow its identity into the controls, look beneath the body, and see the finished build in motion. These five chapters explore one September 9 factory update.</p>
    </header>
    <div className="mzigo-build-story__chapters">{mzigoBuildChapters.map(chapter => <article className={`mzigo-build-chapter mzigo-build-chapter--${chapter.number}`} key={chapter.number} aria-labelledby={`mzigo-chapter-${chapter.number}`}>
      <div className="mzigo-build-chapter__copy"><span className="mzigo-build-chapter__marker">{chapter.number}</span><p className="eyebrow">{chapter.scene}</p><h3 id={`mzigo-chapter-${chapter.number}`}>{chapter.title}</h3><p>{chapter.copy}</p><p className="mzigo-build-chapter__takeaway"><strong>What this shows</strong>{chapter.takeaway}</p></div>
      <div className="mzigo-build-chapter__evidence">
        <div className="mzigo-build-chapter__lead"><EvidencePhoto media={chapter.image} /></div>
        {!!chapter.supporting.length && <div className="mzigo-build-chapter__details">{chapter.supporting.map(media => <EvidencePhoto media={media} key={media.src} />)}</div>}
      </div>
      {chapter.video && <Walkaround media={chapter.video} />}
    </article>)}</div>
    <footer className="mzigo-build-story__next"><p className="eyebrow">The next chapter</p><h3>From factory completion to the journey home.</h3><p>Pre-shipment verification is current. Final inspection, ocean freight and U.S. delivery are still ahead; their evidence will join the passport as those stages happen.</p></footer>
  </section>;
}
