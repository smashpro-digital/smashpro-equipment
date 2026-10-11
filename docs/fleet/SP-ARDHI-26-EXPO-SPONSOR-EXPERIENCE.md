# SP-ARDHI-26 Expo sponsor experience

2026-10-10 · Branch `feature/expo-sponsor-experience` · Base `76ff81f`

## Audit before enhancement

The base already had a strong flagship hero, current arrival evidence, a mission dashboard, collapsed factory history, service placeholders, documents and a lazy Expo QR panel. The requested work extends that experience; it does not replace the Passport identity or redesign other assets.

| Finding | Existing location | Enhancement |
| --- | --- | --- |
| Expo entry describes following the machine but offers no participation path | `ArdhiExpo.tsx`: “Scan to Follow” | Sponsor question, specific opportunities and a partnership CTA |
| Standard introduction leads into technical/current-state content | Hero, dashboard, identity | Optional welcome and opportunity jump before the dashboard |
| Sponsor invitation is a passive placeholder far down the page | `ArdhiFleetConnections`: “Build the next chapter” | Actionable invitation near the top; omit duplicate partner cards in Expo mode |
| Future work repeatedly links to an empty service section | Mission timeline | Expo roadmap links future participation to the partnership section |
| Empty first-job/service records can look like dead ends | Service and commissioning | Retain honest pending states; add six prospective first chapters with participation links |
| Partner cards explain relationships without proof fields | Existing partners | Expandable living record with contribution, installation, date, videos, mission count, hours, reviews and status |
| QR section consumes prime space after someone has already scanned | Existing Expo panel | Move share QR into a disclosure; keep invitation and opportunities visible |
| No mission film exists | Existing archive contains factory evidence | Near-top text placeholder with a real factory-history link, no fake play button or media request |

No historical section was deleted as “dead.” Factory evidence, 52 history rows, deep links, service gaps and documents remain part of the permanent record. Standard mode retains its chapter order and existing partner presentation.

## UX report

`?expo=true` enables the experience, with `?expo=1` retained for compatibility. The toggle writes `expo=true`, preserves other query parameters and history anchors, and removes only the Expo parameter on exit. The canonical Passport URL and asset ID remain unchanged.

The first screen retains the real machine hero, welcomes the visitor to fleet management and offers “Find your opportunity.” Before specifications, the page asks “What could your company become part of?” A native select lets a visitor explore twelve opportunities through one status/mission card and carries that interest into the CTA copy. This avoids twelve stacked cards on a phone. Partnership surfaces, lifecycle, upcoming chapters, partner evidence and the share QR use native disclosures for keyboard access and shorter default scrolling.

The selected interest is held in component state only. “Discuss Partnership” opens the established `https://smashpro.app/contact` destination; the visitor is asked to mention the machine and opportunity. No form submission, CRM record or successful contact delivery is asserted. The existing contact page is a source-backed destination, not an implemented HQ sponsorship intake.

Expo styling is scoped and loaded with the lazy component: existing forest-green/gold presentation, cream text, visible focus, 48px action targets, native labels and no auto-playing film. Standard mode does not mount the sponsor experience. The long permanent machine record remains available below it and through existing anchors.

## Sponsor experience report

- Why partner: factory story, journey, Passport, missions, media, maintenance, YouTube, QR, Digital HQ and fleet history are potential documentation surfaces. Publication is scoped per collaboration; private HQ records are not promised as public exposure.
- Opportunities: GPS, camera, lighting, attachments, trailer, fuel, safety, storage and software are open for discussion. Protective cover is pending specification/partner confirmation. Insurance is **To confirm**, because no current source proves an active relationship. Manufacturer is **Documented**, matching the completed build contribution rather than inventing an active sponsorship.
- Participation path: partner → installation → Passport update → video → field test → customer work → long-term review → maintenance → performance → archive. This is a proposed path, not a delivery schedule or guarantee of positive coverage.
- Coming soon: first startup, job, grapple, brush cutter, trailer and maintenance. Fitment, commissioning and project approval remain prerequisites.
- Mission roadmap: factory and manufacturer-confirmed ocean arrival remain evidence-led; delivery, commissioning, training, residential/commercial jobs, county contracts, fleet expansion and automation remain future ambitions with participation links. No awarded contract, customer job or live automation is claimed.
- Living record: the existing manufacturer supplies the real company/contribution. Unknown mission counts, hours and reviews are explicitly unrecorded/pending. The dated factory archive supplies context; no new installation date or sponsor metrics are fabricated.

The new QR encodes `https://smashpro.app/equipment/sp-ardhi-26.html?expo=true`. Existing printed canonical QR codes cannot identify a physical scan or append a query automatically; use this Expo QR for event signage or replacement printing after device/print acceptance. Both URLs resolve the same digital identity. Printing, tag replacement and deployment are not performed by this change.

## Future recommendations and analytics architecture

Do not activate analytics or a backend in this sprint. A later reviewed event contract can use:

```json
{
  "schemaVersion": 1,
  "event": "passport_entry",
  "assetId": "SP-ARDHI-26",
  "mode": "expo",
  "sourceKind": "qr",
  "campaignId": "approved-event-id",
  "opportunityId": null,
  "missionId": null,
  "consentState": "granted"
}
```

This is an illustrative schema, not a collected event. Allowed future events: `passport_entry`, `opportunity_selected`, `partnership_intent`. Source kinds: `qr`, `expo`, `partner`, `mission`, `direct_or_unknown`. Campaign, partner and mission identifiers must be opaque approved IDs from a server allowlist; reject unknown IDs. A query parameter can identify a campaign link, not prove a physical scan, visitor identity or sponsorship. Separate page views, campaign entries and actual conversions; do not label all `expo=true` requests QR scans.

A future consent-aware client adapter may send minimal events to a first-party HQ ingestion endpoint. The server should validate schema/version, derive receipt time, rate-limit and deduplicate accepted events, aggregate counts, and enforce retention. Do not collect precise location, operator identity, private mission/customer data, free-text messages, full URLs/referrers or fingerprinting identifiers. Consent denied, offline, blocked or failed telemetry must never block the Passport. Define lawful retention and consent behavior before enabling the adapter; no cookies, event queue or new tracking calls are added here.

For HQ intake, reconcile the existing contact/partner workflow first. Add asset and opportunity references to the canonical inquiry record, with validation, consent, spam controls and an explicit acknowledgement. Keep inquiry, proposed partnership, signed scope, installation, publication and reviewed performance as distinct states. Do not automatically promote a lead to a sponsor or expose private terms. Approved evidence should later populate living partner cards and the public journey through the existing projection boundary.

Next content priorities: an approved mission film with captions/poster, reviewed cover and insurance status, installation evidence, a real field trial and published service records. Validate the printed QR outdoors on actual phones and measure CTA use before adding more sections.

## Verification and release boundary

See the accompanying validation record in `docs/release-captures/expo-sponsor/VALIDATION.md` for executed checks and captures. Only the reviewed ARDHI renderer hash is refreshed; history/equipment blocks, shared legacy CSS, MZIGO and deployment guards remain protected. No push, deployment, backend, active sponsorship or physical-device acceptance is implied by local checks.
