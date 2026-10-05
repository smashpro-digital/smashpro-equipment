# Passport Automation v1

Base: `a190948` (current origin/main at audit, 2026-10-04). Work is isolated on `feat/passport-automation-v1`. The supplied sprint attachment ends at item 4 of the definition of done; the detailed preceding requirements govern this implementation.

## Release boundary

LIFTMATE uses the generic renderer. ARDHI and MZIGO retain their protected renderers. ARDHI preserves DOM injection, compact summary transformation, shipment client, manufacturer profile, archive navigation and document interactions. Only its Drive history declaration moves into a data module, without changing any record text or IDs. MZIGO's renderer, factory media, configuration, payment/status sources, shared styles, document client and public route are unchanged and hash-protected. Mature renderer consolidation remains Phase 2; this is intentionally a hybrid release.

Production deployment is manual and has not been performed by this sprint. The workflow, required outputs, HQ shipment prerequisite and public-index validator remain protected by regression hashes. A passing local build does not establish production or device acceptance.

## Architecture audit

| Area | Existing responsibility | V1 treatment |
| --- | --- | --- |
| `EquipmentDetailPage.tsx` | Machine selection for ARDHI, MZIGO, NYASI and commissioning pages | Protected legacy routing retained |
| `ArdhiPassportPage.tsx` | Hides summary fields after render; assigns summary icons; injects Drive history; relabels journey metrics | Renderer retained; Drive history declaration extracted exactly |
| `ArdhiPassportJourney.tsx` | Flagship hero, identity, 44 specs, sticker viewer/export, factory options, documents, expandable history, media chapters, shipment journey, partners, future service | Protected source hash; not replaced by a generic approximation |
| ARDHI CSS | Base visual layout, compact summary, manufacturer PDF layout, history enhancements | All four files protected unchanged; shared global styles also retained |
| `LiftMatePassportPage.tsx` | Machine copy, section ordering, navigation, configuration, spec groups, field tests, media/document gaps, relationships and history | Removed; route resolves a public record into `EquipmentPassport` |
| `liftmateEquipment.ts` | Public equipment identity, OEM values, proposal configuration, planned field program, concept provenance | Existing canonical data reused; stable spec IDs added; obsolete independent lifecycle removed |
| `equipment.ts` / `types/equipment.ts` | Shared showroom and legacy equipment records | Preserved; optional stable specification/group IDs added |
| `PassportHero` | Shared visual hero primitive | Reused; concept image retains original bytes and full composition |
| `PassportEvidenceRecord` | Expandable dated evidence with provenance | Reused; state/source comes from projected records |
| `PassportDocumentRecord` | Printable configuration dialog / WindowSticker | Reused through explicit public-only compatibility adapter; pending documents never get invented URLs |
| `FleetLifecycleProgress` | Progress and metric presentation | Reused with template stages and evidence-derived status; no fabricated percentage for configuration planning |
| `MzigoPassportPage.tsx` / `Mzigo*` components | Mature OEM build story, archive, controller evidence, service and document interactions | Protected source hashes; unchanged |
| `mzigoPassport.ts`, `mzigoFactoryMedia.ts`, `mzigoPlatform.ts`, `mzigoArchive.ts` | Public-safe payment status, lifecycle gates, dated factory originals, configuration and archive relationships | Unchanged sources feed the new build/server-only `mzigoCanonicalPassport.ts` adapter |
| `App.tsx` / Vite | Explicit routes / physical Apache HTML entries | Generic routes come from projected records; legacy routes and static entry list retained |
| Index | Vite-owned allowlisted showroom JSON | Shared index projector consumes the same Passport projection for migrated records; legacy entries retain v1 behavior |
| Public/private boundary | Legacy `publicDisplay` filters and post-render transformations | New renderer receives only a build-time public projection; canonical/private module is absent from its client dependency path |

