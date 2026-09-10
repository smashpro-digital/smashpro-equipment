# MZIGO flagship-standard audit — September 10, 2026

Audit baseline: `5562a79` on `origin/main`. The release worktree is clean; the original equipment checkout has unrelated untracked media and PCM work and is left untouched.

## Section comparison before implementation

| ARDHI pattern | Classification | Previous MZIGO | Implementation decision |
| --- | --- | --- | --- |
| Shared hero, identity, four chapter links | Required shared standard | Shared hero restored; K600 presented without its OEM caveat; illustration not visibly labeled | Preserve artwork/navigation; label illustration and qualify factory-model confirmation |
| Identity ledger and purpose | Required shared standard | Repeated identity, scores, pending valuation, marketing claims | One identity summary and concise material-transport purpose; no arbitrary maintenance score or pending valuation card |
| Lifecycle/current-next stages | Required, adapted | Separate factory checklist plus thin logistics sections | Reuse FleetLifecycleProgress with factory stages and actual media counts; no fabricated shipping progress or distance |
| Procurement/payment chronology | Required, adapted | Three records; undated factory record sorted after dated completion; no useful payment context | Preserve IDs and add sourced deposit/publication/assembly history; no invented payment dates, amounts or terms |
| Decision center and attachment strategy | Not applicable at ARDHI scale | Empty factory options, empty installed upgrades, empty package ledger, speculative wishlist | Replace presentation with compact Configured for SmashPro record and explicit outstanding requests; retain underlying history/data |
| Core specifications | Required shared standard | All entries marked confirmed by a blanket helper; headings implied manufacturer verification | Distinguish observed/documented configuration from recorded performance values awaiting manufacturer verification |
| Window sticker / documents | Required, adapted | Huge inline sticker plus empty document/YouTube sections; API failure indistinguishable from no documents | Reuse window sticker in accessible modal, label it a generated record, give document loading/error/empty states and compact verification register |
| Media and evidence | Required shared standard | Working 18-record chapter archive and five expandable evidence records | Preserve originals, IDs, search and links; retain dated observations even where later changes are requested |
| Ocean route, vessel, export metrics | Not yet applicable | Pending generic logistics copy | No vessel, map, ETA, container or route assumptions; pending stages only |
| Community voting, package qualification, extensive upgrades | Not applicable | Empty boilerplate or speculative options | Remove from MZIGO presentation; do not mutate unrelated equipment or procurement records |
| Service / readiness | Required, adapted | Standalone empty service record and separate restrictions | Compact commissioning/readiness section preserving #service and real service records |
| Responsive interactions / accessibility | Required shared standard | No connected-browser checks recorded for newest work | Use existing repository headless/CDP capture method for both passports, with isolated profile, desktop/mobile, keyboard/modal/media checks |

## Evidence and conflicts

- `docs/fleet/SP-MZIGO-26E-PROCUREMENT.md`: deposit recorded, but amount/date/remaining terms absent; signed proforma, manufacturer sheet, QC, serial and shipping documents pending. K600 is the recorded platform, not yet manufacturer-sheet confirmed.
- `docs/fleet/SP-MZIGO-26E-PASSPORT.md` and canonical August/September media: green body, installed branding, electric components, remote, hydraulic bed motion and powered lighting. These do not certify payload, speed, grade, range, runtime or completed final inspection.
- September 9 photographs still show QR graphics and blue battery enclosures. Current user request mentions QR removal, red-to-green plate change, a black box and fender requests. Preserve the dated evidence; treat final changes as awaiting confirmation unless later evidence is supplied.
- Tire/hitch ideas and rendered underglow are not installed equipment. Existing speculative upgrade records remain stored but are not represented as the buyer's confirmed customization process.
- All six supplied filenames were located in Downloads despite unavailable `/workspace/scratch/...` paths. Reviewed five logo/mascot artwork files and one residence photograph. They do not verify machine modifications; no residence photo or unrelated branding asset is added as factory evidence.
- Previous procurement markdown has older pending decal entries; newer September evidence governs the public observed-build state. Original procurement records are not rewritten.

