# MZIGO historical media archive

## Problem and result

The generic lower gallery read only the August assembly entries in `equipment.gallery`, so it showed empty branding, hydraulics and completed-machine groups despite the September files being present in `mzigoFactoryMedia.ts`.

MZIGO now uses the ARDHI archive's chapter-navigation and card styles. The canonical equipment gallery contains 24 authentic records: 22 photographs and two videos. Factory Build contains 10 records; Finished Machine contains 14. Export Journey, Delivery, Operation and Maintenance remain awaiting evidence, without implying those stages have happened.

Six build chapters retain the original narrative and extend it with the September 14 revisions and September 15 build-approved profile. Their media links and the equipment timeline select the corresponding archive chapter and record. Full photographs and video players live in the archive. The previous concept artwork remains available through a separately labeled design-history link. The flagship hero is unchanged.

## Added September 14–15 production evidence

| Original | Production filename | Dimensions | Category |
| --- | --- | --- | --- |
| IMG-20260915-WA0005.jpg | sp-mzigo-26e-raised-bed-engineering-overview-2026-09-14.jpg | 1280 x 960 | Hydraulics |
| IMG-20260915-WA0004.jpg | sp-mzigo-26e-tie-down-anchor-detail-2026-09-14.jpg | 211 x 105 | Exterior |
| IMG-20260915-WA0003.jpg | sp-mzigo-26e-black-battery-boxes-hydraulic-power-unit-2026-09-14.jpg | 960 x 1280 | Electrical |
| IMG-20260915-WA0002.jpg | sp-mzigo-26e-black-wheel-drive-motor-2026-09-14.jpg | 1280 x 960 | Electrical |
| IMG-20260915-WA0001.jpg | sp-mzigo-26e-raised-bed-drive-system-overview-2026-09-14.jpg | 1280 x 960 | Hydraulics |
| IMG-20260915-WA0000.jpg | sp-mzigo-26e-build-approved-left-profile-2026-09-15.jpg | 1280 x 960 | QC |

All six production files are byte-for-byte copies of the supplied JPEGs. Their category and approved-channel metadata is explicit. Shipping remains an empty evidence category until export media exists.

## Media reviewed on September 10, 2026

- Inspected the canonical August/September photographs and all 16 distinct `IMG-20260909-WA0000.jpg` through `WA0015.jpg` originals. The `(1)` copies have identical hashes to their matching originals.
- Reviewed sampled frames across both videos and decoded each full file with FFmpeg without errors.
- August assembly video: 16.585 seconds, 1280 x 720, H.264/AAC; exposed chassis, batteries, wiring and factory assembly.
- September factory walkaround: 78.7265 seconds, 640 x 360, H.264/AAC; completed carrier views followed by the hydraulic body raising and lowering. Updated its caption to describe that sequence. The raw `d7dae32085ed4e8ba3008b5af86c02ed.mp4` is byte-identical to the existing semantic walkaround file.
- Nine previously published September photographs remain in place. Added six complementary views from the originals; other similar angles are retained locally rather than repeated in the curated archive.

## Added original photographs

Copies use semantic production filenames without modifying image bytes. Source files remain untouched in the original equipment checkout's `images/` directory.

| Original | Production filename | Dimensions |
| --- | --- | --- |
| IMG-20260909-WA0001.jpg | sp-mzigo-26e-cargo-bed-interior-2026-09-09.jpg | 960 x 1280 |
| IMG-20260909-WA0002.jpg | sp-mzigo-26e-raised-bed-left-profile-2026-09-09.jpg | 1280 x 960 |
| IMG-20260909-WA0003.jpg | sp-mzigo-26e-raised-bed-right-profile-2026-09-09.jpg | 1280 x 960 |
| IMG-20260909-WA0004.jpg | sp-mzigo-26e-battery-enclosures-2026-09-09.jpg | 960 x 1280 |
| IMG-20260909-WA0014.jpg | sp-mzigo-26e-remote-controller-2026-09-09.jpg | 960 x 1280 |

## Interaction and release checks

- Search is scoped to the selected chapter and includes captions, subjects, dates and media type. A search with no matches offers a reset; future chapters describe their actual pending state.
- Chapter changes unmount the previous video player. Both players use native controls, inline playback, metadata preload, posters and original-file fallback links.
- Photo enlargement uses a native modal dialog, including Escape handling and focus return. Every card also offers its original file.
- Existing August media IDs remain valid. Build/timeline hash links select the correct chapter, clear an active search and focus the target record.
- The media validator compares source/build bytes for all 25 factory files: 22 photos, two videos and the assembly-video poster. Concept art is not included in the authentic record count.
- Tests cover completeness, uniqueness, chronology, search, deep-link resolution, initial archive markup and preserved identity/status. Browser interaction and mobile visual acceptance still require a connected browser; none was available during implementation.