Additional legacy DOM behaviors live in `manufacturerProfileMount.tsx`, `negotiationEvidenceMedia.ts` and calendar metric correction. These remain Phase 2 audit boundaries, not silently removed features. The existing public manufacturer business contact is distinct from private procurement correspondence.

The generic shell reuses the existing `liftmate-*` CSS names as a presentation skin. These names do not select equipment content; template definitions, projected records and the section registry do. The renderer has no fleet-ID presentation branches.

## Data and evidence contracts

`passportAutomation.ts` defines equipment assets, builds, records, evidence states and provenance. `PassportRecord.kind` separates partners, configuration, specifications, lifecycle events, evidence, media, documents, field tests, modifications and relationships. Relationships use stable IDs, not titles. `passportRecords.ts` adapts the existing equipment records instead of creating another fleet registry. The asset ID continues to be the existing fleet identity; a later HQ adapter can supply the same contracts.

LIFTMATE specifications have explicit stable record and group IDs. The protected legacy adapter gives existing ARDHI and MZIGO specifications/gallery entries deterministic positional IDs where the legacy source has none. Those legacy IDs must be reconciled with canonical HQ IDs before editing/reordering or migrating that renderer; do not use them as new operational identities.

The two templates define section order, labels, lifecycle stages and meaningful pending media/document destinations. Empty optional sections are omitted. Factory-import shipping and commissioning sections require records; no completion is inferred from template position. ARDHI's repository snapshot describes reported ocean transit, while its protected runtime continues to use Digital HQ and its unavailable/unverified states.

Proof received, proof approved, build authorization, deposit and production are distinct event types. The partner-proof stage completes only with an explicit approval event backed by approved or verified public evidence. A production state requires a separate production-start event and a public factory/partner evidence record. Concept artwork cannot carry factory, production or field evidence flags, even if upstream input sets them. Field tests carry explicit test states; all five LIFTMATE chapters remain planned and vehicle fitment remains unvalidated.

## Projection boundary

### MZIGO amendment audit and lifecycle decision

The repository at `a190948` records factory build completion September 9, revisions September 14, quality inspection/build approval September 15, and final payment October 1, 2026. Shipping preparation is current. Final securement confirmation, shipping inspection, crating, freight booking, departure, cargo identifiers, receipt and commissioning remain pending. Earlier anchor photographs do not close the final shipping-securement gate. The 500 kg payload and K600 designation are retained with manufacturer-verification qualifications; no numeric performance rating is upgraded to verified.

MZIGO remains `factory_import` after source audit, not because it shares ARDHI styling. Both records describe custom factory configuration, production, acceptance, procurement and import before commissioning; the evidence does not establish a materially different lifecycle requiring a third type. The factory template now distinguishes factory completion, final payment, shipping preparation, packing and carrier acceptance. MZIGO's protected display retains its finer-grained export milestones. A future distinct OEM manufacturing workflow can justify `oem_custom_build`; no type is added for branding alone.

The adapter preserves every public timeline entry verbatim, original media IDs/URLs/captions/dates/categories, both factory videos and their posters, black/green configuration, controller photographs and callout relationships. Only the two already-public, amount-free MZIGO deposit/final-payment summaries bypass the generic private purchase filter. Promotional hero and earlier concept art remain explicitly non-evidence. The source has no static factory documents; controller photography is not relabeled as a downloadable manual. Live documents still come from the unchanged canonical public-document service. New pending document/field-validation records honestly represent gaps.

Shipment, transit, receipt and commissioning require asset-owned public evidence with an appropriate source and exact milestone classification. Build/payment/packing records cannot satisfy these gates, even if an upstream current-stage label or completion event claims otherwise. Supplier-reported transit remains qualified and cannot complete a transit stage without verified evidence; ARDHI retains its existing reported transit record and HQ runtime authority. The MZIGO safety test attempts every shipping/arrival/commissioning alias with paid/completed/packing evidence and confirms an awaiting-shipment projection.

### Cross-Passport contract matrix

