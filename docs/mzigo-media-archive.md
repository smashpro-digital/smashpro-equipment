# MZIGO historical media archive

## September archive baseline

This section preserves the September implementation history. The October update below extends the archive to 40 public records and fills Export Journey. The current hero is the separately labeled promotional poster.

### Problem and result

The generic lower gallery read only the August assembly entries in `equipment.gallery`, so it showed empty branding, hydraulics and completed-machine groups despite the September files being present in `mzigoFactoryMedia.ts`.

MZIGO now uses the ARDHI archive's chapter-navigation and card styles. The canonical equipment gallery contains 24 authentic records: 22 photographs and two videos. Factory Build contains 10 records; Finished Machine contains 14. Export Journey, Delivery, Operation and Maintenance remain awaiting evidence, without implying those stages have happened.

Six build chapters retain the original narrative and extend it with the September 14 revisions and September 15 build-approved profile. Their media links and the equipment timeline select the corresponding archive chapter and record. Full photographs and video players live in the archive. The previous concept artwork remains available through a separately labeled, Passport-approved design-history link. The September 15 build-approved profile is now the Passport and public-index hero.

## Added September 14–15 production evidence

| Original | Production filename | Dimensions | Category | SHA-256 |
| --- | --- | --- | --- | --- |
| IMG-20260915-WA0005.jpg | sp-mzigo-26e-raised-bed-engineering-overview-2026-09-14.jpg | 1280 x 960 | Hydraulics | `a08978f6e04845d4e87ac64f9907809505df5d660c1400fef02526a081053cfd` |
| IMG-20260915-WA0004.jpg | sp-mzigo-26e-tie-down-anchor-detail-2026-09-14.jpg | 211 x 105 | Exterior | `231d13423a9afe4fe977c64c3e31c02524aa430f0f4d0cca4367b7b9bf8b2305` |
| IMG-20260915-WA0003.jpg | sp-mzigo-26e-black-battery-boxes-hydraulic-power-unit-2026-09-14.jpg | 960 x 1280 | Electrical | `8aebcea915ae65f51fb6550b1771a12549c4ce391d87aec9c1218191a6d605b1` |
| IMG-20260915-WA0002.jpg | sp-mzigo-26e-black-wheel-drive-motor-2026-09-14.jpg | 1280 x 960 | Electrical | `6e696b762abf600e2221f4c076f398e20a980a40dad2bff80b6bd201cbabc492` |
| IMG-20260915-WA0001.jpg | sp-mzigo-26e-raised-bed-drive-system-overview-2026-09-14.jpg | 1280 x 960 | Hydraulics | `6012d753689d33b9983fa9327a35008095423c15378b5a1cce1164d930130dd6` |
| IMG-20260915-WA0000.jpg | sp-mzigo-26e-build-approved-left-profile-2026-09-15.jpg | 1280 x 960 | QC | `0d519da580fba50704d0b7198b956c105f4514adebb0a939bcc466e45a076e6f` |

All six production files are byte-for-byte copies of the supplied JPEGs. Their category and approved-channel metadata is explicit. Shipping remains an empty evidence category until export media exists.

## Held concept sources

Three supplied PNG concepts are preserved byte-for-byte under `project_sources/sp-mzigo-26e/concepts/` with their hashes and review status. They are excluded from `images/`, the production build and every public-media channel. The 27E artwork contains unapproved “Coming 2027” and “Pre-order now” copy; the two 26E renderings depict future options that are not the as-built machine. See the adjacent source manifest for the complete record.

## Media reviewed on September 10, 2026

- Inspected the canonical August/September photographs and all 16 distinct `IMG-20260909-WA0000.jpg` through `WA0015.jpg` originals. The `(1)` copies have identical hashes to their matching originals.
- Reviewed sampled frames across both videos and decoded each full file with FFmpeg without errors.
- August assembly video: 16.585 seconds, 1280 x 720, H.264/AAC; exposed chassis, batteries, wiring and factory assembly.
- September factory walkaround: 78.7265 seconds, 640 x 360, H.264/AAC; completed carrier views followed by the hydraulic body raising and lowering. Updated its caption to describe that sequence. The raw `d7dae32085ed4e8ba3008b5af86c02ed.mp4` is byte-identical to the existing semantic walkaround file.
- Nine previously published September photographs remain in place. Added six complementary views from the originals; other similar angles are retained locally rather than repeated in the curated archive.

