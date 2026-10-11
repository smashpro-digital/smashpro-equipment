# SP-ARDHI-26 flagship review — October 10, 2026

Implemented on `feature/sp-ardhi-v4-flagship-passport` in the isolated `SmashProWork/ardhi-v4` worktree. The original `feature/sp-ardhi-26-journey-update` checkout and unrelated PCM/UMBA work are preserved. No push, deployment or live-state change is part of this review.

## Delivered

The existing passport now opens with a mission dashboard and one Identity / Journey / History / Service / Documents rail. Identity explains the mission, intended customers and fleet role, with installed configuration separated from future attachments. Mission Timeline spans factory through retirement. Current logistics report manufacturer-confirmed arrival and completed ocean transit while customs and delivery remain pending.

The full history and media archive are expandable, with all 52 original/injected history rows and their deep links preserved. Service includes twelve evidence-capable commissioning checks, an empty seven-column service log and the gated First Job / Project 001 transition. The ecosystem shows confirmed manufacturer provenance alongside explicitly pending/open opportunities and fleet links. Documents appear near the bottom with real previews or explicitly labeled document placeholders. Equip Expo mode adds a large canonical QR without creating another passport.

See the [pre-implementation audit](SP-ARDHI-26-V4-AUDIT.md) and [architecture and future recommendations](SP-ARDHI-26-V4-ARCHITECTURE.md).

## Regression evidence

- Full Node suite: **124 passed**. Subsequent focused checks after final presentation cleanup: **55 passed**, including public projection, protected history/style/MZIGO/deployment hashes, routes, port arrival and evidence gating.
- TypeScript and production Vite build: passed. Build emits a separate Expo chunk and retains the physical ARDHI HTML entry and public equipment index.
- Public-index/media/passport artifact checks: passed; five customer-safe index records, 41 MZIGO original media files, private crate exclusion and procurement/test-canary exclusion preserved.
- Flagship browser checks: six passed on both development and production builds. All fourteen shipment browser cases passed after the documented corrections and focused recheck.
- Local captures at 320, 390, 768 and 1440px: no horizontal overflow, duplicate IDs, missing alt attributes, broken loaded images or uncaught runtime exceptions; 52 historical rows retained at each width.
- `git diff --check`: passed.

The ARDHI renderer/page fixture hashes were deliberately updated for the authorized redesign. Existing history/equipment block hashes, shared style hashes, MZIGO surfaces, deployment gates and index validator protections were retained. Tests that expected the removed status ribbon now verify its dashboard replacement. The shipment regression opens the retained historical disclosure before inspecting the old feed.

The historical regression also exposed an inherited edge case: a valid reviewed checkpoint was hidden when the vessel-context response had no AIS position or shipment events. The renderer now includes that approved checkpoint in its display condition. A contradictory test that both required “Verified vessel checkpoint” and rejected “Verified vessel” anywhere in the page was narrowed to the vessel-facts field, preserving the distinction between a forwarder-reported vessel and a verified coarse checkpoint. Another inherited assertion expected marine/weather enrichment that its fixture never supplied; it now verifies that the map-only fixture produces no invented enrichment layers.

The MZIGO browser assertion was also stale: its protected, unchanged source already reports Qingdao Export Staging, rather than Shipping Preparation. The test now checks that existing canonical status while keeping the supplied Atlas fixture separate. No MZIGO implementation or evidence was changed.

## Before / after

These are local Chromium development captures with the shipment API deliberately offline; they are not production, physical-device or business-state proof. The ordinary page is captured with default disclosures closed. Element screenshots suppress the sticky rail and skip link only to avoid full-element capture artifacts; browser interactions use the normal UI.

| Viewport | Before height | After height | Reduction |
| --- | ---: | ---: | ---: |
| 320px | 28,089px | 16,795px | 40.2% |
| 390px | 27,255px | 15,666px | 42.5% |
| 768px | 19,360px | 11,808px | 39.0% |
| 1440px | 18,443px | 9,859px | 46.5% |

