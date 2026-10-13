# Equipment deployment correction — October 13, 2026

Branch: `fix/equipment-independent-deploy-20261013`, created from main `d8c5623`.

The [deployment runbook](deployment.md) records the source/history audit, dependency classification, preserved safeguards and rollback procedure. This change separates optional shipment service health from frontend deployment. It changes no application UI, Railway infrastructure or production database records.

## Pre-deployment evidence

- All four required repository FTP secret names are present; values remain private.
- The live HQ catalog contract passed: exactly one authorized Equipment AKASO 360 product/link, original URL/disclosure, public-only field allowlists, no-store, Garage and unknown selector rejection, anonymous admin rejection.
- AKASO migrations and activation were already completed in the preceding release. They are not rerun.
- Required local artifact policy remains independent of network availability. The original strict combined shipment policy remains available for shipment releases.

Final CI, rollback artifact readback, production workflow and live screenshots will be appended after verification. This preparation record alone is not deployment evidence.

## Local validation and rollback

TypeScript/build, public index, MZIGO media and passport artifact validation passed. The live AKASO contract passed. The independent shipment monitor correctly failed on the real HTTP 404. The initial full test run passed 130/132: both failures were the old deployment-workflow SHA in ARDHI/MZIGO protection fixtures. Only those two workflow hash entries were updated for this owner-authorized correction; all renderer, history, media and data hashes remain unchanged. Dedicated dependency tests verify retained safeguards.

The prior successful artifact (run 38100929184, artifact 11688096462) was downloaded before deployment. Eight live readbacks matched its homepage, three passport pages and homepage JS/CSS byte hashes. See [rollback baseline](EQUIPMENT-ROLLBACK-BASELINE-20261013.json).
