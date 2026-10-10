# Recommendations and migration strategy

## Recommended order

Build the identity/session boundary first, then a read-only protected mission/Atlas view, then transactional operator workflows, then mechanic and Fleet Command projections. Use the current public renderers during this progression. Provider connectors and autonomous controls must not be prerequisites for a manually evidenced workflow.

| Phase | Concrete work | Acceptance gate | Rollback |
| --- | --- | --- | --- |
| 0 — reconcile | Inspect live HQ/SPGo schemas, assignment/session policy, existing inspection/service/attachment tables and Atlas deployments; map fleet IDs and URLs to existing equipment rows | Every pilot route maps to exactly one canonical ID; no duplicate records; source audit recorded | No mutations in this phase |
| 1 — identity/session | Same-origin gateway, existing auth integration, per-asset grants, no-store, CSRF, audit and canonical return paths | Anonymous, wrong-asset, expired-session, cross-tenant and logout tests pass; public URLs/QRs unchanged | Disable private entry feature flag; public Passport remains |
| 2 — protected read | Mission, active operator, service and Atlas read projections; backend adapter over current services | No private fields in public JSON/HTML/bundle/index; stale/null/conflicting location and audit failure verified | Disable read workspace; retain records |
| 3 — operator pilot | Versioned inspection, signature/media service, atomic check-in/check-out, meter/fuel/defect/attachment events, idempotency and outbox | Concurrent scans, retry after lost response, invalid meters, blocked inspection, wrong-owned media and expired assignment tests pass | Disable new starts; retain authorized checkout/recovery path for active shifts |
| 4 — mechanic + HQ | Work order adapter, parts/warranty/manuals/bulletins, Fleet Command projection, approved service summary | Accepted defect creates service activity; pending integration is visible; repaired vs reported distinguished; HQ deduplicates events | Pause consumers and replay outbox; never delete journal |
| 5 — broaden | At least one imported machine and one non-shipping asset; multiple provider adapters | UI unchanged for provider swap and non-shipping profile; unavailable providers do not fabricate state | Disable binding/connector, retain last-known observations |
| 6 — mature renderer migration | Adapt historical records to generic modules after source/evidence reconciliation | ARDHI and MZIGO identity, history, anchors, media, documents, manufacturer and QR parity demonstrated | Keep old renderer adapter until parity accepted |

Apply only additive migrations after schema verification, with reviewed backups, foreign keys matching existing IDs, indexes for active-session uniqueness and a tested rollback plan. Earlier HQ migration files are unverified proposals, not permission to apply them wholesale. Do not seed example data or automatically infer operational IDs from display IDs.

## Public continuity

Preserve the physical `/equipment/*.html` entry model, base path, existing public index allowlist and permanent redirects where needed. ARDHI's current manufacturer-confirmed arrival / pending customs state remains evidence-qualified. No new operator architecture may imply delivery, commissioning, a first job or readiness. Keep the v4 52 history rows and their deep links as a baseline; row count is not a count of canonical business events. MZIGO and generic LIFTMATE retain their independent evidence states and media.

Import historical records with source IDs/content hashes and an explicit import ledger; reruns must be idempotent. Resolve provisional positional record IDs before operational editing or sorting. Preserve original dates, unknown dates, provenance, published text and correction relationships. Reconcile legacy public commercial narrative separately from private operational projections; do not silently republish it under a broader policy.

## Implementation recommendations

1. Reuse HQ/SPGo authentication, dispatch eligibility and service records after verifying their actual contracts. Do not create a Passport-only user, job, equipment or maintenance database.
2. Maintain separate public and private API schemas and fetch paths. Extend Atlas with a protected projection; never make the current anonymous response conditionally rich through query parameters.
3. Start with online, explicit operator commands. Prefer server-confirmed outcomes over an optimistic green “checked in” state. Leave offline write queuing and worker trails for a separately designed phase.
4. Use server-generated timestamps, immutable event IDs and an outbox. Persist operator capture time separately. Define asset timezone and meter units per profile.
5. Use short-lived authorized evidence access. Do not embed permanent signature/photo URLs in the public repository or static build. Define retention with the organization before collecting worker trails or signatures.
6. Keep provider configuration in HQ. A provider switch should change a binding and adapter, not the Passport UI. Review suspicious manual/geofence conflicts rather than accepting last-write-wins location.
7. Pilot with reviewed assignments and synthetic fixtures before enabling real operators. Expose a support/recovery path for abandoned shifts and supervisor corrections; corrections require explicit grants and append-only audit.

## Required verification before activation

- Contract/security: anonymous cannot read private fields; asset-ID swapping, stale sessions, CSRF, upload ownership and audit failure fail closed; no private responses cached.
- Workflow: duplicate/concurrent check-in, duplicate checkout, partial transaction failure, service outage/outbox replay, shift handoff, wrong inspection version, invalid signature evidence, critical defects and meter replacement.
- Atlas: provider swap, expired binding, stale fix, no fix, denied location permission, conflicting fixes, source clock skew and unauthorized exact/history access.
- Experience: scan the existing printed QR/NFC on real mobile devices; test public, operator, mechanic and dual-grant sessions; keyboard/screen reader; 320/390/768/1440 layouts; camera/upload denial and slow network.
- Public regression: current typecheck, Node tests, build, public index/media/projection validation, flagship and shipment browser suites; preserve canonical URLs and existing deep links.
- Release: commit, push, merge, gateway deployment, backend migration, frontend deployment and live readback are distinct gates. A static frontend deployment alone cannot activate this architecture.

Open implementation decisions are the actual canonical ID mapping, existing auth/gateway deployment, HQ/SPGo table/API ownership, permission mapping, inspection templates/qualifications, media/signature retention, geofence policy and meter semantics. These do not block review of this package, but must be resolved before accepting real operational writes.
