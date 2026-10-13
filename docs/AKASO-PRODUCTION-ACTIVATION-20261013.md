# AKASO production activation — October 13, 2026

**HQ catalog deployed and activated; Equipment React upload blocked.** The existing release safeguard stopped before FTP upload because the Railway shipment service is offline. The new AKASO section is therefore not yet live on `/equipment/`.

## Completed release

- Equipment implementation `24505c3`, merged as `d8c56234f005411ec27cf1369c9ae478bf23fadb` in [PR #81](https://github.com/smashpro-digital/smashpro-equipment/pull/81).
- HQ scoped API implementation `8dafc77`, activation/receipt `c2dc952`, merged as `2b33e416161e9f0fff14e1ebe4ce857d0cd88c81` in [PR #227](https://github.com/smashpro-digital/digital-hq/pull/227).
- Production migration IDs: `2026-10-13-affiliate-catalog`, `2026-10-13-akaso-inventory`, `2026-10-13-akaso-equipment-activation`.
- Canonical organization/opportunity/campaign 3/3/3 and affiliate relationship 1 preserved. Equipment property 1, product 1, long tracking link 1, placement 3, editorial/affiliate permissions 1/2. Garage property 2 excluded.
- Owner waived database backups, confirmed activation, and confirmed links were generated in the active Awin dashboard. The Awin welcome confirms acceptance and website link use. No commission attribution or independently reconfirmed commission rate/cookie term is claimed.
- Migrations used only the established authenticated endpoint and local key configuration. PHP 7.4/MySQL 5.7 schema verification, inventory reconciliation and activation idempotent retry passed. Temporary gateway changes were restored and release includes removed.
- The scoped PHP release used the existing FTP procedure and byte-for-byte readback, separately from dashboard deployment. See [HQ evidence](https://github.com/smashpro-digital/digital-hq/blob/2b33e416161e9f0fff14e1ebe4ce857d0cd88c81/docs/partnerships/akaso-equipment-activation-20261013.md).

The [public Equipment catalog](https://smashpro.app/dashboard/api/public_gear.php?property=hq&placement=equipment.field-technology.akaso360) returns 200, one AKASO 360 product and one Equipment-only approved link, with no-store headers and a maximum 60-second lease. Exact output-field allowlists were checked. Garage and unknown selectors return 400; anonymous administrative catalog access returns 401. No creative, short link, Gear placement or Garage grant was activated.

## Production blocker

[Equipment production run 38425829903](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38425829903) passed typecheck, tests, build, public-index validation and protected-artifact verification. The deploy job failed in `scripts/verify-ardhi-release.mjs` before upload: expected HTTP 200, received 404 from `https://api.smashpro.app/api/fleet/shipment/SP-ARDHI-26`.

A direct read returned Railway's `Application not found` with `x-railway-fallback: true`. Authorized Railway inspection showed the existing `digital-hq` service offline, no active deployments, no staged changes, and its existing 500 MB volume still mounted at `/data/shipments`.

- Project: `e234d61c-5815-4149-90cb-8698107ddfde`
- Production environment: `4d5da3db-deb4-44e9-89f4-e11096d00dde`
- Service: `87e978cc-bd0f-4256-8c91-48bd76e89931`
- Last removed deployment selected for restoration: `af253982-4048-4379-b767-18f8c0cf7c49`, source `c72a2b9c845c564132d4a682b881d187ca95699f`

Railway rejected the restore attempt: **“Your trial has expired. Please select a plan to continue using Railway.”** The response also reported no build to copy for that removed deployment. No plan was purchased, no replacement service created, and no volume or shipment record was changed. The ARDHI safeguard remains unchanged.

## Captures and acceptance boundary

Current live-page evidence, showing the existing page before AKASO deployment:

- [390px blocked-release capture](release-captures/akaso-field-technology/live-blocked-390.png)
- [1440px blocked-release capture](release-captures/akaso-field-technology/live-blocked-1440.png)
- [Capture assertions](release-captures/akaso-field-technology/live-blocked-validation.json)

The [390px](release-captures/akaso-field-technology/approved-fixture-390.png) and [1440px](release-captures/akaso-field-technology/approved-fixture-1440.png) approved-component captures remain **local synthetic fixtures**. They demonstrate layout, order, disclosure and sponsored-link attributes, not a live deployed AKASO section. Local approval/failure/revocation scenarios passed; final live CTA/layout acceptance remains outstanding.

## Resume and rollback

1. Restore Railway account service through its existing billing arrangement. Recover the same shipment service with its current volume and canonical record; resolve build availability after the account is enabled. Do not initialize, replace or detach the volume.
2. Verify the original shipment endpoint returns safe schema-2 data and exact Equipment CORS, then pass the unchanged `scripts/verify-ardhi-release.mjs` gate against the release artifact.
3. Rerun the established Equipment `deploy.yml` workflow on main. No manual FTP bypass or alternative shipment URL.
4. Verify the actual AKASO section follows rental process and precedes contractors, the unchanged affiliate URL and disclosure, no Gear CTA, no Garage publication, and capture live 390px/1440px evidence.

The failed Equipment release uploaded nothing, so it needs no frontend rollback. To withdraw the already authorized catalog placement, use the existing authenticated placement review on ID 3 with a fresh revision/CSRF and verify the public response becomes empty. Keep migration/audit history; the owner waived database backups and no verified database restore point is claimed.
