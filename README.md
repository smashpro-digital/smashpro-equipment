# SmashPro Equipment

The official public catalog for SmashPro Fleet equipment. The static site presents published machines, their documented specifications, approved imagery, and future fleet categories without claiming unconfirmed rental availability.

- Production: <https://smashpro.app/equipment/>
- Repository: `smashpro-digital/smashpro-equipment`
- Production directory: `/public_html/smashpro.app/equipment/`

## Local development

No build step or framework is required. Serve the repository root with any static server, for example:

```powershell
python -m http.server 8080
```

Then open <http://localhost:8080/>. Opening `index.html` directly also works, though a local server is preferred for link and asset testing.

## Structure

```text
index.html                 Catalog homepage
sp-ardhi-26.html           Preserved SP-ARDHI-26 detail page
sp-mzigo-26.html           Preserved SP-MZIGO-26 detail page
assets/css/equipment.css   Shared catalog styling
assets/js/equipment.js     Navigation and maintained copyright year
images/                    Stable production media used by detail pages
.github/workflows/deploy.yml
```

The root `images/` directory is intentionally retained because the established equipment pages and public URLs depend on it.

## Adding equipment

1. Add approved, optimized images to `images/`. Use lowercase, descriptive filenames for new media; do not rename existing assets.
2. Copy an existing detail page or create a semantic static HTML page at the repository root.
3. Use only confirmed specifications. Include purpose, known applications, image dimensions, useful alternative text, a canonical URL, Open Graph metadata, and a link back to the catalog.
4. Add a card to the featured fleet grid in `index.html` when the page is ready to publish.
5. Change the matching category from “Coming to the Fleet” only after equipment content is published.
6. Test the homepage, detail page, links, media, keyboard navigation, and small-screen layout locally.

Use the same process for machines, attachments, trailers, recovery equipment, and fleet-support tools. Keep unpublished categories visible as non-clickable future states rather than empty links.

## Deployment

Pushes to `main` and manual workflow runs deploy the repository's public files to `/public_html/smashpro.app/equipment/`. The workflow follows the existing SmashPro FTP convention and uses incremental deployment (`dangerous-clean-slate: false`) so unrelated remote content is not deliberately wiped.

Required GitHub Actions secrets:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_PORT`

Credentials must never be committed. In GitHub, run a manual deployment from **Actions → Deploy Equipment Catalog → Run workflow**. Concurrency prevents overlapping production uploads. The workflow excludes repository metadata, local notes, credentials, temporary files, dependencies, and documentation.

## Safe rollback

1. Identify the last known-good commit in GitHub.
2. Revert the faulty commit with `git revert <commit>`; do not rewrite `main` history.
3. Push the revert to `main` and monitor the deployment workflow.
4. Verify the catalog homepage and both detail URLs after the workflow succeeds.

Because deployment is incremental, reverting restores tracked files but does not automatically remove files introduced by a faulty release. Any remote deletion should be reviewed and performed as a separate, explicitly approved operation.
