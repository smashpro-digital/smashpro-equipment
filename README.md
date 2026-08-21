# SmashPro Equipment Showroom

React, Vite, and TypeScript power the public parent catalog for SmashPro Fleet equipment.

- Production URL: <https://smashpro.app/equipment/>
- Static deployment directory: `/public_html/smashpro.app/equipment/`
- Production base path: `/equipment/`

## Commands

```powershell
npm install
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

The dev server uses `http://localhost:5173/equipment/`. The production build is written to `dist/`; no persistent Node server is required.

## Structure

```text
src/app/          Route composition
src/components/   Reusable navigation, cards, layout, and metadata
src/data/         Typed equipment and attachment content
src/pages/        Homepage, equipment detail, and not-found pages
src/styles/       Responsive visual system
src/types/        Catalog interfaces
images/           Equipment-scoped production media with standardized filenames
public/           Robots and sitemap files
docs/             Architecture, routes, content, deployment, and operations
tests/            Node-based route and content safeguards
```

The build intentionally emits physical `sp-ardhi-26.html` and `sp-mzigo-26.html` files and copies the standardized, fleet-prefixed files in `images/` without changing paths during the build. See [route compatibility](docs/route-compatibility.md), [architecture](docs/architecture.md), and [media naming](docs/media-naming.md).

## Deployment

The prepared GitHub Actions workflow validates types and tests, builds the static application, verifies protected files, and deploys only `dist/` incrementally to the confirmed equipment directory. Deployment requires `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, and `FTP_PORT` repository secrets.

The workflow has not been deployed as part of this local migration. See [deployment documentation](docs/deployment.md).
