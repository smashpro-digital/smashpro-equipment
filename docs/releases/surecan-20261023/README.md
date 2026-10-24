# SURE-CAN showroom release — October 23, 2026

The actual production root is this React/Vite showroom, served at https://smashpro.app/equipment/. Web #125 and HQ #271 were confirmed merged but did not publish this root. HomePage now includes Field Support & Consumables after Attachments and a jump link. Existing fleet, passports, fabrication and AKASO components/data are unchanged.

HQ remains authoritative: [digital-hq #272](https://github.com/smashpro-digital/digital-hq/pull/272), source `8856c8d`, merge `36fe503`. The approved manifest was reconciled through the existing authenticated maintenance gateway into existing registry tables. The receipt records canonical IDs, export hash, readback, idempotence and anonymous/private-file boundaries. All temporary files were removed and the gateway restored. `src/data/surecan-public.json` is its allowlisted release export, not another registry. Future offer changes or withdrawal require a refreshed export and static deployment.

Six distinct products: five Type II fuel cans and the green Fast Flow Race Jug. The owner clarified the green sample is the race jug, not the white Utility Transfer Tank. Manufacturer pages and variant data confirm the published SKUs, colors and prices. The race jug is named “5 GALLON” but has a stated 5.5-gallon capacity; it is not for fuel or kerosene. Product URLs are retained in the export. Prices are dated; checkout confirms availability and eligibility.

The exact approved referral URL, SMASHPRO code, 10% customer offer, sponsored-link attributes, commission disclosure and sample disclosure are public. Internal commission rate, acquisition costs, gifted values and performance are excluded.

No reusable image license or brand kit was established. Under the owner's fallback, the unmodified logo and accurate product images are referenced from the manufacturer's own Wix CDN and linked to official product pages. No artwork was generated, recolored or rehosted. Product photos use 500px fit URLs, lazy loading, descriptive alt text and preserved proportions. Failed images retain an official-photo link. Rehosting requires rights evidence.

Initial local validation: 166 tests, TypeScript, production build, public index, MZIGO media and Passport artifacts passed. Responsive browser checks at 360/390/768/1440px decoded all seven images, checked the offer/disclosure and no overflow, and preserved existing fleet cards. The correct 27E catalog route is `/equipment/catalog/sp-mzigo-27e/`. Final locked-dependency and live receipts supersede previews.

Actions could not start because account payments failed or the spending limit needs increasing: HQ run 40052111056, job 120746825649. This is not successful CI. The owner authorized release and an alternative when the existing mechanism is demonstrably unusable. The runbook's bounded FTP procedure preserves preimages and verifies hashes while transferring only reviewed generated HTML, bundles and public index. Old bundles/media remain; no branch protection is disabled. No unrelated remote files are deleted.

Production evidence and the final manifest are recorded separately after upload; merge alone is not deployment evidence.
