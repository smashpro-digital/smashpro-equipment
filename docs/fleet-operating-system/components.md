# Component hierarchy and screen contract

Proposed names below are implementation targets, not components already wired into production. Modules depend on asset context and capabilities, never on an ARDHI identifier or provider-specific payload.

```text
PassportRoute (existing canonical path)
└─ PassportShell
   ├─ AssetIdentityHeader (public ID, name, canonical URL)
   ├─ SessionBoundary (server session + asset permissions)
   ├─ PublicPassportWorkspace
   │  ├─ ExistingPassportRendererAdapter
   │  │  └─ Protected legacy renderer OR EquipmentPassport
   │  ├─ JourneyModule (published events only)
   │  ├─ Specifications / Manufacturer / Sponsors
   │  ├─ DocumentsModule / MediaModule (public derivatives)
   │  └─ PublicServiceSummary
   └─ AuthorizedWorkspace (lazy load only after authorization)
      ├─ WorkspaceSwitcher (only granted workspaces)
      ├─ MissionHeader (mission/project/customer/crew/status)
      ├─ OperatorModule (active operator, hours today, meter)
      │  ├─ CheckInFlow → InspectionModule → EvidenceCapture
      │  └─ CheckOutFlow → Fuel / Damage / Notes / Attachments
      ├─ AtlasModule → LocationModule (normalized protected view)
      ├─ ServiceModule
      │  ├─ Maintenance / WorkOrders / Parts / Warranty
      │  └─ Manuals / Bulletins / InspectionForms
      ├─ PrivateJourneyModule (audited, authorized event projection)
      └─ DocumentsModule / MediaModule (protected fetch adapter)

Digital HQ FleetCommand (separate existing HQ application)
└─ FleetProjection → Asset row → canonical Passport URL
```

Each module receives `{assetId, revision, capabilities}` plus a typed projection and command adapter. `SessionBoundary` owns cancellation and private-state eviction. Atlas owns location semantics, Inspection owns versioned responses, Operator owns shift UX, Service owns mechanic UX, and Journey owns timeline rendering. Reuse document/media presentation primitives while keeping separate public/private loaders; never pass a mixed array and rely on rendering filters.

| Screen | Primary action | Required states |
| --- | --- | --- |
| Public Passport | Explore record; optional staff sign-in | Published, pending evidence, unavailable source |
| Operator home, idle | Check in / Start shift | Eligible, not assigned, inspection needed, maintenance lock |
| Operator home, active | Check out / End shift | Own active session; another operator active; stale revision |
| Check-in | Review and confirm | Capture location consent, inspection, hours, photos, signature; validation/409/retry |
| Check-out | Review and end shift | Closing hours, fuel, photos, damage, notes, attachment change, maintenance; atomic result |
| Atlas | Inspect authorized context | Recent, last known, unavailable, conflicting; precision/freshness visible |
| Mechanic | Open work order | Read only, authorized update, awaiting parts, safety hold, reviewed completion |
| HQ command | Open canonical Passport | Fresh projection, delayed outbox, unauthorized assets excluded |

The mission header contains project, customer, crew, machine status, hours today, operator, location and Atlas region. Unknown values say “Not recorded”; an unassigned machine says “No current mission.” Public mode never substitutes fake operational values into that header.

## Wireframe behavior

Open `wireframes.html` directly. It contains six review screens: Public, Operator, Check in, Check out, Mechanic and Fleet Command. Review buttons switch fictional screens; no login, camera, signature or server call is simulated as successful. The review strip stays visible on every screen. Public content contains no work controls; the review navigation is outside the depicted application.

At mobile widths use a single column, a compact identity bar and one primary action. At desktop widths keep mission and action panels beside Atlas/service context. Preserve native labels, keyboard focus, headings and readable contrast. Actual implementation must manage focus on workspace/dialog changes, announce server errors and accepted commands, offer text alternatives to maps, respect reduced motion, and avoid color-only status indicators. Long journeys remain searchable/paginated while preserving existing anchor links.

The HTML provides representative layout and information hierarchy. It is not a visual replacement for the current flagship design and is not a production authentication prototype.
