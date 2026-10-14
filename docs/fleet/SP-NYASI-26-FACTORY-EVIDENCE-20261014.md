# SP-NYASI-26 factory completion evidence

Evidence received: October 14, 2026. Camera capture dates are unverified.
Source: Hailey Li / Supplier. Classification: **Supplier Factory Evidence**.
Lifecycle: **Factory Build Complete**, supplier-reported; **Final Configuration Review Pending**.

Canonical record: [Digital HQ LM500 procurement](https://github.com/smashpro-digital/digital-hq/blob/129de64d3e6bdb7353d5adef8c227d7afdef6b55/docs/equipment-procurement/SP-NYASI-26-lm500.md).
HQ already records completion; this change updates only its sanitized Equipment presentation. No private correspondence, payment identifiers or delivery details are copied.

## Sources and preservation

All four originals were copied, never moved, from the owner-supplied Downloads files. The three JPEGs were visually matched to the uploaded photographs. Original SHA-256 hashes and dimensions are in [the import manifest](nyasi-factory-media-2026-10-14.json). Public files are in [images](../../images/).

| Original source | Preserved filename |
| --- | --- |
| 4353449936049.PNM.jpg | sp-nyasi-26-factory-front-blade-2026-10-14-original.jpg |
| 4341446189459.PNM.jpg | sp-nyasi-26-factory-rear-controls-2026-10-14-original.jpg |
| 4353449936058.PNM.jpg | sp-nyasi-26-factory-overhead-tracks-engine-2026-10-14-original.jpg |
| 4353451825300.PNM.mp4 | sp-nyasi-26-factory-remote-demonstration-2026-10-14-original.mp4 |

Photo derivatives use the same stems with -640.webp and -1280.webp. Original JPEGs are 3024 x 4032. Pillow EXIF transpose and quality-85 WebP encoding preserve composition; no generative alteration was used. The original video is 66.74 seconds, HEVC/HLG, 1920 x 1080 with portrait rotation metadata (display 1080 x 1920).

The video without the -original suffix is a 540 x 960 H264/AAC fast-start derivative (about 11 MB). Rotation is applied, HLG is tone-mapped to BT.709 SDR, and container metadata is removed. The original is byte-preserved under Git LFS. The poster is extracted from the playback derivative at 42 seconds.

Encoding: FFmpeg 7.1, libx264 fast / CRF 24, AAC 96 kbps, faststart. Filter:
scale=540:960,zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p.

## Observations and limits

Photos show green finish, rubber tracks, RATO RV225-XPro engine, front blade, lift actuator hardware, light housings, controller and rear controls. They do not establish functional acceptance.

A full-clip sampled sequence plus denser one-second review around blade/lights supports these limited video observations:

| Approximate interval | Observation | Boundary |
| --- | --- | --- |
| 0-6 seconds | Operator uses machine controls and Microzone C7 | Not proof of every control or safety function |
| 6-15 and 33-42 seconds | Movement and turning while controller is manipulated | Supplier demonstration; formal drive acceptance pending |
| 43-55 seconds | Blade raises and lowers | No load rating, snow performance or complete safety test |
| 58-59 seconds | Front headlights illuminated | No complete lighting acceptance |
| Entire clip | Factory environment, operator/controller and mower | No grass cutting or field performance demonstrated |

Still needed: serial/model confirmation of the pictured unit, rear tow hitch evidence, final decals, final walkaround, cutting-system operation, formal factory QC, packing/export/shipping records, delivery and commissioning. Requested lighting, remote drive and blade tests remain acceptance gates even though limited operation is visible.

## Presentation and lifecycle

The single [factory media collection](../../src/data/nyasiFactoryMedia.ts) supplies the gallery and timeline media links. It carries identity, source, supplied date, classification, lifecycle and public Passport permission. Capture dates are deliberately absent. Shared Passport evidence records and lifecycle progress are retained. Archive cards and a native keyboard-accessible photo dialog follow the existing Passport archive design; photos are lazy-loaded, originals fetched only on request, and video uses preload none.

The NYASI premium showroom card and promotional hero are unchanged. ARDHI and MZIGO state and protected files are unchanged. NYASI's public equipment index derives its updated status from the same equipment record; no parallel canonical Passport migration was introduced.

Completed gates: configuration, order, deposit, production preparation and supplier-reported factory completion. Final configuration, branding, functional acceptance, balance payment, packing, shipping, delivery, commissioning and operational release remain pending.

Financial record remains $2,165 DDP total, $600 paid, $1,565 remaining. Contracted brushless LM500 / RATO RV225-XPro 225cc configuration is distinguished from physical observations and acceptance. Rack and side cutter remain excluded.

## Validation

Results and screenshots are recorded in the pull request. Local browser script: scripts/validate-nyasi-factory-browser.mjs against Vite preview port 5196. It covers 360, 375, 390, 430 and 1440 px, gallery enlargement/keyboard/focus, current state, duplicate IDs/navigation, overflow, media loading, video playback and preserved showroom artwork. ARDHI checks cover 360, 390 and 1440 px; protected fixture tests verify unchanged shared surfaces.

No production deployment or merge is authorized by this sprint.

Completed locally: 141 tests passed; TypeScript and production build passed; public index/media/Passport artifact checks passed; ARDHI protected artifact passed; documentation links and git diff --check passed. Browser checks passed at all listed widths, with playback at 390 px. [Review screenshots and browser results](../release-captures/nyasi-factory-20261014/) are local preview evidence, not production deployment evidence.

## Gallery presentation update

The public NYASI gallery now displays only the three photographs. The portrait video remains archived as supplier evidence but is not rendered in the grid. Original-file links are removed from photo cards and the enlarged viewer; click-to-enlarge, orientation and the underlying source files remain intact. Earlier playback validation above records the initial release.
