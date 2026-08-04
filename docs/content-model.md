# Content model

`src/data/equipment.ts` is the catalog source of truth. Each `Equipment` record supplies routing, fleet identity, approved descriptions, confirmed specifications, attachments, capability lists, restrictions, gallery media, and rental requirements.

`src/data/attachments.ts` tracks documented and planned attachments independently. A planned record is not a claim of availability.

Specification entries include a `confirmed` field so a future UI can distinguish approved values from deliberately labeled unknowns. This migration includes only values already present in the preserved pages or nearby approved SP Fleet seed documentation.

Rental status is descriptive only. The public site does not connect to SPGo or expose contractor, reservation, pricing, or private eligibility data.
