# Expo sponsor experience validation

2026-10-10 · Local production build · Branch `feature/expo-sponsor-experience`

## Executed checks

- TypeScript and production Vite build passed. Expo code remains a separate lazy chunk: 7.58 kB JavaScript / 2.52 kB gzip, plus 2.43 kB CSS / 0.81 kB gzip. These are bundle sizes, not a measured mobile loading time.
- Existing Node suite: 123/124 initially passed. The failure was an exact source assertion for the old `ArdhiFleetConnections` call, which now has the authorized Expo duplicate-suppression prop. After updating that assertion, all 32 route tests passed; other tests and their guards were unchanged.
- Public-index validation passed with 5 customer-safe records. MZIGO media validation passed with 41 original files. Public Passport projection/index validation passed with private procurement and fixture canaries excluded. An initial index check ran before the concurrent build completed and was repeated successfully against completed output.
- Production browser suite: 11 cases covered. Seven passed in the initial run; four new Expo viewport cases passed after correcting QR verification to compare decoded pixels instead of different Node/browser PNG encodings.
- Expo viewport checks at 320, 390, 768 and 1440 px: no horizontal page overflow, duplicate DOM IDs or runtime errors. All 52 historical rows remain present. No video or iframe is mounted for the mission-film placeholder.
- Verified the twelve-option selector, insurance “To confirm” state, selected opportunity in CTA copy, existing contact destination, eight pending sponsor roadmap milestones, removal of duplicate Expo partner cards, legacy `expo=1`, `expo=true`, explicit `expo=false`, query preservation, arrival deep link and exit/re-entry behavior.
- Compared decoded QR pixels with a QR generated for the exact `https://smashpro.app/equipment/sp-ardhi-26.html?expo=true` payload. This verifies the generated image content; printed-tag scanning remains untested.
- Existing standard-mode responsive layout, commissioning evidence, document/sticker focus return, factory/arrival/Drive deep links and archive lightbox keyboard behavior passed.

Existing React `fetchPriority`, occupied HMR-port and terminal-color warnings appeared during checks. No unrelated process or source was changed to suppress them.

## Captures

Eight images: `320`, `390`, `768`, `1440`, each with `-entry.png` and `-experience.png`. The experience captures show the Attachments selection to exercise the interactive detail card. The entry capture uses instant scrolling and checks `scrollY === 0` so smooth scrolling cannot mislabel a lower-page image as the entry.

The four Expo cases passed again while regenerating corrected captures. Visual inspection covered the 390px entry, 320px sponsor section and 1440px sponsor section: the entry invitation/CTA is visible, opportunity and disclosure content remains readable, and no clipped or overlapping controls were observed.

The predecessor's default-mode captures are in `../ardhi-v4/after/`; the current standard-mode browser checks verify preserved ordering and interactions. The new screenshots show the optional sponsor enhancement, not a replacement page.

Reproduce:

```powershell
npm.cmd run build
npm.cmd run validate:index
npx.cmd playwright test --config playwright.ardhi.config.ts
git diff --check
```

## Limits

These checks use Chromium with local API-unavailable fixtures. They do not prove live contact delivery, real sponsor engagement, backend analytics, physical-device outdoor readability, printed QR acceptance, deployment or production cache behavior. The shipment browser suite was not rerun: shipment implementation is unchanged; current arrival presentation, default history and deep links were checked in the flagship suite. No backend, new analytics collector, CRM write, push or deployment was performed.

The audit, UX report, sponsor experience report and future recommendations are in [the implementation report](../../fleet/SP-ARDHI-26-EXPO-SPONSOR-EXPERIENCE.md).
