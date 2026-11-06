# Loflin Attachment Passport V2 validation

- Asset: SP-ATT-GRP-001 / SP-GRP-ARDHI-01 / manufacturer part 0012006042.
- Source baseline: Equipment main 75b9ca1; HQ main 8f6b615e, including the November 5 final-payment evidence entry.
- Commercial state: invoice #292 paid in full; $2,297 paid; $0 due; awaiting shipment. No confirmed delivery date, carrier or tracking. Fitment and commissioning remain pending.
- Architecture: existing attachment record, route and static page emission retained. No automatic HQ synchronization. No WordPress integration change.
- Validation: 182 unit tests; production build and TypeScript; public index, MZIGO media and Passport artifact/privacy checks; git diff --check.
- Browser validation: `node node_modules/@playwright/test/cli.js test --config playwright.loflin.config.ts` — six passing tests. Layout checks at 360, 390, 768 and 1440 pixels; both featured/non-featured showroom cases. Direct navigation and reload, official product/ARDHI image loading, pending lifecycle steps, empty video state, commissioning disclosure, showroom links, one grapple and no horizontal overflow verified.
- Screenshot capture visits each section to trigger the existing scroll reveal before taking the full-page capture. Hero and timeline crops are included for legible review.
- Authentic media: existing locally served official Loflin photograph and approved October 26 ARDHI unboxing photograph. No synthetic equipment imagery or invented test footage.
- Evaluation media remains empty: nine photo stages, a vertical Shorts slot and a widescreen evaluation slot. Existing Passport gallery and consent-driven EquipmentWatch components are reused for reviewed future media.
- Limitations: no shipment, delivery, physical fitment, commissioning or field-test result is evidenced. No live production/device acceptance or deployment was performed. CI is a separate PR check.

Previews: [desktop](passport-1440.png), [mobile](passport-390.png), [mobile hero](hero-360.png), [desktop timeline](timeline-1440.png).
