import { useState } from "react";
import type { EquipmentVideo } from "../types/passportExperience";
import { ButtonLink } from "./ButtonLink";

export function publishedEquipmentVideos(videos: EquipmentVideo[], equipmentId: string, now = Date.now()) {
  return videos.filter(video => video.equipmentId === equipmentId && video.visibility === "public" && /^[\w-]{11}$/.test(video.videoId) && Number.isFinite(Date.parse(video.publishedAt)) && Date.parse(video.publishedAt) <= now && Number.isFinite(Date.parse(video.verifiedAt)) && Date.parse(video.verifiedAt) <= now);
}

/** One consent-driven, privacy-enhanced player; no iframe before explicit playback consent. */
export function EquipmentWatch({ videos, equipmentId, channelUrl, emptyMessage }: { videos: EquipmentVideo[]; equipmentId: string; channelUrl: string; emptyMessage: string }) {
  const available = publishedEquipmentVideos(videos, equipmentId);
  const [selectedId, setSelectedId] = useState<string>();
  const [playingId, setPlayingId] = useState<string>();
  const selected = available.find(video => video.videoId === selectedId) ?? available.find(video => video.featured) ?? available[0];
  if (!selected) return <div className="passport-watch-empty"><p>{emptyMessage}</p><ButtonLink href={channelUrl} variant="outline">Watch SmashPro Equipment on YouTube</ButtonLink></div>;
  return <div className="equipment-watch">
    <div className="equipment-watch__player">{playingId === selected.videoId ? <iframe key={selected.videoId} title={`${selected.title} — YouTube video`} src={`https://www.youtube-nocookie.com/embed/${selected.videoId}?rel=0`} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button type="button" onClick={() => setPlayingId(selected.videoId)}><strong>Load {selected.title}</strong><span>Connect to YouTube to play this video</span></button>}</div>
    <h3>{selected.title}</h3><p>{selected.description}</p><p className="passport-classification">{selected.category} / {selected.lifecycleStage} / Published {selected.publishedAt}</p>
    <a href={`https://www.youtube.com/watch?v=${selected.videoId}`}>Watch directly on YouTube</a>
    {available.length > 1 && <div className="equipment-watch__choices" aria-label="Choose an equipment video">{available.map(video => <button key={video.videoId} type="button" aria-pressed={video.videoId === selected.videoId} onClick={() => { setSelectedId(video.videoId); setPlayingId(undefined); }}><img src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt="" width="480" height="360" loading="lazy" referrerPolicy="no-referrer" /><span>{video.title}</span></button>)}</div>}
  </div>;
}
