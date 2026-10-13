# Equipment deployment runbook

## Hosting and required dependencies

The React/Vite multi-page website is published to **https://smashpro.app/equipment/** by the existing FTP workflow, with `dist/` as the only payload and `/public_html/smashpro.app/equipment/` as the fixed destination. `vite.config.ts` sets the `/equipment/` base and physical HTML entrypoints. Hosting does not require a Railway process. Incremental deployment keeps `dangerous-clean-slate: false` and the existing FTP sync-state filename.

| Classification | Dependencies and purpose |
| --- | --- |
| Required build/publish | Source and Git LFS assets; Node 22 and locked npm dependencies; TypeScript/tests/build; public-index and protected-artifact checks; reviewed local ARDHI evidence/photo hash; GitHub artifact transfer; four FTP secrets; fixed production directory and environment controls |
| Optional runtime | Railway-hosted ARDHI shipment API, consumed only by the passport's shipment feature; Digital HQ affiliate projection for the approval-gated AKASO card; feature-specific public document/catalog and WordPress build-content reads |
| Independent infrastructure | Railway account/plan, worker operation, shipment persistent volume and provider integrations; other applications' deployment pipelines and administrative APIs |

A particular release can require its feature's live acceptance contract: use `akaso_release=true` for AKASO activation and `shipment_release=true` for shipment-specific changes. This does not make those services prerequisites of unrelated frontend releases. Never modify data or synthesize successful responses to satisfy a release check.

## Why the old shipment gate existed

Commit `cd51634` (September 12, PR #43) introduced the global healthy-shipment preflight while connecting the ARDHI passport to public HQ shipment evidence. It also made production upload manual on main. Commit `3ad7065` (PR #50) tightened that check for confirmed ocean transit. Commit `8017688` later reconciled the manufacturer-confirmed port arrival with the separate historical ocean-transit response.

The gate protected ARDHI evidence during those specific releases but remained unconditional inside `.github/workflows/deploy.yml` for every frontend upload. It combined local photograph/evidence validation with a remote fetch in `scripts/verify-ardhi-release.mjs`. AKASO run [38425829903](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38425829903) built successfully but stopped at that remote HTTP assertion (404) before FTP upload.

Repository evidence establishes the boundary:

- `src/hooks/useShipment.ts` reads the external service at runtime, retries outages after 60 seconds and recovers on online events. `src/domain/shipment.ts` validates responses and returns a labelled cache/unavailable state after failures.
- `src/components/ArdhiPassportJourney.tsx` consumes that hook for shipment tracking. `src/pages/HomePage.tsx` does not depend on it to render the Equipment page.
- The homepage describes a future rental journey and links to Contact SmashPro. It does not process reservations through the shipment API.
- `vite.config.ts` and the production build generate static files; the shipment endpoint is a runtime URL in the bundle, not a build dependency. FTP publishes those files independently of Railway.

The owner clarified on October 13 that optional Railway outages must not block unrelated frontend releases. No Railway service, subscription, volume, variables, shipment record or database migration is changed by this correction.

## Pipeline and retained safeguards

`.github/workflows/deploy.yml` retains required typecheck, tests, Vite build, public-index validation, protected pages/media, LFS video size, artifact upload/download, main-only manual production deployment and production environment controls. All four secret checks remain mandatory: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_PORT`. Their names were verified present on October 13; the workflow still checks actual nonempty availability before every upload and never logs values.

The split preserves the original rules:

- `scripts/verify-ardhi-artifact.mjs` checks the real built photograph hash and reviewed arrival/stage evidence offline. It runs both during validation and against the downloaded deployment artifact.
- `scripts/check-shipment-health.mjs` checks the real HTTP status, content type, exact Equipment CORS, schema, asset identity, chronology, historical cargo association and privacy policy. Failures remain failures.
- `scripts/verify-ardhi-release.mjs` combines both checks for shipment-specific releases. Set **shipment_release=true** when releasing shipment behavior or evidence changes; no automatic inferred milestone or policy relaxation is allowed.
- `.github/workflows/shipment-health.yml` runs the live check independently every six hours and on manual dispatch. A failing monitor is visible in Actions but is not a dependency of frontend deployment. Inspect failed runs and fix the owning data service separately.
- `scripts/verify-akaso-catalog.mjs` is mandatory when **akaso_release=true**. It uses the actual client contract, requires one authorized AKASO 360 product/link, unchanged tracking URL and disclosure, no-store headers, exact public-field allowlists, rejected Garage/unknown selectors and anonymous admin rejection.

Do not blanket-ignore failures or set `continue-on-error` on required checks. For unrelated frontend releases, both feature-specific inputs default to false; local policy and artifact checks still run.

## Release procedure

1. Start a dedicated branch from current main; preserve unrelated checkouts. Run tests, build and `git diff --check`; open a PR and pass required checks before a conventional merge.
2. Inspect current production and preserve the last successful artifact/commit for rollback. Verify live HTML and its referenced assets match that artifact. Confirm the fixed destination and secret names.
3. Run **Actions > Build and Deploy Equipment Showroom > Run workflow** on main. Select the feature-specific inputs required by this release. For this AKASO activation: `akaso_release=true`, `shipment_release=false`.
4. Confirm both validation and FTP upload succeed. A successful build or merge alone does not publish the website.
5. Inspect the actual live page and asset URLs, including compressed browser responses. If normal HTML is stale, compare `Age`, `Last-Modified`, ETag and bundle names; revalidate only the Equipment HTML URL with no-cache request headers and verify a fresh normal-URL browser session. A query-busted result alone is not acceptance. Verify affected functionality, public approval boundaries and mobile/desktop layout. Capture 390px and 1440px production evidence.
6. Record commit, PR, workflow run, artifact/rollback evidence and live acceptance. Keep outages in independent monitoring visible and honestly reported.

## Rollback

The last successful pre-AKASO frontend release is `b80a2d0875d9999df569e429811d610d5605b4fc`, run [38100929184](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38100929184). Retain its validated `equipment-showroom-dist` artifact before deploying. The previous run's old deploy job still contains the unconditional shipment gate, so rerunning that old job during an outage is not a usable recovery path.

For a code rollback, revert the AKASO application commit `24505c3` in a reviewed PR **while retaining this pipeline correction**, pass checks, merge, and dispatch the current workflow with `akaso_release=false`. This rebuilds the prior application source; do not describe it as restoring byte-identical artifact output. The current workflow still checks the original protected media and local arrival evidence and deploys incrementally to the same directory. Do not revert the workflow correction merely to roll back application content.

If byte-identical artifact restoration is needed, use the retained artifact with the existing approved bounded FTP release procedure, verifying the reviewed file allowlist and hashes. Do not delete unrelated remote files or restore databases/volumes. Withdraw an affiliate placement only through its existing authenticated HQ controls if withdrawal is intended; reverting a renderer does not change canonical affiliate approvals.

## October 13 correction receipt

Implementation and final live acceptance are recorded in [the pipeline correction release](EQUIPMENT-DEPLOYMENT-CORRECTION-20261013.md). The earlier [AKASO integration notes](AKASO-EQUIPMENT-INTEGRATION-20261013.md) describe its initial local validation and pre-activation state.


AKASO premium visual release: see the [October 13 implementation, cache handling and production evidence](AKASO-PREMIUM-VISUAL-20261013.md). The deployment workflow itself is unchanged.
