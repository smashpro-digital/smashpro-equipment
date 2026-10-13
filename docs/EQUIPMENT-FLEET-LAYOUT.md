# Equipment fleet layout

The Field Fleet section is rendered by `src/pages/HomePage.tsx` from the existing equipment collection, filtered by `showroomGroup` and sorted by `showroomOrder`. `FleetEquipmentCard` and `fleet-layout.css` provide the new presentation without changing fabrication, Passport, or affiliate sections.

## Layout and evidence

- One column below 768px; two from 768px; four from 1600px with a 1440px section maximum. Fixed grid tracks keep incomplete rows at the same width as preceding rows.
- Every card has a 16:10 image area, solid dark content surface, role, name/model identity, existing status and description, up to two confirmed specifications, and a bottom-aligned Passport link.
- Optional collection presentation metadata selects source specification labels and existing public images. New collection entries inherit the component and a confirmed-specification fallback automatically.
- ARDHI and MZIGO use existing factory photos. LiftMate uses the existing OEM product reference, explicitly labeled. NYASI retains the existing labeled concept artwork because no clean approved public photograph is available.
- No operational specifications, status, availability, Passport destinations, or evidence history were changed. Protected source hashes were refreshed only for the reviewed presentation metadata additions.

## Validation

Passed: 138 Node tests, TypeScript checking, production Vite build, public index/media/Passport validators, ARDHI artifact/evidence verification, 32 protected build-output checks, and `git diff --check`. All 16 browser cases passed across the initial run and targeted rerun. The first run had two navigation timeouts under severe local memory pressure and one test-selector ambiguity on the existing nested NYASI main elements. The selector was narrowed and the three affected cases passed on rerun. Browser tests cover 375, 768, 1024, 1440, and 1920px, including keyboard focus, image ratios, equal row heights, bottom-aligned links, readable body text, and horizontal overflow. Five- and seven-entry previews extend the actual collection only in an intercepted browser module response; no synthetic entries are written to production data.

All four existing Passport destinations returned successful responses and rendered their expected fleet identities. The five- and seven-entry previews passed at every tested width; final-row cards measured 342px in four-column mode and 608px at 1440px. Documentation links resolve, and production data contains no preview entries.

Reproduce with `npm test`, `npm run build`, `npm run validate:index`, `node --experimental-strip-types scripts/verify-ardhi-artifact.mjs`, and `npx playwright test --config playwright.fleet-layout.config.ts`.

## Screenshots

Before captures show the live default-branch layout at the start of this change. After captures show this branch locally. Captures are section-only; their filenames indicate viewport width.

| Width | Before | After |
| --- | --- | --- |
| 375px | [Before](release-captures/fleet-layout/before-375.png) | [After](release-captures/fleet-layout/after-375.png) |
| 768px | [Before](release-captures/fleet-layout/before-768.png) | [After](release-captures/fleet-layout/after-768.png) |
| 1024px | [Before](release-captures/fleet-layout/before-1024.png) | [After](release-captures/fleet-layout/after-1024.png) |
| 1440px | [Before](release-captures/fleet-layout/before-1440.png) | [After](release-captures/fleet-layout/after-1440.png) |

[1920px four-column preview](release-captures/fleet-layout/after-1920.png). Adjacent JSON files record measured layout and growth results.

This change is for draft review only. It is not merged or deployed.