| Contract | LIFTMATE | ARDHI | MZIGO |
| --- | --- | --- | --- |
| Identity / build type / current state | Partner planning | Factory import, reported transit | Factory import, paid / shipping preparation |
| Specifications / configuration | Attributed OEM facts and proposals | Existing specifications and factory options | As-built configuration; numeric claims qualified |
| Partners | Pairon proposal | Factory / supplier records | Kylin factory collaboration |
| Lifecycle / history | Planning; production gated | Factory and import history | Production, approval and payment independently recorded |
| Evidence / media | Concept; authentic media pending | Factory/export evidence | Original photos, assembly video, walkaround and controller evidence |
| Documents | Pending destinations | Original public documents | Pending static documents; protected live document client |
| Field validation | Five planned tests | Template supports future field validation | Explicit pending field-validation record |
| Privacy projection | Explicit allowlist | Explicit allowlist; legacy editorial reconciliation pending | Explicit allowlist; public payment status only |

The automated matrix checks all three identities, templates, required sections, record support and private-record exclusion. A supported domain capability does not mean evidence already exists.

### Public transport

`passport-public-plugin.ts` exposes only projected records through `virtual:passport-public`. Canonical modules and `procurement` objects are build/server inputs. React imports the virtual public module; it does not import `passportRecords.ts`. Asset fields, build copy, gate fields, record fields and provenance are explicitly copied. Private records are removed; source references require explicit public source visibility; dangling evidence references are removed; unsafe URL schemes and credential-bearing URLs are rejected.

Visibility flags are publication decisions, not a text-classification system. Editors must not place private text into public title/detail fields. The allowlist excludes unknown procurement keys at every modeled object level. The tests deliberately inject private prices, deposits, refunds, emails and phones into root/nested fixture records and check projected JSON, rendered HTML and index serialization. Concept provenance and private evidence references have separate tests.

The new ARDHI projection excludes purchase records and sensitive Drive commercial entries. The legacy ARDHI renderer already publishes some commercial narrative and source descriptions; v1 preserves that behavior rather than silently rewriting history. The complete extracted source remains intact for audit. Phase 2 requires an explicit editorial reconciliation between legacy public content and the stricter new projection before switching renderers.

## Adding a Passport

1. Supply an existing canonical asset identity, build type, build record and stable-ID records. Keep procurement private and publish only reviewed records.
2. Choose `renderer: 'generic'` in the build. Select one of the two validated templates. A new equipment asset does not require a React page or component import.
3. Add the public showroom record if the asset is meant to be discoverable. Existing showroom summaries remain the source of capability taxonomy.
4. For static production hosting, add the physical HTML shell and explicit Vite entry. This is the remaining route-generation boundary; the sprint does not change Apache/FTP behavior.
5. Run the validation matrix and browser harness. The test-only `SP-TEST-PARTNER-27` lives under `tests/fixtures/passport`; it is never added to the registry, showroom or Vite entry list.

## Regression evidence

Capture script: `node scripts/capture-passport-automation.mjs <base-url> <phase>`.
Artifacts: `docs/release-captures/passport-automation/{production,before,reference,after}` at 390, 768 and 1440 px. JSON captures preserve headings, anchors, links, history, image state, overflow and runtime errors; PNGs preserve the rendered layout. `before` is the pre-migration dev capture. `reference` is an untouched `a190948` production bundle with a controlled shipment outage, used for deterministic comparison with `after`. Production captures use live dependencies. The reference bundle's local media-copy hook could not copy a cross-drive junction; the read-only reference server serves the unchanged original media directly. This local workaround does not alter the reference JS/CSS or production build configuration.

