# MZIGO Asset 002 passport

## Baseline audit

Main at 38226f7 already routes MZIGO through MzigoPassportPage and a dedicated MzigoPassport composition. EquipmentPassportPage supplies the common frame and breadcrumb, not the old ledger-first hero shown in the supplied screenshot. MZIGO already uses PassportHero with the supplied workshop artwork. The screenshot therefore does not match this source composition; an HTTP 200 asset check alone cannot establish rendered placement.

ARDHI has advanced beyond its original documentary layout into a delivered-machine dashboard. Its hero, lifecycle styles, evidence grammar and existing public Atlas projection are reusable. Its machine-specific shipment hook and delivery assertions must not be transplanted into MZIGO.

## Changes

- Native Fleet Asset #002 identity within the shared hero, with a left headline and right artwork crop. Summary and evidence remain below the hero.
- FleetPassportJourney composes the existing FleetLifecycleProgress with a source-labelled, dated public location panel. It consumes the existing MZIGO lifecycle rather than creating parallel state.
- PassportReadingStatus derives current section, reading progress and lifecycle position. Reading progress does not imply shipping progress.
- Existing asset-specific AtlasStatusPanel remains the route and shipping-context integration. No ARDHI vessel data or private coordinates are copied.
- All six current build chapters, original September and October media, current payment history, three-field summary, service records and document destinations remain intact.

## Status reconciliation

The brief contains September pre-shipment text. Current canonical source contains later October 1 payment, October 6 packing, and October 7 supplier-reported Qingdao staging. Those later records remain authoritative here. The location is explicitly last documented and supplier-reported, not a live position. Pending stages remain pending; stage position is computed from the existing 17-stage lifecycle. Changing lifecycle data later updates the current/next stage and position without changing this component.

The protected MZIGO fixture refresh is limited to the reviewed location-data addition, MZIGO composition/header and scoped MZIGO CSS. Shared ARDHI styles, equipment data, original media and deployment safeguards remain unchanged. The shared lifecycle observer now activates when a small portion is visible, allowing counters in long mobile timelines to initialize.

## Validation

Run npm ci, npm run typecheck, npm test, npm run build and npm run validate:index. scripts/verify-mzigo-flagship.mjs checks 360, 390, 412, 430, 1440, 1600 and 1920 pixel widths, actual background positioning, image decode, overflow, navigation, chapter preservation, UTM parity and ARDHI at 390/1600. Set PASSPORT_BASE_URL to verify production. Screenshots are saved under tmp/mzigo-flagship for visual review.
