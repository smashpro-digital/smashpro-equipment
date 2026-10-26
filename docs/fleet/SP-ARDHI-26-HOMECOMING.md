# SP-ARDHI-26 Homecoming and operational handoff

Release preparation: October 26, 2026. Canonical public identity: SP-ARDHI-26 / YF380. This collection is an editorial association, not a new equipment registry or backend media record.

## Publication and evidence

`src/data/ardhiHomecoming.ts` defines the 14 requested collection categories and references the existing reviewed gallery IDs. Publisher: **SmashPro HQ**, never Garage. Supported publication formats: photography, YouTube full-length, YouTube Shorts, vertical social and Passport evidence. Only real, reviewed publications receive media IDs; empty categories are explicit pending slots. The tool-case photograph supports partial unboxing, not acceptance of the complete attachments inventory.

Reuse the existing HQ media record ID, asset association and original platform video ID. Confirm public/equipment placement permission, publication and verification dates. Project approved YouTube records into `ardhiDeliveryVideos`; its existing renderer supports full-length and short aspect ratios and requires a user click before connecting the player. Vertical social media stays a publishing association until an approved platform URL exists. Do not invent embeds, duplicate WordPress attachments, create speculative article URLs or post automatically. The existing Media Center and site home remain the entry points until an ARDHI-specific article is published.

## Commissioning record contract

The public plan has all 12 milestones, date, status, notes, photo IDs, video IDs and inspection evidence IDs. Delivered is complete; unboxing is partial (crate opened/panels removed). Ten others are pending with null dates. Existing detailed checklist and historical records remain intact.

The future **protected** HQ record must associate each milestone with the existing canonical equipment row and contain: milestone ID, observed date, status, server-derived operator reference, private notes, reviewed public summary, existing photo/video/inspection references, reviewer identity, review timestamp and audit event. Operator references and private notes must never enter this static public data module. No private operator value has been collected or guessed. Completion requires reviewed evidence; inspection gates need actual inspection results and reviewer sign-off, not just an image. Readiness remains explicitly false in `ardhiReadiness`; these frontend flags do not update an operational system.

## Fleet Passport Operating System baseline

The repository already contains `docs/fleet-operating-system/architecture.md`, `api.openapi.json`, `components.md` and responsive operator/check-in/check-out wireframes. These are explicitly proposals, not an activated operator system. Reuse them rather than creating another protocol. The proposed same-origin `/api/passport/v1` gateway is not provisioned by this static site; the proposed `passport.*` grants require mapping to real HQ policy. Preserve no-store private responses, CSRF, server-derived actor, assignment/asset scope, idempotency and immutable journal semantics. Existing wireframes remain review-only outside the production entry list; the public readiness notice is the only new frontend operator surface.

## Ecosystem audit and remaining work

| System | Inspected source / existing connection | Readiness and boundary |
| --- | --- | --- |
| Equipment Showcase | Canonical `equipment.ts`, existing fleet card/public URL | Same asset and delivered label; no duplicate machine. |
| Passport records | `passportRecords.ts`, public projection and protected regression fixtures | Receiving inspection; original factory/export/vessel/port records retained. |
| HQ media / WordPress | Existing `/media/`, `/`, `@SmashProHQ` | Navigation only; no newly published article or remote media collection claimed. |
| Partner profiles | Existing ARDHI Expo/sponsor and partner links | Preserved; inquiry is not partner approval or a new sponsorship. |
| Fleet Passport OS | HQ `docs/fleet-passport-architecture.md` in `hq-fleet-location-20260911` | HQ owns canonical row, identifiers, evidence and lifecycle. Architecture source is not proof of deployed bindings. Resolve SP-ARDHI-26 to its existing row; never seed a second asset. |
| Smart Key | HQ `ops/smart-equipment-key/public/k/ARDHI26-K01/index.php` in `hq-smart-key-direct` | Website session explicitly is not operator authorization. Checkout/return/inspection are described as future work. Preserve existing route, authentication and QR anchor. |
| SPGo Fleet | `api/includes/spgo_fleet.php`, `docs/sp-fleet-mvp.md` | Existing resources include fleet checkout/return inspection, media upload, incidents, reservations and admin maintenance. Contractor identity is derived from bearer session. Source presence is not a live deployment or ARDHI assignment test. No new endpoint or request invented. |
| Atlas | Equipment `domain/atlas.ts`, `AtlasStatusPanel`; HQ architecture | Existing historical public location projection remains separate from delivery proof. Protected exact locations must never flow to the public Passport. No new observation or location registration. |

Before enabling operator check-in: verify deployed SPGo resource contracts and canonical ARDHI mapping; authenticate SP Tech and enforce equipment/assignment scope server-side; verify approved actor/inspection transitions, monotonic engine hours, approved condition uploads, checkout/return and incident/maintenance behavior. Define CSRF/session mediation for browser use rather than placing bearer tokens in public URLs. QR scans open a workflow and never prove custody, start a job or grant authorization. Atlas observation submission needs a protected approved adapter, explicit location consent, provenance and private-only projection. Test unauthorized, expired-session, wrong-asset, duplicate submission and outage cases. No operational form is enabled here.

## Release and remaining evidence

Owner authorized merge/deployment of PR #115 in the production-release mission. Use the existing manual main-branch GitHub workflow, including shipment release health checks; no database, SPGo, WordPress or authentication deployment. Verify the deployed commit and decoded images on mobile/desktop, public data and privacy. Preserve delivery source originals. Public JPEGs retain only orientation and ICC metadata; no GPS/vendor payload.

Still needed: receiving inspection, complete inventory, shipping-base removal, assembly verification, engine identification/inspection, hydraulic/fluid inspections, actual first start/movement, operator familiarization, reviewed commissioning sign-off, field validation and first customer deployment. Published HQ videos and any dedicated WordPress article/media IDs remain pending. Carrier document is optional if a privacy-reviewed publishable version is available. Recommended next milestone: authenticated receiving-inspection evidence capture against the existing canonical asset, before operational check-in activation.

## Release review results

- PR review found a canonical arrival-stage mapping mismatch and stale browser expectations. Delivery now uses the existing `arrival` / `completion` contract, with regression assertions for complete arrival, current receiving inspection and pending commissioning. Existing milestone IDs, historical records and photo IDs remain unchanged.
- `npm run validate`: TypeScript, 171 unit tests, production build and public-index/MZIGO-media/Passport artifact checks passed.
- Delivery browser suite: 4/4 passed at 390/768/1440; all five images decoded, milestone plan and operator notice verified. Updated captures are local previews, not deployed screenshots.
- Existing shipment browser suite: 14/14 passed, including API unavailable/timeout/cache and MZIGO regression. Existing flagship suite: 11/11 passed at 320/390/768/1440, including archive, sponsor, QR identity and keyboard interactions.
- Ten additional local browser checks passed: MZIGO, NYASI, UMBA, LIFTMATE and AKASO at 390/1440, HTTP 200, headings, no horizontal overflow or JavaScript errors.
- Production read-only checks: Passport, Showcase, Media Center, WordPress home, dashboard and Smart Key all HTTP 200. Production browser review at 390/1440 still shows the old port-processing page with no delivery gallery. Anonymous availability is not authenticated operator verification.
- **Release hold:** the required shipment health check returned HTTP 404 from `https://api.smashpro.app/api/fleet/shipment/SP-ARDHI-26`. `docs/deployment.md` requires `shipment_release=true` for shipment/evidence changes. No merge/deploy is performed while this gate fails. A scoped delivery-evidence gate requires the owner's pending approval; the outage is not suppressed and no backend data was changed.