The after run compares ARDHI headings, IDs, links, history and overflow with the built reference, checks sticker identity and Escape dismissal, and opens a history deep link. MZIGO additionally compares complete page text, original image URLs and video/poster relationships, and opens its final-payment history deep link. Its reference/candidate captures use a controlled public-document outage; production captures retain live dependency behavior. LIFTMATE checks the generic renderer marker, decoded concept/OEM images, contain fit, valid section destinations and configuration dialog. Controlled captures require local images to decode before taking screenshots. Videos without posters must decode and seek to a fixed first frame; metadata alone previously allowed a black surface during disk contention. Videos with posters retain their poster presentation. `compare-passport-screenshots.mjs` compares both mature Passports' full-page dimensions and pixels with an unchanged 1% threshold; the JSON report records the actual differences rather than claiming byte-identical screenshots.

Live ARDHI showed **Shipment update unavailable** during this audit. MZIGO's live public-document service was unavailable; existing controller photography and pending-document labels remain visible, but no live factory-document inventory is asserted. These are external dependency results, not converted into arrival, delivery or commissioning claims. Local baseline captures showed no horizontal overflow or page exceptions at the required widths. Timeline row counts include phase headings and must not be reported as a count of canonical lifecycle events.

## Phase 2 prerequisites

- Reconcile the complete legacy history, payment narratives, manufacturer mount, negotiation media and calendar transformations into reviewed structured records.
- Resolve the difference between currently published commercial history and new public projection policy without deleting the canonical archive.
- Preserve confirmed/unverified/unavailable shipment states, source attribution, approximate routes and no-live-GPS boundaries.
- Migrate only one mature Passport at a time, after complete public data/provenance/media/document coverage, lifecycle truth, mobile/desktop screenshots, navigation, URL, index, privacy and test parity pass. Keep ARDHI and MZIGO protected on any material divergence. Partial normalization does not authorize a renderer migration.
- Replace transitional legacy positional IDs with canonical HQ IDs before reordering records or establishing external relationships.
- Automate physical HTML entries only in a separate, validated static-hosting change.

## Validation record

Validated on 2026-10-04:

- `npm.cmd ci` completed with the existing lockfile; no dependency versions changed.
- `npm.cmd run validate` passed after the amendment: TypeScript, all **112 tests**, production build, the existing five-record public index and MZIGO media checks, and the new Passport artifact gate. The focused 14-test automation suite also passed after the additional concept-evidence negative case.
- `npm.cmd run test:shipment:browser` passed all **12 tests** using installed Chrome. This covers confirmed/unverified/stale/unavailable shipment states and retry behavior at mobile/desktop widths.
- Live production captures for all three assets completed at **390, 768 and 1440 px**. They are reference observations, not evidence of deploying this branch.
- Built-reference and candidate browser checks passed at all three widths. ARDHI retains **55 timeline rows including phase headings** and MZIGO retains all **9 public history entries**, their documents, anchors, media and expandable history. LIFTMATE has no horizontal overflow and its concept/OEM media load.
- Full-page comparison covers **both mature Passports** with identical dimensions and the original 1% threshold. The tolerance counts channel differences greater than 8; exact final measurements are in `docs/release-captures/passport-automation/visual-comparison.json`. Neither mature renderer was replaced.
- `git diff --check` passed.

Final amendment pixel comparison (changed pixels / percentage, identical dimensions):

| Protected Passport | 390 px | 768 px | 1440 px |
| --- | --- | --- | --- |
| ARDHI | 6 / 0.000061% | 595 / 0.00423% | 1,752 / 0.00709% |
| MZIGO | 0 / 0% | 97 / 0.000545% | 0 / 0% |

The final production build and public-artifact checks were repeated after the concept-evidence guard. All nine browser captures use that final build; both protected comparisons passed after first-frame decoding was added to the harness. Live MZIGO snapshots were refreshed after extending image decoding to production captures: every rendered image loaded at all three widths. The 12-case shipment browser suite above belongs to the initial sprint validation; the amendment did not alter that client or its protected renderer.

The original checkout's unrelated untracked media is untouched. Generated `dist` uses a local junction to a task-specific D: directory because the system drive was nearly full; this is ignored local build storage and is not part of the deployment or repository change. Local headless Chrome checks are complete; physical-device acceptance and production deployment/readback of this branch remain release steps.