- Mobile: [before hero](../release-captures/ardhi-v4/before/390-hero.png), [after hero](../release-captures/ardhi-v4/after/390-hero.png), [dashboard](../release-captures/ardhi-v4/after/390-dashboard.png), [identity](../release-captures/ardhi-v4/after/390-identity.png), [service](../release-captures/ardhi-v4/after/390-service.png), [Expo QR](../release-captures/ardhi-v4/after/390-expo.png).
- Desktop: [before full page](../release-captures/ardhi-v4/before/1440-full.png), [after full page](../release-captures/ardhi-v4/after/1440-full.png), [dashboard](../release-captures/ardhi-v4/after/1440-dashboard.png), [Expo QR](../release-captures/ardhi-v4/after/1440-expo.png).
- Machine-readable [before metrics](../release-captures/ardhi-v4/before/metrics.json) and [after metrics](../release-captures/ardhi-v4/after/metrics.json); all four widths have full-page captures alongside them.

## Accessibility and mobile review

Visual and DOM section order match, with one five-link passport navigation. Navigation wraps no wider than the viewport; dashboard, capability, roadmap, commissioning and partner grids reflow. The empty service header becomes a compact two-column layout on phones while retaining table semantics for future entries. Documents stack at narrow widths. Expo QR remains within the phone viewport with a high-contrast quiet zone and a text-link alternative.

Keyboard checks cover native disclosures, visible focus, sticker Escape/focus return and the lightbox's Tab containment/Escape/focus return. Labels and text distinguish pending from installed or verified, without depending on colour alone. Reduced-motion mode suppresses the milestone animation and other transitions. No accessibility-conformance certification is claimed: manual screen-reader, text zoom and physical-device/printed-QR acceptance remain recommended.

## Performance improvements

The historical shipment map mounts only after opening its disclosure; Expo loads as a separate chunk only when enabled. Archive videos use `preload="none"`; the final default-page captures request **zero video files**. Lazy images and content visibility defer offscreen rendering. The redundant floating status/read-progress UI and its scroll-driven state updates were removed. Collapsed detailed history and media reduce the default reading distance while retaining the evidence.

Transfer bytes in capture JSON are diagnostic local-development measurements, not comparable production speed scores. No Lighthouse/Core Web Vitals result is claimed. The existing hero and shared bundles are the next performance targets.

## Operational boundaries and next steps

Commissioning, service and first-job slots are read-only public presentation data. They require an approved HQ/public-record integration before operators can submit real events; no working-hours meter or live telemetry is connected. Project 001 cannot appear from a completion flag alone. Customs release, warehouse transfer, delivery, training, installed future attachments, new partnerships and completed jobs are not fabricated.

Production publication, live HQ reconciliation, physical phone acceptance and scanning the printed Expo QR remain separate release steps. Review the screenshots and use the scoped branch for the eventual release.

## Final production regression results

- `npx.cmd playwright test --config playwright.ardhi.config.ts`: **6 passed** against the production preview at port 4187. Covers four widths, DOM/visual order, evidence states, documents, dialogs, history/Drive deep links, Expo query mode and QR generation.
- `npm.cmd run test:shipment:browser`: **11 passed** on the corrected checkpoint build; the remaining three exposed stale test expectations described above. `npx.cmd playwright test --config playwright.shipment.config.ts --last-failed`: **3 passed**, zero failed cases remaining. All fourteen cases are accounted for; this is not represented as one uninterrupted all-green run.
- Latest `npm.cmd run build`: TypeScript and Vite passed. Latest `npm.cmd run validate:index`: index, MZIGO media and public bundle/projection checks passed.
- Final captures retained 52 history rows and zero overflow, duplicate IDs, missing alt attributes, broken loaded images or runtime exceptions at all four widths.

Reproduce screenshots with `npm.cmd run dev -- --host 127.0.0.1 --port 4186 --strictPort`, then `node scripts/review-ardhi-v4.mjs after`. The capture script mocks the public API as offline. Use the dedicated Playwright config for production browser checks; it starts its own preview server.
