# SP-ARDHI-26 journey audit — October 9, 2026

Audit completed before implementation. Baseline: tracked HEAD `1a50b88`,
with the previously prepared local manufacturer package specifications and
arrival photograph still uncommitted. The Tri-Lift feature is a separate
worktree and is not included in this change.

## Current implementation and linked resources

The public route is `/equipment/sp-ardhi-26.html`; the repository entry is
`sp-ardhi-26.html`. It mounts `src/main.tsx`, `ArdhiPassportPage`,
`EquipmentPassportPage`, and the protected `ArdhiPassportJourney` renderer.
The generic Passport renderer is not used for ARDHI.

Reviewed the transitive local import graph: 101 reachable source/style/data
files, no missing local imports. Core shipment dependencies are
`useShipment`, `domain/shipment`, `ShipmentJourney`, `ShipmentMap`,
`VesselContext`, `AtlasStatusPanel`, `ardhiVerifiedVoyage`, `ardhiCheckpoint`,
`equipment`, `ardhiEvidenceHistory`, and the public Passport projection.
Styles include global, ARDHI v2/compact/history/manufacturer rules, shipment,
vessel context, Atlas and Leaflet. Live linked JS/CSS requests succeeded.

## State before changes

| Area | Observed state |
| --- | --- |
| Lifecycle | Live HQ response: `ocean-transit`; page: Departed Origin Port |
| Shipment | Last milestone September 7, 2026, 02:52:04 UTC; October 5 ETA still displayed |
| Mission | No single current mission; separate vessel panel marks Ocean active |
| Map | Static reference cartography and coarse Savannah vessel checkpoint; no current AIS coordinates |
| Evidence | HQ timeline has container loading, Chinese export clearance and origin departure; no public shipment imagery |
| Vessel | EVER MAX / 1374-016E, forwarder-reported association; reviewed Savannah anchorage checkpoint October 6 |
| Media | 19 gallery records before the new arrival image; 25 distinct ARDHI filenames referenced in core equipment/history source, all present locally |
| Animation | Decorative factory-image zoom and status pulse; reference map disables motion; no observed simulated GPS |
| Mobile | No horizontal overflow at 320, 390, 768 or 1440 px in the live baseline |

Shipment API was HTTP 200. Browser checks at all four widths found no
JavaScript exceptions, duplicate DOM IDs, broken in-page anchors, failed
observed network responses or broken loaded images. Timeline expansion works.
These results cover the observed browser resources and local referenced
media, not proof that every third-party source remains continuously available.

## Timeline inventory

The permanent history contains planning, supplier research and selection,
procurement opening, invoice approval, staged payments, identity/branding,
hydraulic upgrade, attachment strategy, factory production, inspection,
purchase protection, freight handoff, export crate, factory departure and
grapple order. Fifteen additional supplier-conversation entries are injected
from the archived evidence data. Reserved records run from commissioning,
startup, fuel and attachment through first job, service hours and inspection.
The separate HQ shipment timeline contains three source-linked export events.
There is no machine port-arrival event in the baseline.

## Findings and targeted corrections

1. The live HQ shipment state and ETA predate the newly supplied manufacturer
   confirmation. Show the reviewed arrival record explicitly without silently
   rewriting HQ, inventing an event timestamp or treating vessel AIS as cargo proof.
2. The cinematic vessel rail says Ocean active even while its corridor shows
   Savannah. Separate current machine logistics from historical vessel context.
3. Delivery points to filtered-out `future-5`; Maintenance points to nonexistent
   `future-15`. Restore valid history targets while preserving established IDs.
4. The same export-departure video appears in both crate and departure history
   and the gallery. Keep one gallery home with historical references.
5. Three August pallet photographs show factory shipping preparation, not
   ocean, port, warehouse or delivery evidence. Retain them in Export Journey,
   explicitly labeled factory export preparation.
6. The newly supplied arrival photograph shows crated freight on a trailer.
   The machine is enclosed. Use the owner-relayed manufacturer confirmation
   for arrival, not image metadata or visual geolocation. Capture/arrival date
   remains unspecified. Add one Port Arrival gallery home.
7. Maintenance/parts manuals, bill of lading, packing list and inspection sheet
   are honest awaiting-evidence placeholders; do not invent documents.
8. `EquipmentProjects.tsx` is outside the main entry's static import graph,
   but is unrelated to this shipment and is not removed on that basis.
   Legacy ARDHI stats/map selectors and their optional DOM enhancement are
   also not the active logistics map; no broad renderer cleanup is justified.

## Evidence boundary and implementation plan

Manufacturer-confirmed: U.S. port arrival, ocean voyage complete, customs
pending, package 2090 × 1100 × 1300 mm / 950 kg. The exact arrival date is
not supplied. No customs release, warehouse transfer, delivery scheduling,
delivery completion, commissioning or first job may be marked complete.
Do not infer a precise cargo location or move a simulated ship marker.

Retain the mature renderer, historical evidence and document tools. Add an
eleven-stage journey with Port Processing current (stage 6), a static logical
route, verified package details and an arrival timeline reference. Keep
operational planning outside this public repository's projection.
