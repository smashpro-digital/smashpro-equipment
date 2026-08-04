# Deployment

## Target

- URL: `https://smashpro.app/equipment/`
- FTP directory: `/public_html/smashpro.app/equipment/`
- Payload: generated `dist/` files only
- Strategy: incremental; no clean-slate deletion

## Required secrets

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_PORT`

The current repository does not have these secrets. The workflow will fail with explicit annotations before FTP runs until they are configured.

## Pipeline

1. Checkout and install with `npm ci`.
2. Type-check and run tests.
3. Build the Vite multi-page application.
4. Verify the catalog, both detail pages, and key images.
5. Upload the validated `dist/` artifact.
6. After the validation job succeeds, deploy the artifact incrementally.

Manual runs use **Actions → Build and Deploy Equipment Showroom → Run workflow**. Production deployment should remain subject to environment review until the final diff, target, and secrets are approved.

## Rollback

Revert the release commit with `git revert`, push the revert, monitor the build/deploy workflow, and verify all protected URLs. Incremental FTP does not remove orphaned files; any remote deletion requires separate review and approval.