## Added original photographs

Copies use semantic production filenames without modifying image bytes. The local import cleanup below records the subsequent source-file naming changes.

| Original | Production filename | Dimensions |
| --- | --- | --- |
| IMG-20260909-WA0001.jpg | sp-mzigo-26e-cargo-bed-interior-2026-09-09.jpg | 960 x 1280 |
| IMG-20260909-WA0002.jpg | sp-mzigo-26e-raised-bed-left-profile-2026-09-09.jpg | 1280 x 960 |
| IMG-20260909-WA0003.jpg | sp-mzigo-26e-raised-bed-right-profile-2026-09-09.jpg | 1280 x 960 |
| IMG-20260909-WA0004.jpg | sp-mzigo-26e-battery-enclosures-2026-09-09.jpg | 960 x 1280 |
| IMG-20260909-WA0014.jpg | sp-mzigo-26e-remote-controller-2026-09-09.jpg | 960 x 1280 |

## Local import naming cleanup — October 5, 2026

Local `main` was fast-forwarded to `fb71fb0` before this cleanup. Factory image names follow `sp-mzigo-26e-<subject>-YYYY-MM-DD.jpg`; `original` distinguishes a source variant from an existing curated image with different bytes. The date preserves the September 9 source batch date, not a new lifecycle event.

Five originals already match the canonical filenames in the table above byte-for-byte. With user approval, their redundant imports, all sixteen `(1)` copies, and the duplicate walkaround video were removed: 21 duplicate photographs and one duplicate video. Each duplicate and its retained canonical file were checked against the recorded SHA-256 before deletion. The private conversation screenshot remains under ignored `local-notes/mzigo-media-imports-2026-10-05/`, outside the published media directory. `rename-manifest.json` in that directory retains all 35 original paths, destinations, SHA-256 hashes and duplicate-removal dispositions.

The remaining distinct images were renamed in `images/` without changing bytes:

| Original | Standard filename |
| --- | --- |
| IMG-20260909-WA0000.jpg | sp-mzigo-26e-raised-bed-front-lights-original-2026-09-09.jpg |
| IMG-20260909-WA0005.jpg | sp-mzigo-26e-raised-bed-chassis-overview-original-2026-09-09.jpg |
| IMG-20260909-WA0006.jpg | sp-mzigo-26e-motor-controller-detail-original-01-2026-09-09.jpg |
| IMG-20260909-WA0007.jpg | sp-mzigo-26e-motor-controller-detail-original-02-2026-09-09.jpg |
| IMG-20260909-WA0008.jpg | sp-mzigo-26e-hydraulic-pump-reservoir-original-2026-09-09.jpg |
| IMG-20260909-WA0009.jpg | sp-mzigo-26e-hydraulic-cylinder-electrical-original-2026-09-09.jpg |
| IMG-20260909-WA0010.jpg | sp-mzigo-26e-raised-bed-front-lights-original-02-2026-09-09.jpg |
| IMG-20260909-WA0011.jpg | sp-mzigo-26e-factory-complete-left-profile-original-2026-09-09.jpg |
| IMG-20260909-WA0012.jpg | sp-mzigo-26e-control-panel-original-2026-09-09.jpg |
| IMG-20260909-WA0013.jpg | sp-mzigo-26e-factory-complete-right-profile-original-2026-09-09.jpg |
| IMG-20260909-WA0015.jpg | sp-mzigo-26e-rear-branding-original-2026-09-09.jpg |
| d7dae32085ed4e8ba3008b5af86c02ed.jpg | sp-mzigo-26e-factory-walkaround-thumbnail-2026-09-09.jpg |

No application references use the raw import names. Existing curated media URLs, gallery selection, renderer and public lifecycle remain unchanged. This is local file organization, not a deployment or new publication approval.

## Interaction and release checks

- Search is scoped to the selected chapter and includes captions, subjects, dates and media type. A search with no matches offers a reset; future chapters describe their actual pending state.
- Chapter changes unmount the previous video player. Both players use native controls, inline playback, metadata preload, posters and original-file fallback links.
- Photo enlargement uses a native modal dialog, including Escape handling and focus return. Every card also offers its original file.
- Existing August media IDs remain valid. Build/timeline hash links select the correct chapter, clear an active search and focus the target record.
- The media validator compares source/build bytes for all 25 factory files: 22 photos, two videos and the assembly-video poster. Concept art is not included in the authentic record count.
- Tests cover completeness, uniqueness, chronology, search, deep-link resolution, initial archive markup and preserved identity/status. Browser interaction and mobile visual acceptance still require a connected browser; none was available during implementation.

