# Fleet Passport Operating System

Design baseline: 2026-10-10, based on Equipment commit `937fc90` (ARDHI v4).

One canonical asset, one permanent Passport URL, one QR payload. Public visitors see the published record. Authorized staff use that same entry point to operate and service the asset. Digital HQ owns operational records; Atlas owns location interpretation.

This package supplies the requested architecture, wireframes, component hierarchy, JSON models, future API interfaces, recommendations and migration strategy. It is a **design and API contract proposal**, not an activated operator system. No authentication, write endpoint, provider connection, database migration or production release is implemented by this commit.

| Deliverable | Artifact |
| --- | --- |
| Architecture, ownership, Atlas providers, security, workflow | [Architecture](architecture.md) |
| Reusable component hierarchy and screen behavior | [Components](components.md) |
| Responsive public, operator, mechanic, check-in, check-out and HQ wireframes | [Interactive wireframes](wireframes.html) — open locally in a browser |
| Strict JSON models and future HTTP interface | [OpenAPI 3.1 contract](api.openapi.json), `components.schemas` |
| Synthetic request/response and event examples | [JSON examples](examples.json) |
| Recommendations, reconciliation and staged migration | [Migration](migration.md) |
| Local artifact validation and review limits | [Validation](validation.md) |

The wireframe mode selector is a review tool, never an authentication mechanism. All displayed operational values are fictional. No sample asset is added to the fleet registry. Wireframes and contracts live under `docs/`, outside the production Vite entry list.

## Decisions

- Retain existing Passport URLs, IDs, history anchors, documents, media and QR payloads. Do not create a second inventory or repurpose display fleet IDs as new database IDs.
- Resolve the public route to the existing HQ equipment record on the server. Fail closed if the mapping is absent or ambiguous.
- A server session and per-asset capabilities select available workspaces. A scan or a role query parameter never grants authority.
- Keep the existing public Atlas client separate from a new protected Atlas view. Do not add customer, crew, exact location or operator fields to anonymous responses.
- Derive hours, active operator and service history from accepted HQ transactions. Telemetry, inspection completion and a tag scan do not independently prove readiness or authorize operation.
- Introduce the operating workspace around existing renderers before migrating their historical content. ARDHI v4 and MZIGO remain parity gates.

## Source audit

Verified in the base checkout:

- `src/domain/atlas.ts` loads an anonymous Atlas v1 response with `credentials: 'omit'`; its modes are location context, not operational authorization.
- `src/components/AtlasStatusPanel.tsx` already presents public location context. It is not the protected operations panel proposed here.
- `src/domain/passportIdentity.ts` checks uniqueness of Passport IDs, fleet IDs, paths and optional operational IDs. `src/types/equipment.ts` makes `operationalAssetId` optional: actual HQ mappings still require reconciliation.
- `src/domain/passportAutomation.ts`, `src/domain/passportTemplates.ts` and `src/pages/GenericPassportRoute.tsx` provide generic public projection/rendering. `src/app/App.tsx` retains explicit mature Passport routes.
- `src/data/ardhiFlagship.ts` contains evidence-gated public commissioning/service presentation, not operational persistence.
- The earlier HQ worktree `hq-fleet-location-20260911` documents canonical `spd_tech_equipment.tech_equipment_id`, audited exact/history permissions and an unapplied extension migration. These files were read during this task; their live deployment and database state were not verified.

The historical `PublicFleetProjection` proposal exists in a separate worktree and is **not present in this base branch**. This package does not assume that earlier proposal is merged or deployed. Current ARDHI arrival evidence is preserved; older architecture examples are not imported as current logistics facts.
