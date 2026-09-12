# ARDHI public shipment consumer

The SP-ARDHI-26 passport consumes Digital HQ PublicShipment schema 2. Digital HQ
PR [111](https://github.com/smashpro-digital/digital-hq/pull/111) owns evidence, publication approval,
provider polling and shipment stage. Neither PR is authorization to deploy.

## Configuration and behavior

The intended production endpoint is `https://api.smashpro.app/api/fleet/shipment/SP-ARDHI-26`.
The hook default, `.env.example` and production CI build agree on this value.
Override only with public `VITE_SHIPMENT_ENDPOINT`; never include credentials.
Because Equipment and API use different origins, HQ must permit the Equipment
origin using CORS (or an approved same-origin reverse proxy must be configured).
Requests omit credentials, time out after eight seconds, and refresh every six
hours or when the visitor presses Refresh update. Unavailable/cached responses
retry after 60 seconds; an online event also triggers a retry. An already-open
passport therefore recovers after DNS/TLS becomes reachable without a new release.
Browsers may throttle timers in background tabs. TLS and public schema validation
remain required on every retry.

Pending references use a separate allowlist and a clearly labeled panel. Operator
reference timestamps never replace the verified shipment-update timestamp. Pending
references cannot populate verified vessel/voyage fields or survive a confirmed
record, and unverified records are not cached.

The consumer validates the response and selects public fields before rendering
or writing session storage. Only confirmed public records are cached; a successful
unverified response clears an older confirmed record. Outages use a labeled last
known record if one exists. Cached imagery is suppressed until fresh publication
approval is received. Invalid optional imagery cannot break the passport.

- No endpoint/cache: **Shipment update unavailable.**
- Valid unverified HQ record: **Ocean departure awaiting confirmation**.
- Confirmed stage: the API's shipment status, with a verified badge.
- Cached confirmed stage: the API's previous status, a Last known record badge,
  and an explicit outage notice. This is never a live-position claim.

Ocean Voyage is still unverified for ARDHI. Vessel identity, cargo association,
departure, ETA and route must be resolved in HQ before publication. The existing
factory, crate and forwarder archive and original media remain accessible.

## Map and media

Leaflet renders bundled Natural Earth reference geography (see
`public/maps/README.md` for provenance). No external tiles, geocoder, animation,
generated imagery or fabricated journey coordinates are used. API observed
tracks are solid green; projected routes are dashed gold. Vessel observations
remain vessel-only. Inland destination precision is checked at whole degrees.
Numbered port markers link to evidence events, with the same information available
in the adjacent text summary. Jobs, storage and service history remain separate.

Approved satellite media belongs to its API event. Capture time and AIS time are
separate; provider, resolution, cloud cover, licensing and identification status
are shown. The no-imagery state never implies a satellite view of the vessel.

## Verification and review

Run `npm.cmd ci`, then `npm.cmd run validate` (TypeScript, unit tests, Vite build,
public index and original MZIGO media validation). Run `npm.cmd run check:format`
for whitespace checks; this repository has no configured ESLint task.

Run `npm.cmd run test:shipment:browser` after building. Install the Playwright
Chromium browser when needed, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an existing
compatible Chromium executable. The runner manages a local preview on port 4175.
Browser scenarios cover desktop/mobile, keyboard refresh/event navigation, API
outage, verified cache fallback, invalid responses, stale positions and absent or
failed imagery. Fixtures are synthetic, never imported by the application.
Screenshots are generated under `tmp/shipment-captures`; fixture screenshots are
visibly labeled and are not shipment evidence.

Current preview procedures and results are in [shipment-preview-validation.md](shipment-preview-validation.md).

## Deployment and rollback

Deployment requires separate approval. Deploy and verify the HQ public endpoint
first, including proxy/CORS behavior and a public-only response readback. Review
the Equipment PR and build with the chosen endpoint before releasing the normal
Equipment artifact. A frontend release cannot verify the shipment business state.
Retain the previous release artifact; rollback uses the normal reviewed deployment
workflow with that artifact. Reverting source alone does not change the served site.
No merge, deployment, provider activation or real shipment evidence update was
performed as part of this integration.

Production preparation (September 12): the deploy job now requires manual dispatch
on main; a merge only validates. The production build explicitly receives the
intended `api.smashpro.app` shipment URL. Before FTP activation, an HTTP prerequisite
check requires the conservative unverified HQ record and CORS permission for
`https://smashpro.app`. HQ now grants exact CORS permission to the production Equipment origin. Local
preview proxy rendering still does not substitute for production browser acceptance.
Do not merge/deploy until production endpoint smoke tests pass and the user approves.
Full release and rollback gates are recorded in HQ `docs/shipment-production-preflight.md`.