## October 6–7, 2026 export evidence

Extends the September baseline without replacing its records. The archive now has 40 authentic public records: 36 images and four videos; 41 physical public factory files include the existing assembly-video poster. The October batch has 17 unique SHA-256 hashes: 14 public photographs, two public videos and one private crate photograph. No duplicates were removed. Similar charger/skid views are distinct photographs.

Photographs bear October 6 timestamps; they were received October 7. Video filenames use the receipt date, with capture date explicitly unknown. Original bytes are preserved. New records are allowlisted only for Passport and Equipment Gallery; existing marketing allowlists are unchanged. Packing is factory/export evidence, never field-validation or sailing evidence.

| Original source | Semantic filename | Visible evidence / handling |
| --- | --- | --- |
| `IMG-20261007-WA0000.jpg` | `sp-mzigo-26e-manufacturer-nameplate-2026-10-06.jpg` | KYLIN K600 manufacturer plate: serial QLUP202609010001, load 750 kg, vehicle weight 320 kg, production year 2026 |
| `IMG-20261007-WA0001.jpg` | `sp-mzigo-26e-charger-us-style-plugs-2026-10-06.jpg` | Battery charger and two cords with U.S.-style three-prong plugs; electrical ratings and certification are not established by plug shape |
| `IMG-20261007-WA0002.jpg` | `sp-mzigo-26e-charger-plug-detail-2026-10-06.jpg` | Alternate close view of the battery charger and plug prongs; not a duplicate photograph |
| `IMG-20261007-WA0003.jpg` | `sp-mzigo-26e-toolkit-maintenance-qr-2026-10-06.jpg` | Open tool case with a metal joint/shaft component, labeled bottle and rolled QR material; exact component and bottle contents need confirmation |
| `IMG-20261007-WA0004.jpg` | `sp-mzigo-26e-product-certificate-2026-10-06.jpg` | Kylin product certificate photographed in the tool case; document presence is not independent certification |
| `IMG-20261007-WA0005.jpg` | `sp-mzigo-26e-hotrc-controller-instructions-2026-10-06.jpg` | Printed HotRC controller diagram with labeled switches and joysticks, alongside QR material |
| `IMG-20261007-WA0006.jpg` | `sp-mzigo-26e-controller-batteries-documentation-2026-10-06.jpg` | Loose cylindrical batteries with printed controller instructions, product certificate and QR material |
| `IMG-20261007-WA0007.jpg` | `sp-mzigo-26e-hotrc-remote-controller-2026-10-06.jpg` | HotRC handheld remote controller placed in the tool case above the printed instructions |
| `IMG-20261007-WA0008.jpg` | `sp-mzigo-26e-export-skid-side-quarter-2026-10-06.jpg` | SP-MZIGO-26E on a wooden export skid while a crate wall is positioned behind it |
| `IMG-20261007-WA0009.jpg` | `sp-mzigo-26e-export-skid-control-panel-quarter-2026-10-06.jpg` | Control-panel quarter view of the branded machine on the export skid with wheel blocking visible |
| `IMG-20261007-WA0010.jpg` | `sp-mzigo-26e-export-skid-rear-quarter-2026-10-06.jpg` | Rear branding view on the export skid; tool case and boxed accessories are visible in the dump bed |
| `IMG-20261007-WA0011.jpg` | `sp-mzigo-26e-export-skid-side-profile-2026-10-06.jpg` | Side profile of the green machine and black wheels on the wooden export skid |
| `IMG-20261007-WA0012.jpg` | `sp-mzigo-26e-wood-crate-packing-in-progress-2026-10-06.jpg` | Crate side panels surround the machine; spare wheel, tool case and boxes are loaded in the dump bed |
| `IMG-20261007-WA0013.jpg` | `sp-mzigo-26e-qc-pass-spare-wheel-loadout-2026-10-06.jpg` | QC PASS sticker on the bed beside a spare wheel/tire, yellow tool case and two closed boxes; no functional test result inferred |
| `IMG-20261007-WA0014.jpg` | `sp-mzigo-26e-export-crate-complete-2026-10-06.jpg` | Completed closed wooden crate with handling marks; private warehouse address and contact label visible **Private original; excluded from public source/build.** |
| `VID-20261007-WA0015.mp4` | `sp-mzigo-26e-export-skid-loading-video-2026-10-07.mp4` | Short factory clip shows the machine moving onto the wooden export skid; not a rated-load or field test |
| `VID-20261007-WA0016.mp4` | `sp-mzigo-26e-export-skid-positioning-video-2026-10-07.mp4` | Short factory clip shows workers positioning the machine on the export skid; not commissioning |

