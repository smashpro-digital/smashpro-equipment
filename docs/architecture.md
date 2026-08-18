# Architecture

## Decision

The showroom is a static React application built with Vite and TypeScript. React Router supplies route-aware page composition, while three physical HTML entry files preserve direct navigation on hosting with no rewrite support.

## Runtime

- Browser-only React; no persistent Node process
- `BrowserRouter` with basename `/equipment`
- Local typed records in `src/data`
- Shared layout and components in `src/components`
- Route pages in `src/pages`
- Global responsive styling in `src/styles`

## Build

Vite emits `index.html`, `sp-ardhi-26.html`, and `sp-mzigo-26.html`. A small build plugin copies the preserved root `images/` directory into `dist/images/` without renaming files. This protects current image and video URLs while keeping Vite's generated application assets hashed.

## Boundaries

The public catalog does not read private fleet tables, expose contractor-private data, or assert live availability. The Equipment Passport model is normalized in `docs/sql/equipment_passport_v1.sql`; a server-owned public projection is the future integration boundary. `admin.html` is a no-index client for that authenticated API and deliberately does not persist locally when the API is absent. SPGo remains the source of contractor eligibility and reservation workflows.
