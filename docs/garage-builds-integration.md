# Garage Builds & Restorations connections

The shared project contract is owned in `smashpro-digital/digital-hq/docs/garage-builds/`. The editable public project records and shared page renderer live in the existing WordPress Project Orchestrator in `smashpro-web`.

This repository retains the complete Golf Cart Tech Build design and the authoritative SP-PCM-001 product page. Neither route nor asset/product identifier is renamed. The existing `PageFrame` now mounts a small reusable `BuildConnections` component only on those two destinations.

The component supplies canonical links even when the WordPress API is offline or not yet deployed. It optionally reads the public Garage projection, matches by canonical path rather than inventing/replacing a project key, and displays lifecycle, phase and the review date. It does not create an editable status cache, import private asset data, or write to any API. A 4-second timeout and cancellation protect navigation changes.

## Release order and acceptance

Deploy only after separate production authorization. Prefer the web framework first, then review and publish its starter records, then release this connection layer. With an unavailable API, the navigation still works; no current status is guessed.

Run `npm run typecheck`, `npm test`, and `npm run build` in the complete repository. The new Node tests are source-contract checks, not browser component tests. On staging verify both routes, mobile and keyboard navigation, API success/404/timeout/invalid JSON, and route changes without a stale prior-project badge. Existing route/media safeguards must still pass.

The original golf page describes its own future build plan; the new small status panel is a shared project record, not a claim that its donor has been acquired. Future authored content updates should be reviewed when that stage changes. Do not convert SP-PCM-001 into a vehicle asset or imply that a cargo-securement supporter sponsors that product.
