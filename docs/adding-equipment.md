# Adding equipment

1. Add approved media to `images/` without renaming existing files. Prefer a landscape hero of at least 1600 px wide and optimized WebP/AVIF for new photography when source quality permits.
2. Add a typed `Equipment` record in `src/data/equipment.ts`. Use confirmed specifications only; mark unknown values clearly instead of estimating.
3. Add compatible records in `src/data/attachments.ts`.
4. If a new indexed public path is required, add a physical HTML entry, a Vite Rollup input, and a React route. Do not rely on an unverified server fallback.
5. Add the canonical URL to `public/sitemap.xml` and provide static title, description, Open Graph, and Twitter metadata in the entry HTML.
6. Run `npm run validate`, preview the production build, check direct navigation, and review at 320, 375, 768, 1024, and 1440 px.

Before publication, confirm rental language, safety restrictions, attachments, public contact destination, and any downloadable documentation with the fleet owner.
