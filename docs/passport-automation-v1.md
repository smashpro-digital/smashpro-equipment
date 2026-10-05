# Passport Automation v1

Base: `a190948` (current origin/main at audit, 2026-10-04). Work is isolated on `feat/passport-automation-v1`. The supplied sprint attachment ends at item 4 of the definition of done; the detailed preceding requirements govern this implementation.

## Release boundary

LIFTMATE uses the generic renderer. ARDHI retains its protected renderer, including DOM injection, compact summary transformation, shipment client, manufacturer profile, archive navigation and document interactions. Only its Drive history declaration moves into a data module, without changing any record text or IDs. Full ARDHI declarative rendering is Phase 2; this is intentionally a hybrid release.

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
| `MzigoPassportPage.tsx` | Legacy adapter with MZIGO-specific overrides | Unchanged |
| `App.tsx` / Vite | Explicit routes / physical Apache HTML entries | Generic routes come from projected records; legacy routes and static entry list retained |
| Index | Vite-owned allowlisted showroom JSON | Shared index projector consumes the same Passport projection for migrated records; legacy entries retain v1 behavior |
| Public/private boundary | Legacy `publicDisplay` filters and post-render transformations | New renderer receives only a build-time public projection; canonical/private module is absent from its client dependency path |

Additional legacy DOM behaviors live in `manufacturerProfileMount.tsx`, `negotiationEvidenceMedia.ts` and calendar metric correction. These remain Phase 2 audit boundaries, not silently removed features. The existing public manufacturer business contact is distinct from private procurement correspondence.

The generic shell reuses the existing `liftmate-*` CSS names as a presentation skin. These names do not select equipment content; template definitions, projected records and the section registry do. The renderer has no fleet-ID presentation branches.

## Data and evidence contracts

`passportAutomation.ts` defines equipment assets, builds, records, evidence states and provenance. `PassportRecord.kind` separates partners, configuration, specifications, lifecycle events, evidence, media, documents, field tests, modifications and relationships. Relationships use stable IDs, not titles. `passportRecords.ts` adapts the existing equipment records instead of creating another fleet registry. The asset ID continues to be the existing fleet identity; a later HQ adapter can supply the same contracts.

LIFTMATE specifications have explicit stable record and group IDs. The protected legacy adapter gives existing ARDHI specifications/gallery entries deterministic positional IDs where the legacy source has none. Those legacy IDs must be reconciled with canonical HQ IDs before editing/reordering or migrating that renderer; do not use them as new operational identities.

The two templates define section order, labels, lifecycle stages and meaningful pending media/document destinations. Empty optional sections are omitted. Factory-import shipping and commissioning sections require records; no completion is inferred from template position. ARDHI's repository snapshot describes reported ocean transit, while its protected runtime continues to use Digital HQ and its unavailable/unverified states.

Proof received, proof approved, build authorization, deposit and production are distinct event types. The partner-proof stage completes only with an explicit approval event backed by approved or verified public evidence. A production state requires a separate production-start event and a public factory/partner evidence record. Concept artwork cannot carry factory, production or field evidence flags, even if upstream input sets them. Field tests carry explicit test states; all five LIFTMATE chapters remain planned and vehicle fitment remains unvalidated.

## Projection boundary

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

The after run compares ARDHI headings, IDs, links, history and overflow with the built reference, checks sticker identity and Escape dismissal, and opens a history deep link. LIFTMATE checks the generic renderer marker, decoded concept/OEM images, contain fit, valid section destinations and configuration dialog. Controlled captures require local images to decode before taking screenshots. `compare-passport-screenshots.mjs` compares full-page dimensions and pixels with an unchanged 1% threshold; the JSON report records the actual differences rather than claiming byte-identical screenshots.

Live ARDHI showed **Shipment update unavailable** during this audit. This is recorded as an external dependency result, not converted into an arrival, delivery or commissioning claim. Local baseline captures showed no horizontal overflow or page exceptions at the required widths. Timeline row counts include phase headings and must not be reported as a count of canonical lifecycle events.

## Phase 2 prerequisites

- Reconcile the complete legacy history, payment narratives, manufacturer mount, negotiation media and calendar transformations into reviewed structured records.
- Resolve the difference between currently published commercial history and new public projection policy without deleting the canonical archive.
- Preserve confirmed/unverified/unavailable shipment states, source attribution, approximate routes and no-live-GPS boundaries.
- Migrate individual ARDHI sections only after screenshot, navigation, sticker, document, media and history parity tests pass. Keep the protected route on any material divergence.
- Replace transitional legacy positional IDs with canonical HQ IDs before reordering records or establishing external relationships.
- Automate physical HTML entries only in a separate, validated static-hosting change.

## Validation record

Validated on 2026-10-04:

- `npm.cmd ci` completed with the existing lockfile; no dependency versions changed.
- `npm.cmd run validate` passed: TypeScript, all **109 tests**, production build, the existing five-record public index and MZIGO media checks, and the new Passport artifact gate.
- `npm.cmd run test:shipment:browser` passed all **12 tests** using installed Chrome. This covers confirmed/unverified/stale/unavailable shipment states and retry behavior at mobile/desktop widths.
- Live production captures for both assets completed at **390, 768 and 1440 px**. They are reference observations, not evidence of deploying this branch.
- Built-reference and migrated browser checks passed at all three widths. ARDHI retains **55 timeline rows including phase headings**, its documents, anchors and expandable history. LIFTMATE has no horizontal overflow and its concept/OEM media load.
- Full-page ARDHI comparison passed its 1% threshold: **0 changed pixels at 390px**, **199 pixels (0.0014%) at 768px**, and **462 pixels (0.0019%) at 1440px**, with identical full-page dimensions. The tolerance counts channel differences greater than 8; exact measurements are in `visual-comparison.json`. No renderer replacement was attempted.
- `git diff --check` passed.

The original checkout's unrelated untracked media is untouched. Generated `dist` uses a local junction to a task-specific D: directory because the system drive was nearly full; this is ignored local build storage and is not part of the deployment or repository change. Local headless Chrome checks are complete; physical-device acceptance and production deployment/readback of this branch remain release steps.
