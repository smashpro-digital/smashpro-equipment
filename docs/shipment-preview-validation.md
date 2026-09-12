# Shipment preview integration — September 12, 2026

## Configuration

Production remains `https://api.smashpro.app/api/fleet/shipment/SP-ARDHI-26`.
The generated Railway hostname belongs only in ignored local configuration, never
in application source or the production build. No deployment is part of this change.

The live Railway endpoint returns JSON 200 with schema 2 and pending references.
It currently omits `Access-Control-Allow-Origin`, including for the Equipment
origin. A direct browser fetch is blocked by CORS. Local preview uses an opt-in
Vite proxy to the real service; this validates rendering, not production CORS.
The proxy exists only in `shipment-preview` mode and matches only the exact public
ARDHI route. It does not expose an administrative route or accept a caller-supplied
upstream. Use the loopback host below.

Create ignored `.env.shipment-preview.local` locally (replace the placeholder with
the generated HTTPS Railway origin supplied by the owner, without a trailing slash):

```dotenv
VITE_SHIPMENT_ENDPOINT=/api/fleet/shipment/SP-ARDHI-26
SHIPMENT_PREVIEW_UPSTREAM=https://<generated-test-host>
```

```powershell
npm.cmd run build -- --mode shipment-preview
npm.cmd run preview -- --mode shipment-preview --host 127.0.0.1 --port 4175 --strictPort
```

Open `http://127.0.0.1:4175/equipment/sp-ardhi-26.html#journey`.
This local artifact must never be uploaded. A normal production build ignores
the preview-mode file and uses the intended API domain. To test direct browser
access after HQ CORS is configured, set `VITE_SHIPMENT_ENDPOINT` in that ignored
preview file to the complete public test endpoint, rebuild, and omit the proxy.

## Rendered state

- **Ocean departure awaiting confirmation**
- **EVER MAX — identity verification pending**
- **Voyage 1374-016E — verification pending**
- **Cargo association not yet confirmed**
- **Factory model YF380**

These references are explicitly operator-supplied and unverified. Their recorded
timestamp appears in the pending panel, separate from the unavailable verified
shipment-update timestamp. Verified vessel/voyage remain absent. No vessel marker,
simulated movement, satellite image or confirmed Ocean Voyage is introduced.
The existing factory, production, crate and forwarder media are retained.

## Reproducible checks

Run `npm.cmd run validate` for the normal build, unit tests and media/index checks.
Run `npm.cmd run test:shipment:browser` against that build for fixture failure,
timeout, stale-cache, keyboard, map and imagery scenarios. Fixtures are labeled
and do not represent actual shipment evidence.

For opt-in live integration, first build the preview mode above, stop any manual
preview server on 4175, then run:

```powershell
$env:SHIPMENT_LIVE_ENDPOINT = 'https://<generated-test-host>/api/fleet/shipment/SP-ARDHI-26'
npm.cmd run test:shipment:browser
Remove-Item Env:SHIPMENT_LIVE_ENDPOINT
```

Use `PLAYWRIGHT_CHROMIUM_EXECUTABLE` only if selecting an existing Chromium binary.
The live suite checks real response rendering at 1440px and 390px, public response
keys, empty positions/imagery, pending labels, absence of a shipment cache, keyboard
refresh and horizontal overflow. A separate test explicitly reproduces the current
direct-browser CORS failure; update that assertion when HQ enables CORS.
Captures: `tmp/shipment-captures/live-1440.png`, `live-390.png`, and matching
`-viewport.png` files. Section captures hide fixed chrome; viewport captures do not.

## Release boundary

Validation results: 72/72 unit tests, TypeScript, the production build, public index
and all 19 original MZIGO media checks passed. The production bundle contains the
intended API URL and no Railway hostname. All 7 fixture browser scenarios passed.
Live mobile rendering and the explicit direct-CORS-block check passed; the first
desktop request hit the unchanged eight-second application timeout and displayed
the unavailable state. A targeted desktop rerun passed against the real service.
Both successful live section captures were visually inspected with no text or
map-marker overlap. The in-app browser was unavailable; installed Chromium was
used. Existing React `fetchPriority` and runner color warnings are unrelated.

The transient live timeout and missing CORS are distinct findings. Investigate
service startup/latency before production acceptance; a successful rerun does not
prove sustained endpoint availability.

Configure and verify production API DNS/routing and CORS for `https://smashpro.app`
through a separately approved HQ release, or approve an Equipment same-origin
reverse proxy. A Node HTTP 200 alone is insufficient. The Equipment deployment
prerequisite now checks CORS for its origin as well as the conservative record.
Merging, deploying and DNS changes still require explicit approval.
