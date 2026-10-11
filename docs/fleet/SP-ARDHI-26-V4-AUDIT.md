# ARDHI flagship audit — October 10, 2026

Baseline: `1a50b88`, plus reviewed uncommitted October 9 ARDHI port-arrival work copied from `feature/sp-ardhi-26-journey-update`. Original checkout is preserved. Implementation branch: `feature/sp-ardhi-v4-flagship-passport` in an isolated worktree.

## Findings before implementation

- HTML/React: `ArdhiPassportJourney` owns the established hero, identity, shipment, history, archive, documents and service. Hero links repeat a second navigation rail that compact CSS hides. Window-sticker actions occur twice. Documents interrupt identity-to-journey flow.
- CSS/mobile: multiple ARDHI style layers control the same sections. Fixed reading-status overlays consume mobile space; archive chapter buttons add another wide navigation surface. Preserve existing shared styles; scope new rules to ARDHI v4.
- JavaScript: history contains valuable stable IDs; `ArdhiPassportPage` injects additional archived evidence. Preserve those records and the injection lifecycle. History and archive use IntersectionObserver reveals; historical shipment map mounts even when its containing details is closed. Videos request metadata before interaction.
- JSON/data: the public index comes from existing equipment/projection contracts. October 9 manufacturer confirmation records U.S. port arrival with no arrival timestamp. Historical HQ vessel observations are distinct; neither customs release nor delivery is confirmed. Preserve canonical asset IDs, index projection and provenance.
- Narrative: mission purpose/capabilities are scattered, service is an empty introductory block, and commissioning has no per-check evidence structure. No hours should be described as meter-verified without an hours record.
- Media: retain actual factory, export and arrival imagery. Existing manufacturer/manual/sticker previews are reusable. Missing documents need clearly marked placeholders, never invented page thumbnails.
- Scope: add a flagship presentation for this existing asset, not a second inventory or an operational data-entry system. Pending plans must not appear as installed equipment, completed jobs, confirmed partners or active services.

## Implementation decisions

One five-link rail: Identity, Journey, History, Service, Documents. Mission dashboard directly after hero. Mission profile and capability summary in Identity. One mission timeline alongside current logistics; expandable archive and full historical ledger. Commissioning evidence slots, empty service grid and evidence-gated Project 001 in Service. Partners and fleet relationships share a compact ecosystem block. Documents near bottom. URL-addressable Equip Expo mode uses the same content and a QR linking to the canonical passport.

Before screenshots and measured mobile/runtime metrics: `../release-captures/ardhi-v4/before/`. These are local development captures with the shipment API deliberately offline, not production or business-state proof.
