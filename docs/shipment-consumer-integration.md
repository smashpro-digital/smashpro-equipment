# ARDHI public shipment consumer

The SP-ARDHI-26 passport consumes Digital HQ PublicShipment schema 2. Digital HQ
PR [111](https://github.com/smashpro-digital/digital-hq/pull/111), commit
`b097664520df0df678d62e8111358df90b998295`, owns evidence, publication approval,
provider polling and shipment stage. Neither PR is authorization to deploy.

## Configuration and behavior

Default request: `GET /api/fleet/shipment/SP-ARDHI-26` on the public page origin.
Set the public build variable `VITE_SHIPMENT_ENDPOINT` only if a different public
endpoint is needed. Configure HTTPS and CORS for the Equipment origin when using
a separate host. Never supply provider credentials or administrative endpoints.
Requests omit credentials, time out after eight seconds, and refresh every six
hours or when the visitor presses Refresh update.

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

Final local results: all 70 unit tests and all 6 Chromium browser scenarios passed.
TypeScript, the production build, whitespace checks, public-index validation and
the 19-file MZIGO original-media validation passed. Desktop (1440px) and narrow
mobile (390px) captures were visually inspected. Section captures hide fixed page
chrome only; interaction checks use the normal page. The in-app browser was not
available, so these checks used the installed headless Chromium executable.
The existing React test warning concerning `fetchPriority` remains unrelated.

## Deployment and rollback

Deployment requires separate approval. Deploy and verify the HQ public endpoint
first, including proxy/CORS behavior and a public-only response readback. Review
the Equipment PR and build with the chosen endpoint before releasing the normal
Equipment artifact. A frontend release cannot verify the shipment business state.
Retain the previous release artifact; rollback uses the normal reviewed deployment
workflow with that artifact. Reverting source alone does not change the served site.
No merge, deployment, provider activation or real shipment evidence update was
performed as part of this integration.
