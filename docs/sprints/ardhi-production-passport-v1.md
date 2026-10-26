# SP-ARDHI-26 Production Passport v1

## Architecture audit before implementation

Reviewed against production/main `272022274bca37ef90a41a04e94d496dbf8072e4` on October 26, 2026. The dirty primary checkout was preserved; work uses an isolated worktree and `feature/ardhi-production-passport-v1`.

- `ArdhiPassportPage` delegates to the protected `ArdhiPassportJourney` renderer. `equipment.ts` remains the existing public asset collection; `passportRecords.ts` projects its canonical records. No second asset identity is created.
- Journey already records delivery, while History preserves factory, procurement, vessel, port, freight and crate-opening evidence. Original drive-history records are untouched.
- Two overlapping commissioning lists existed. This change uses `commissioningChecks` as the single public checklist; Homecoming exports a compatibility alias and links to Inspections.
- Shared hero, documents, media permissions, sponsorship forms, QR generation, attachment records and other equipment renderers remain in place. Expo is now a subordinate archive, including existing query links.
- Fleet Passport Operating System documents describe a proposed authenticated gateway, not a working operator portal. SPGo source has inspection, checkout, incident, media and maintenance resources, but that does not verify a production Passport handoff or authorize an anonymous visitor.
- Atlas uses a public asset location read. Historical shipping context is preserved; no new current coordinates or geolocation collection are introduced. Precise operator/jobsite locations require protected HQ/Atlas access.
- The current shipment API was previously observed returning 404. This sprint does not repair it or claim live operational telemetry. The existing delivery gate and shipment monitor are unchanged.

## Public presentation and evidence

Hero retains the existing custom ARDHI artwork, with a separate readable copy area and responsive crop. Production navigation is Overview, Journey, Inspections, Maintenance, Media, Attachments and History. Primary actions open asset status and Journey; no fictitious operator portal is added.

Delivery remains **Delivered / Receiving inspection**. Only freight delivery is passed. Crate opening and fuel verification are in progress, first startup needs attention, and final approval is blocked. Other checks are not started. Even reviewed photographs do not establish complete unboxing or commissioning approval.

The owner reported gasoline added and an unsuccessful first engine-start attempt on October 26. `ardhi-first-start-attempt-20261026` is reused in the asset timeline and Passport projection, with a pending-evidence startup-attempt event, not a completion or engine-failure diagnosis. Cranking, battery, fuel level/valve, choke, emergency stop, interlocks, oil, warnings, guidance and resolution remain undocumented. There is no timestamp beyond the supplied date.

`firstJobPresentation` now requires every required check to be passed, reviewed and evidence-supported before a completed job can become Project 001. All readiness flags remain false. No database, persisted operator report or deployment is created.

## Manual applicability

Existing document: `/equipment/documents/sp-ardhi-26/yfe380-operator-instruction-manual.pdf`, 47 pages, existing manufacturer-supplied September 2026 record. Candidate date September 4 was supplied in the brief; the exact revision date is not independently established here. Rendered PDF page 2 shows a wheeled loader and blank machine/engine identification fields. The source document's verified status does not confirm applicability to delivered tracked YF380 or its engine. Obtain machine plate, engine model/serial evidence and manufacturer confirmation before using model-specific procedures or service intervals. No mechanical adjustments are prescribed.

## Media and ecosystem

Seven collections: delivery, unboxing, first start, commissioning, field tests, maintenance and attachments. Reuse the five existing delivery/unboxing photo IDs; no new photos or videos are fabricated. Missing content is marked AWAITING MEDIA. YouTube Shorts and full videos continue through existing EquipmentWatch publication/permission gates and SmashPro HQ. Garage is excluded.

Still needed: publishable R+L confirmation, delivery video, completed crate inspection, inventory, restraint removal, engine identification/inspection, startup-attempt evidence, successful startup, fluid/safety checks, first movement, attachment test and final sign-off. Review every upload for addresses, labels, GPS and private operator data before publication.

