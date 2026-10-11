# ARDHI release prerequisite correction

The Expo deployment run `38099610629` stopped before FTP because the old prerequisite required `map.cargoAssociationConfirmed === true`. Current HQ readback reports false. The Passport already separates the manufacturer-confirmed port arrival from the older HQ vessel/shipment feed; requiring the machine to remain associated with that vessel contradicts this presentation contract.

The revised prerequisite validates two records independently:

1. The committed, reviewed October 9 manufacturer-arrival record must still say Arrived at U.S. Port / Awaiting Customs Clearance, with unknown arrival date. Customs, warehouse, delivery, commissioning and first job must remain pending. The downloaded release artifact must contain the original arrival photograph with its recorded SHA-256. Photo preservation is corroborating provenance, not independent proof of the machine's identity or arrival date.
2. The live HQ endpoint must return HTTP 200, JSON, the exact allowed Equipment origin, schema v2 and the correct asset. Its historical confirmed origin-departure chronology and estimated ETA classification remain checked. The cargo-association flag must be an explicit boolean, but may be false. The map must remain unsimulated and vessel-only, with no current position, progress percentage or satellite imagery.

This does not update HQ, promote vessel evidence into machine arrival, claim customs clearance, or disable preflight validation. Changes to the reviewed lifecycle or the historical API contract still fail closed and require another explicit policy review. The old hard-coded October 5 estimate is replaced with validation of a historical estimated date; it is not presented as a current arrival promise.

The deployment job checks out `github.sha` into `release-source` and evaluates that commit's policy against the artifact from the same workflow run. The FTP directory and incremental deployment settings are unchanged. Node 22 strips the types from the existing standalone arrival module, avoiding a duplicated evidence record or a dependency install in the deploy job.

Tests cover both explicit cargo-association values without mutation, wrong identity/schema, unverified or advanced shipment state, missing/non-boolean association, cargo/simulated maps, invented positions/progress/imagery, extra milestones, changed arrival provenance/date and prematurely completed downstream stages. The live preflight passed locally with the unchanged false cargo-association flag.

Only the deployment workflow hashes in the ARDHI/MZIGO protection fixtures are refreshed for this authorized repair. No renderer, media, canonical inventory, shipment API or public projection is changed by this patch.
