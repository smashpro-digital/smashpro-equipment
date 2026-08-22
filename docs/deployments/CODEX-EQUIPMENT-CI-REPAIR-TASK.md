# Temporary Codex handoff: repair Equipment Showroom CI/CD

This file exists only to seed the repair pull request. Remove it before the repair is finalized.

## Incident

The `Build and Deploy Equipment Showroom` GitHub Actions workflow has failed repeatedly on pushes to `main`, including workflow runs #33 through #40. The visible failures span these commits:

- `ea026e0` — `ops: purge stale media page cache`
- `e0ad1f5` — `docs: catalog SP-INAMA-26 listing and concept media`
- `b0ca097` — `Add SmashPro Garage golf cart dream project page`
- `12e59bd` — `Add golf cart tech build entry page`
- `7923ead` — `Route golf cart dream project page`
- `a480c2d` — `Build golf cart dream project page`
- `ddb93f3` — `Feature golf cart dream project in equipment showroom`
- `f336f24` — `Add golf cart tech build project passport`

The separate `Purge SmashPro Media Cache` workflow succeeded for `ea026e0`, while the normal showroom build/deploy workflow failed. Treat this as a persistent CI/CD incident, not merely a defect in the newest golf-cart commit.

## Required investigation

1. Use GitHub Actions evidence first. Inspect the failed `Build and Deploy Equipment Showroom` runs, jobs, failing step, and full logs. Identify the earliest failure in the sequence and distinguish the root cause from downstream/cascading failures.
2. Reproduce the failing command locally in the Codex environment using the repository's locked dependencies and Node 22.
3. Inspect the complete recent commit range before changing code. Preserve all intended work for SP-INAMA-26, the SmashPro Garage golf-cart dream project, equipment routing/catalog entries, media behavior, and the existing production deployment target.

## Repair requirements

- Fix the actual root cause with the smallest durable change.
- Do not revert or silently drop recent features to make CI green.
- Do not disable, weaken, or delete validation merely to pass the workflow.
- Do not hardcode, print, or expose GitHub secrets or FTP credentials.
- Do not deploy from this repair branch.
- Keep production deployment restricted to the intended `main`/manual path.
- If the problem is Git LFS, preserve real media delivery and the workflow's protection against unresolved LFS pointer files. Do not make a pointer file pass as a valid video.
- If the problem is missing generated routes, catalog/index data, static assets, or protected output paths, repair the source/build pipeline and add or update focused tests.
- If the problem is an FTP or environment setting, keep credentials secret, improve diagnostics where useful, and do not fabricate values.
- If practical, make validation run on pull requests without allowing the deploy job to run from PR branches, so this class of failure is caught before merging.

## Mandatory verification

Run and report the exact results of:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run validate:index
```

Also verify that every protected output currently required by `.github/workflows/deploy.yml` exists and that the pallet-fork MP4 is the real LFS-resolved asset rather than a pointer.

Review the workflow YAML for syntax and event/job guards. Use `actionlint` or an equivalent YAML/workflow validation when available.

## Delivery

- Commit the repair to `codex/repair-equipment-showroom-ci`.
- Remove this temporary handoff file before the final repair commit.
- Leave a concise PR summary containing: confirmed root cause, files changed, test/build evidence, any remaining production-only verification, and whether a rerun/deploy is needed after merge.
- Do not merge the pull request automatically.
