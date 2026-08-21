# Route compatibility

The production host is a static Apache-style directory at `/public_html/smashpro.app/equipment/`. No `.htaccess`, rewrite rule, or persistent Node runtime is present, so the migration uses Vite multi-page output rather than relying on SPA fallback behavior.

| Existing public URL | Build output | React route | Compatibility strategy |
| --- | --- | --- | --- |
| `/equipment/` | `dist/index.html` | `/` | Physical index file |
| `/equipment/sp-ardhi-26.html` | `dist/sp-ardhi-26.html` | `/sp-ardhi-26.html` | Physical HTML entry; no rewrite needed |
| `/equipment/sp-mzigo-26.html` | `dist/sp-mzigo-26.html` | `/sp-mzigo-26.html` | Physical HTML entry; no rewrite needed |
| `/equipment/images/equipment/<fleet-id>/<role>/*` | `dist/images/equipment/<fleet-id>/<role>/*` | Static media | Standardized equipment-scoped paths copied unchanged during build |
| `/equipment/assets/*` | `dist/assets/*` | Vite assets | Generated hashed JS/CSS |

Unknown paths render a branded not-found view when they reach one of the application entry files. The migration does not create or assume a catch-all server rewrite.

No brochure, inquiry, analytics, redirect, QR-specific, or additional public catalog paths were found in this repository. Searches of the nearby `smashpro.app`, `smashpro-home-services`, and `SPGo` repositories found SP Fleet data references but no public links to these showroom URLs.
