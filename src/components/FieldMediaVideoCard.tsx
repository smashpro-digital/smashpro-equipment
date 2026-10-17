import { useState } from 'react';
import type { FieldMediaVideo } from '../domain/mediaEquipment';

/** No YouTube player or remote thumbnail request until explicit activation. */
export function FieldMediaVideoCard({video, onEngagement}: {video: FieldMediaVideo; onEngagement: (action: string, video: FieldMediaVideo) => void}) {
  const [playing,setPlaying]=useState(false);
  const [failed,setFailed]=useState(false);
  return <article className="field-video" aria-label={video.title}>
    <div className="field-video__screen">
      {playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${video.videoId}?playsinline=1`} title={video.title} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/> : <button className="field-video__preview" onClick={()=>{setPlaying(true);onEngagement('load',video);}} aria-label={`Load YouTube video: ${video.title}`}>
        {video.thumbnail&&!failed&&<img src={video.thumbnail} alt="" loading="lazy" width="480" height="360" onError={()=>setFailed(true)}/>}
        <span className="field-video__play" aria-hidden="true">&#9654;</span><span className="field-video__prompt">Load video</span>
      </button>}
    </div>
    <div className="field-video__body"><p className="eyebrow">{video.category} &middot; Published</p><h3>{video.title}</h3><p>{video.description}</p>
      <p className="field-video__meta">{video.recordingDevice?`Recorded with ${video.recordingDevice}`:`About ${video.relatedAsset} - recording device unverified`}{video.publishedAt&&<> &middot; <time dateTime={video.publishedAt}>{video.publishedAt.slice(0,10)}</time></>}</p>
      <p className="field-video__privacy">Loading connects to YouTube. Playback stays under your control.</p>
      <a href={video.url} target="_blank" rel="noopener noreferrer" onClick={()=>onEngagement('open',video)}>Watch on YouTube &#8599;</a>
    </div>
  </article>;
}