## Implementation boundary

Keep ARDHI as flagship Asset #001; preserve both routes, MZIGO's SPP-2026-0002 identity, the restored hero image and all existing archive/build/history anchors. Prefer optional shared-component capabilities with unchanged defaults. No dependency additions or original-media replacement.

## Verification and handoff

- TypeScript, production build, all 57 automated tests, customer-safe index validation, 19-file original-media validation and whitespace checks passed.
- Extended the existing `scripts/capture-ardhi-release.mjs` native Chrome/CDP method as `scripts/capture-passport-standard.mjs`. Run against an isolated Chrome debugging port after building: `node scripts/capture-passport-standard.mjs 9237 4174 <output-directory>`. Optional `PASSPORT_SLUG` and `PASSPORT_WIDTH` select a focused repeat. Default output is ignored `tmp/passport-standard`.
- Both passports passed at 320, 390, 768 and 1440 pixels: no page overflow, broken images, missing image alt attributes, duplicate IDs or console errors. Captured and reviewed heroes, lifecycle, archives and document viewers. ARDHI remains Asset #001 with its original composition and pan/zoom document viewer.
- MZIGO: checked lifecycle/history deep links, archive chapter selection and search, actual playback of both factory MP4s, photograph enlargement, Escape dismissal and focus restoration for both dialogs, QR rendering, printable configuration record and actual PNG generation. Document unavailable/retry/empty/success behavior used explicit API fixtures; these tests do not certify the production API or existence of factory documents.
- Browser inspection found an existing malformed base64 URL in ARDHI's YF380 comparison thumbnail. Canonicalizing its encoding preserves the decoded JPEG bytes and restores loading without changing its record or caption.
- The generated record explicitly marks pending values and distinguishes its digital passport QR from any physical decal. Print output is a browser-generated record, not a signed manufacturer document.
- No standalone lint or formatting command is configured; type checking, tests and `git diff --check` are the repository checks used here.

### Changed files

- `src/components/MzigoPassport.tsx`, `src/data/mzigoPassport.ts`, `src/pages/EquipmentDetailPage.tsx`: lean page assembly, compact customization/request register, lifecycle and sourced procurement chronology.
- `src/components/MzigoPassportHeader.tsx`, `src/components/MzigoServiceRecord.tsx`, `src/styles/mzigo-passport-overrides.css`: retained hero treatment, illustration/model context, readiness and responsive presentation.
- `src/components/FleetLifecycleProgress.tsx`, `src/components/WindowSticker.tsx`, `src/components/PassportDocumentRecord.tsx`, `src/components/CanonicalPublicDocuments.tsx`: reusable linked stages, evidence-aware generated record, accessible dialog and explicit document status handling; existing callers retain their defaults.
- `src/data/equipment.ts`: MZIGO-only confirmation flags and sourced timeline additions; existing IDs and specification values remain stored.
- `src/app/negotiationEvidenceMedia.ts`: one existing thumbnail URL encoding repair, identical decoded bytes.
- `tests/mzigo-factory-media.test.mjs`, `tests/routes.test.mjs`, `scripts/capture-passport-standard.mjs`, this audit: regression checks and repeatable handoff evidence.

### Remaining factual verification

Later factory evidence is still needed for QR removal, the exact red-to-green component, black battery enclosure and fenders. Wider tires/hitch/underglow remain uninstalled ideas. Manufacturer ratings/K600 designation, final QC, packing contents, payment amounts/dates/terms, transport and commissioning require their source documents. No inspection, delivery or service-readiness transition is inferred from this release.

The release uses the existing main-branch validation and incremental FTP deployment workflow. Final commit, workflow outcome and live verification are reported in the task handoff rather than inferred from local checks.
