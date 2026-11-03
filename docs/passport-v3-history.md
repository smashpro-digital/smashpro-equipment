# Equipment Passport v3 — visible history contract

## Purpose

A public passport is a **concise, repeatable asset dashboard**, not a long-form project article or an operations database. Readers should identify an asset, see its readiness, read recent activity, and reach source evidence without opening several nested sections.

## Stable information architecture

Use the same section roles across machines, trailers and attachments:

1. Identity and current lifecycle/readiness
2. Verified specifications
3. Current configuration / fitment
4. Lifecycle milestones
5. Maintenance and inspection summary
6. Recent history, source archive and published field-report links

Asset-type-specific specifications live in data records, not bespoke editorial sections. Empty future milestones must not be presented as completed history.

## History presentation rules

- Show up to **three recent, meaningful public milestones inline** with date, title, provenance state and a short summary.
- Include a source link only when a public destination exists.
- Put the complete, unaltered evidence log behind one clearly labeled archive control, preserving existing event IDs and deep links.
- Prefer a flat chronological list for a future archive iteration; no new nested accordion levels.
- Source and evidence state remain explicit: an operator report is not verified commissioning or service approval.
- Keep private costs, identities, serials, contracts, receipts, private media and location out of the public projection.
- Do not generate WordPress URLs for articles that are not yet published.

## Content ownership

| Source | Owns |
| --- | --- |
| Digital HQ | Operational record, maintenance, warranties, procurement, approvals |
| Public Equipment Passport | Identity, verified specs, current status and concise linked history |
| WordPress | Narrative field reports, project stories, how-to articles and case studies |
| Media Center | Published photo/video assets linked from reports and passports |

All published editorial content should reference the canonical fleet ID (for example `SP-ARDHI-26`), an event date and approved public evidence state.

## Rollout

This initial change introduces `PassportHistoryFeed` for ARDHI's mature renderer and the generic public-projection renderer, with the existing archive preserved. It does **not** migrate MZIGO's protected mature renderer, modify Digital HQ schema/API, create a WordPress article, or deploy production. Those changes require separate verification and release review.

For ARDHI, the October 31 Dirt Day event is an operator report, not a commissioning sign-off. A longer WordPress field report can replace the summary's internal link after editorial publication and evidence review.

## Acceptance criteria

- A reader sees three events with no disclosure clicks.
- The historical archive and existing record URLs still work.
- Browser and keyboard navigation reach both recent items and the archive.
- No future slot is presented as completed historical evidence.
- Public/private projection safeguards remain unchanged.
- Build, typecheck, index validation and mobile/desktop preview pass before production release.
