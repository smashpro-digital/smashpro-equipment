# Fleet lifecycle events V1

## Architecture

Digital HQ is the authoritative system for service jobs, warranty, costs, parts, private notes and approvals. The equipment repository exposes reviewed, privacy-safe public projections. WordPress is editorial media and articles, not the repair database. Passport UI shows chronological events with links to approved, published WordPress stories only.

## Rules

- Four event types: repair, upgrade, maintenance, field_test. Preserve factory baseline independently from current installed configuration.
- Stable IDs, asset IDs, component IDs, status, dates, evidence and relationships. Never overwrite history: append corrections and verification milestones.
- Repairs may be marked repaired without being verified. **No event status alone grants service release or commissioning approval.**
- An article in a draft GitHub PR is not a public URL. No guessed permalink or link to unpublished WordPress content.
- Private cost, supplier communications, warranty negotiations and operator identity remain HQ-only.
- Public media requires reviewed evidence and actual WordPress media IDs. No synthetic repair-complete imagery.
- Attachments retain their own passports and link to the host asset via component IDs.

## Pilot and integration backlog

1. Seed ARDHI event projection in src/data/fleetLifecycle.ts; pending thrown track remains service-blocking.
2. Wire reviewed projection into existing Lifetime Care UI and retain existing commissioning safety gates. No parallel passport.
3. Add Digital HQ lifecycle event schema and review/publish controls, then consume via existing approved equipment gateway.
4. Publish Field Repair 003 only after editorial review; attach its canonical WordPress URL to DEF-003 after publication.
5. Add bidirectional link to ARDHI's actual passport route and published journal.
6. Test blocked vs verified statuses, missing media, draft articles, corrections, and event sorting before deployment.

## Current rollout

This PR adds the typed model and owner-reported pilot data. It **does not** claim a wired UI, live HQ sync, deployed site, approved track repair, or completed commissioning.