Full hashes, sizes, date bases and dimensions: [October provenance manifest](fleet/evidence/sp-mzigo-26e-export-20261007.json). The completed-crate original is preserved under the ignored local evidence directory; only its sanitized description and hash are committed. It must not be moved into public media without a separately reviewed privacy-safe derivative.

The supplier statement relayed with this batch supports Qingdao warehouse staging only. No container, vessel, B/L, departure, ETA, customs release or delivery is established. The physical plate's 750 kg load is recorded alongside the earlier 500 kg statement without inventing a reason for the difference.

### October branch validation

Reference: branch base `0e7c51a`. Candidate retains the protected MZIGO renderer. No shared Passport component, ARDHI source block, 27E catalog source, stylesheet or deployment workflow changed. Protected hash fixtures were refreshed only for the authorized MZIGO changes; an additional ARDHI block hash preserves the base record.

- `npm ci`: passed (lockfile unchanged; npm reported two existing high-severity dependency advisories).
- `npm run validate`: passed — TypeScript, all **117 tests**, production build, five-record public index, 41 original factory media files, public projection/artifact privacy checks.
- All **32 protected deployment outputs** present.
- `git diff --check`: passed.
- Browser captures at **320, 390, 768 and 1440 px**: ARDHI, MZIGO and 27E load without image failures, horizontal overflow or console/page errors under controlled external-service responses. MZIGO checks cover 14 unique export photos, two playable videos, nameplate lightbox/Escape, serial search, certificate deep link and truthful lifecycle/plate text.

| Protected page | Width | Changed pixels (%) |
| --- | ---: | ---: |
| ardhi | 320 | 0.00000 |
| ardhi | 390 | 0.00002 |
| ardhi | 768 | 0.01222 |
| ardhi | 1440 | 0.00468 |
| 27e | 320 | 0.00000 |
| 27e | 390 | 0.00000 |
| 27e | 768 | 0.00000 |
| 27e | 1440 | 0.00000 |

ARDHI captures explicitly wait for video frame readiness. Remaining differences are native video-control rendering; source content and layout are unchanged. All protected comparisons retain the same dimensions and pass the existing 1% pixel-difference threshold. Screenshots and raw comparison results are retained locally in `local-notes/mzigo-export-20261007/`; the reproducible capture command is `node scripts/capture-mzigo-export.mjs http://127.0.0.1:4186/equipment after`.

External-service boundary: reference and candidate use identical controlled unavailable document/shipment responses. These checks verify the source rendering and fallback behavior, not availability of the live document service. This branch changes no service integration. No merge or deployment was performed.

### Changed files

The 16 public media paths are listed in the October mapping above. Other changed paths:

- `docs/fleet/SP-MZIGO-26E-PASSPORT.md`
- `docs/fleet/SP-MZIGO-26E-PROCUREMENT.md`
- `docs/fleet/evidence/sp-mzigo-26e-export-20261007.json`
- `docs/mzigo-media-archive.md`
- `scripts/capture-mzigo-export.mjs`
- `scripts/validate-mzigo-media.mjs`
- `src/components/MzigoBuildStory.tsx`
- `src/components/MzigoExportEvidence.tsx`
- `src/components/MzigoOemPlatform.tsx`
- `src/components/MzigoPassport.tsx`
- `src/components/MzigoPassportHeader.tsx`
- `src/data/equipment.ts`
- `src/data/mzigoCanonicalPassport.ts`
- `src/data/mzigoExportMedia.ts`
- `src/data/mzigoFactoryMedia.ts`
- `src/data/mzigoPassport.ts`
- `src/data/mzigoPlatform.ts`
- `src/domain/mzigoArchive.ts`
- `tests/fixtures/passport/ardhi-protected.json`
- `tests/fixtures/passport/mzigo-protected.json`
- `tests/mzigo-factory-media.test.mjs`
- `tests/passport-automation.test.mjs`
- `tests/routes.test.mjs`