Existing Media Center, Equipment Showcase, WordPress story entry, Digital HQ, partner records and Smart Key links are preserved. Do not create duplicate HQ media or WordPress records. Register future media against SP-ARDHI-26 and existing canonical asset/record IDs. Freight/manufacturer relationships are not sponsor approval; R+L is identified only as the documented carrier. No driver lead or private contact is published.

## Protected backend requirements (not implemented)

Reuse existing Digital HQ ownership and SPGo authentication. The public Passport performs no operational writes. A scan opens the public page or existing Smart Key sign-in; it does not grant equipment authorization, start work or establish custody.

Before operator launch, verify authorized handoff, session/capability checks, asset access, CSRF protection, audited writes, idempotency, media moderation and public/private projections using the FleetOS contract. Reconcile existing APIs/schema before proposing any migration; no endpoint URL or migration is invented here.

Protected commissioning record contract needs: canonical asset ID, checklist step ID, status enum, observed-at timestamp (nullable), authenticated inspector/operator reference, notes, canonical photo/video/evidence IDs, issue records, resolution notes, approval identity/time, revision and audit trail. Public projection excludes operator identity and exact location; unknown values remain null. Current editorial records are source-controlled projections, not simulated submissions.

Maintenance records need verified engine hours, applicable manufacturer interval, parts, costs, technician identity, evidence and next due. Costs and identities stay protected. Baselines for engine, hydraulics, tracks, battery, filters, grease points, attachments and safety are pending; no intervals or completed work are invented.

Operator scope after backend verification: machine QR, SP Tech sign-in, equipment authorization, check-in/out, hour recording, pre-operation inspection, condition photos, maintenance reports and protected Atlas observations/jobsite history. Public location remains generalized. Reuse existing SPGo resources only after contract and production authorization testing.

## Validation and release

See validation results appended after execution. Review this PR before merging. **Not merged or deployed.** Existing production and QR destinations remain unchanged. Any later deployment must use the established Equipment workflow and its scoped evidence gate; no direct database connection or new service is required for this presentation change.

Recommended next phase: evidence-led receiving inspection and engine identification, followed by protected operator integration with verified HQ/SPGo contracts. Do not mark operational or rental-ready until commissioning is completed and reviewed.

### Executed validation

- `npm.cmd run validate`: TypeScript, 174 unit tests, Vite production build, public index, MZIGO media and Passport artifact/privacy checks passed.
- Final `npm.cmd run build` passed after hero crop and service-table presentation refinements.
- Playwright: 11 flagship/Expo/QR scenarios, 6 delivery/production scenarios, 14 shipment scenarios passed (31 total). Chromium at 320, 390, 768 and 1440px; no horizontal overflow. Keyboard disclosure, focus restoration, unique IDs, navigation targets, API failures and media decoding covered. This is browser emulation, not physical-device acceptance or a full WCAG audit.
- Five reviewed delivery/unboxing image hashes and metadata checks passed; no source image bytes changed.
- `node scripts/verify-ardhi-delivery.mjs` passed: one canonical public ARDHI record, Delivered / Receiving inspection, five approved photos, no rental availability published.
- Live read-only checks returned HTTP 200 for the current Passport QR destination, Smart Key, Media Center, Equipment Showcase, WordPress home, Digital HQ entry and manual. This is reachability only; authenticated operator capability is unverified.
- `git diff --check` passed. Original protected drive-history block, other machine blocks, shared renderer/styles and deployment workflow remain protected by existing regression checks.
- Before screenshots are production captures at baseline 2720222; after screenshots are the locally built proposed revision. They are not evidence of deployment.

| Width | Before | After |
| --- | --- | --- |
| 390px | [Production hero](../release-captures/ardhi-production-passport-v1/390-before-hero.png) | [Proposed hero](../release-captures/ardhi-production-passport-v1/390-after-hero.png) |
| 1440px | [Production hero](../release-captures/ardhi-production-passport-v1/1440-before-hero.png) | [Proposed hero](../release-captures/ardhi-production-passport-v1/1440-after-hero.png) |
