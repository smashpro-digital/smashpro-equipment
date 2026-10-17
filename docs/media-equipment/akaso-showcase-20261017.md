# AKASO 360 field-media showcase - October 17, 2026

## Rendering and boundaries

Actual route: `/equipment/sp-med-cam-001.html` -> `src/app/App.tsx` -> `src/pages/MediaEquipmentPassportPage.tsx`. Dedicated styles in `src/styles/media-equipment.css`; common PageFrame, ButtonLink, navigation and footer preserved. No heavy-equipment page, route, status or data source changed. The original dirty checkout was preserved; isolated branch `feat/akaso-passport-visual-video-20261017` starts at current main `4f027ac`.

The hero preserves AKASO 360 / Creator Combo / SP-MED-CAM-001 and Capture the work. Own the story. Shopping remains prominent on mobile. Approved official imagery is paired with an authentic SmashPro unboxing still. Sections cover unboxing, 360 storytelling use cases, reviewed field stories, actual field kit, MicroFab concepts and future operator-kit concepts. No unavailable product has an order button, price or invented stock status. Safety observers/cameras are not replaced by content cameras; early impressions are not validated performance.

## Reusable video model

`FieldMediaVideoCard.tsx` consumes `FieldMediaVideo` parsed by `src/domain/mediaEquipment.ts`. Supports video ID, title, description, thumbnail, category, related asset, recording device, status, order, publication date, Equipment channel and campaign. HQ data controls selection and ordering; no embedded video ID in the page renderer. A reviewed Unboxing category supplies the prominent first-look section; other categories populate the gallery. No video is automatically approved merely because it mentions the camera.

Before activation the preview is a keyboard-accessible button using a locally hosted thumbnail. Clicking creates an official `youtube-nocookie.com` iframe at 9:16 with descriptive title, fullscreen, lazy loading, no autoplay parameter and no forced sound. Copy explains the YouTube connection. Each card retains an external Watch on YouTube fallback. No third-party player is created on page load. Separate dataLayer events track player loading/outbound video navigation versus affiliate CTA placement; none claim playback completion or sales.

## HQ data and registration

Existing endpoint: `/dashboard/api/public_media_equipment.php?property=hq&asset=SP-MED-CAM-001`. Existing canonical asset 39, passport 4, property 1, affiliate product/link 1, campaign 3 and placement 8 stay intact. HQ PR #245 extends the existing capture/subject association rather than introducing another media registry. An unboxing is content about a camera; both supplied videos are currently subject associations with unknown capture device and exact publication date. No fabricated capture provenance.

Migration `2026-10-17-akaso-showcase-media` through the authenticated migration gateway registered:

| Video | Content | Association | Category |
| --- | --- | --- | --- |
| UfznEcnYz5k | 23 | 1 | Unboxing |
| siyujtCJmfw | 24 | 2 | First impressions |

YouTube oEmbed confirms both author identities as SmashPro HQ. The owner supplied both URLs and publication authority. Local images `sp-med-cam-001-unboxing-youtube.jpg` and `sp-med-cam-001-mailbox-youtube.jpg` copy each video's `https://i.ytimg.com/vi/{id}/hq2.jpg`. No generated camera photography. Original channel feed/search could not identify the second video; owner URL plus oEmbed resolved it.

HQ field-kit projection distinguishes owned camera, Creator Combo contents and separate carrying-case/microSD purchases from the owner brief. The case product B0G1C14LPK and October 15 purchase date are public owner-supplied facts. Existing procurement had only the Creator Combo item; no fabricated accessory transactions, amounts, serials or private notes were added. Public kit metadata is an allowlisted editorial view, not an inventory system.

Manufacturer-stated 5.7K 360 video and 72MP 360 photos were verified in AKASO's official product page metadata on October 17: https://shopakaso.com/products/akaso-360?variant=44081902846134 . They are explicitly distinguished from SmashPro testing. Package contents are owner-supplied; performance remains unvalidated.

## Affiliate and public permissions

The original catalog Awin URL is preserved byte-for-byte. Existing advertiser 69454, publisher 3121518, exact Equipment placement, product/image authorization and short-lived lease checks remain. No Amazon replacement or new tracking parameters. Affiliate authorization withdrawal removes shopping actions; public API failures/expiry remove the passport. Garage and arbitrary query fields return 400. The CTA redirect returned HTTP 200 at the existing AKASO variant; redirect behavior is not commission proof.

Disclosure: SmashPro participates in the AKASO Affiliate Program and may earn a commission from qualifying purchases, at no additional cost to the buyer. The camera is independently purchased; AKASO is not described as a sponsor. Canonical QR destination remains unchanged.

## Validation and release

156 Node tests passed; TypeScript, production build, public-index and protected-passport validation passed. PHP 7.4 projection tests cover subject association, capture uncertainty, channel/approval/rights/time gates and private-field removal. Responsive tests cover 390/768/1024/1440, affiliate attributes/disclosure, navigation/footer, no overflow, image failure, API failure/revocation, keyboard player activation, 9:16 layout, no pre-consent iframe, separate attribution and Garage/checkout exclusion. Browser iframe-contract tests mock the player response; actual player checks are reported separately.

Captures are under `docs/release-captures/akaso-passport-showcase/`, including before images and local responsive views. No backups of databases were created; temporary authenticated migration includes were removed and gateway restored. Backend `_media_equipment.php` was hash-verified after scoped deployment; repeat migration inspection reported already applied.

Frontend release uses the existing workflow on main with `akaso_release=true`, not Railway. Preserve all mandatory artifact checks. Rollback by redeploying the prior approved Equipment main; rollback the single backend API file if necessary, retaining additive data/schema and withdrawing public authorization through authenticated administration instead of deleting records. Production workflow/run/commit and live screenshot evidence are appended after release.

## Outstanding evidence

Exact video publication dates and capture devices remain unknown. No claim of complete camera field validation, physical QR scan, affiliate conversion or product availability. Original YouTube playback can depend on viewer region/browser/platform policy; the direct YouTube fallback always remains.

Release verifier correction: the local clock was approximately 20 seconds behind the HTTPS origin. The existing runtime already validates using the response Date and subtracts the complete request duration. `verify-akaso-catalog.mjs` now uses that same tested lease function instead of rejecting a valid response against the local clock; all authorization, expiry, URL and allowlist checks remain enforced.

Final local evidence: all nine browser scenarios passed (the 390px external image check passed on targeted rerun with a 20-second allowance). The real, unmocked privacy-enhanced unboxing iframe loaded the correct title and SmashPro HQ author; `real-player-local.png` records the player. No autoplay or playback-completion claim. Changed-file secret-pattern scan and diff whitespace validation passed.
