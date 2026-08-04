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

The public catalog does not read fleet databases, expose contractor-private data, or assert live availability. SPGo remains the future source of contractor eligibility and reservation workflows; the showroom links only to public entry points.
