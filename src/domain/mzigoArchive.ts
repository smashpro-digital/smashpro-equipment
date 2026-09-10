import type { GalleryGroup, GalleryImage } from "../types/equipment";

export const mzigoArchiveChapters: { id: string; label: string; groups: GalleryGroup[]; description: string; empty: string }[] = [
  { id: "factory-build", label: "Factory Build", groups: ["factory", "assembly", "hydraulics", "testing"], description: "From the exposed August chassis to September's electric drive and hydraulic lift details.", empty: "Factory evidence will appear here as it is documented." },
  { id: "finished-machine", label: "Finished Machine", groups: ["branding", "completed-machine"], description: "SmashPro green, installed graphics, the remote controller, and a factory walkaround with the dump body raising and lowering.", empty: "Finished-machine evidence will appear here as it is documented." },
  { id: "export-journey", label: "Export Journey", groups: ["export", "shipping"], description: "The next stage after pre-shipment verification and final inspection.", empty: "Export is still ahead. No shipment or vessel record has been published for MZIGO." },
  { id: "delivery", label: "Delivery", groups: ["arrival", "commissioning"], description: "Arrival and commissioning will continue this machine's record.", empty: "Delivery and commissioning are still ahead. Their photographs and videos will join the archive when documented." },
  { id: "operation", label: "Operation", groups: ["jobs"], description: "Future work, material handling and field records.", empty: "MZIGO is pre-commissioning. No operational work has been documented yet." },
  { id: "maintenance", label: "Maintenance", groups: ["maintenance"], description: "Service evidence will stay connected to the equipment's history.", empty: "No completed maintenance has been documented yet." },
];

export const mzigoChapterForMedia = (media: GalleryImage) => mzigoArchiveChapters.find(chapter => media.group && chapter.groups.includes(media.group));
export const mzigoMediaAnchor = (media: GalleryImage) => `media-${media.id ?? media.src.split("/").pop()!.replace(/\.[^.]+$/, "")}`;

export function mzigoArchiveSelection(gallery: GalleryImage[], chapterId: string, query = "") {
  const term = query.trim().toLowerCase();
  return gallery.filter(media => mzigoChapterForMedia(media)?.id === chapterId && `${media.alt} ${media.caption ?? ""} ${media.group ?? ""} ${media.capturedAt ?? ""} ${media.kind === "video" ? "video" : "photo image"}`.toLowerCase().includes(term))
    .sort((a, b) => (a.capturedAt ?? "").localeCompare(b.capturedAt ?? ""));
}

export function mzigoArchiveTarget(gallery: GalleryImage[], hash: string) {
  const anchor = hash.replace(/^#/, "");
  const media = gallery.find(entry => mzigoMediaAnchor(entry) === anchor);
  const chapter = media ? mzigoChapterForMedia(media) : mzigoArchiveChapters.find(entry => `mzigo-archive-${entry.id}` === anchor);
  return chapter ? { chapterId: chapter.id, anchor } : undefined;
}
