# Contextual passport release

The schema-2 consumer accepts optional HQ `vesselContext` through the same explicit parser as HQ. It does not turn vessel metadata into `vessel`, `voyage`, `currentPosition`, cargo association or a shipment milestone. Malformed optional context disappears without taking the existing passport offline. Context is fetched from the configured production API, never embedded as shipment truth in the consumer bundle. Test fixtures are test-only.

The prominent vessel card labels publicly corroborated identity and the reported schedule separately from cargo. Source links are external, attributed and dated. The original operator references and initialization timestamp remain preserved. The schematic corridor has dashed projected styling, no coordinates, no completion percentage and no animation. It depicts stage relationships rather than a booked port sequence; its ship illustration is decorative, not a position. A textual corridor summary and monitoring rows provide equivalent accessible context.

Without an approved timestamped observation, the latest-context card links to external trackers. It does not copy their speed, destination, uncertain timestamps or restricted imagery. A future reviewed observation must carry explicit reuse approval and licensing through HQ's context projector. Existing licensed AIS map observations and public shipment events remain available when returned. Empty technical fields are collapsed for the context-enabled state. Existing factory/export archive and media are untouched.

Production continues to use `https://api.smashpro.app/api/fleet/shipment/SP-ARDHI-26`; no Railway hostname override. Existing 60-second outage retries, online recovery, verified-only cache and six-hour successful refresh are unchanged.

Release order: merge/deploy HQ context first, verify exact CORS, preserved pending record and null cargo/vessel/position evidence; then merge and manually dispatch the normal Equipment `deploy.yml` on main. No gate override. Browser-test both 1440px desktop and 390px mobile plus keyboard and original-media readback.

Rollback baseline: Equipment `cd51634916dc829dfbe42b306f8afc551b9e988b`, successful run `34693793642`, deploy job `103553806772`, artifact `10298387499` (`equipment-showroom-dist`), ZIP SHA-256 `12a745265dee4a1b3018bda6c62da5cc429c10bbea140ec32e67ae5622fdc544`. The exact ZIP is preserved in the preceding release's local evidence directory as `equipment-released-cd516349.zip`. Verify retention and rerun only the previous deploy job if restoration is needed:

```sh
gh api --method POST repos/smashpro-digital/smashpro-equipment/actions/jobs/103553806772/rerun
```

Preserve a healthy HQ service. Never reinitialize or detach Railway storage as part of a UI rollback.
