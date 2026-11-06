# Factory Bucket V2 pre-release validation

Reuses Equipment PRs #134/#135 and Web PR #143. Existing SP-ATT-BKT-001 and SP-UPG-BKT-TEETH-001 identities retained. The Loflin V2 PR #136 remains separate and is not included in this bucket release.

- Existing 179 unit tests passed; new bucket purchase/lifecycle regression test passed (180 tests total on this source).
- TypeScript, production build, public index, MZIGO media and Passport artifact/privacy checks passed.
- Four browser checks passed at 360, 390, 768 and 1440 pixels, including direct route/reload, actual media 927 image loading, one upgrade registry, two completed purchase stages, pending receipt/fitment/installation/testing, article link and no horizontal overflow/runtime errors.
- The initial 360px run exceeded a five-second external-image wait; the image loaded correctly and the rerun passed with a 20-second network allowance.
- No new equipment imagery or media upload. The existing October 31 WordPress photograph is retained with its approved alt text.
- Screenshots are local pre-release previews; live verification and deployment run IDs are separate release evidence.
- HQ remains canonical for procurement. This public registry uses static repository data; no automatic procurement/maintenance synchronization or unverified live database association is claimed.

[Mobile preview](bucket-390.png) / [Desktop preview](bucket-1440.png) / [Mobile hero](hero-390.png).
