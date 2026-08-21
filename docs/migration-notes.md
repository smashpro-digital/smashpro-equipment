# Migration notes

## Previous implementation

The repository used three hand-authored HTML files, one shared homepage stylesheet, and a small menu/year script. Detail pages embedded their own CSS. There was no package manager, component system, typed content model, test suite, build output, rewrite configuration, or persistent server.

## New implementation

The showroom now uses React, TypeScript, React Router, and Vite. Content is centralized, equipment pages share one reusable template, and multi-page build inputs preserve established `.html` routes without server rewrites.

The `images/` directory remains the static-media source. Media now uses flat, fleet-prefixed lowercase kebab-case filenames, and Vite copies them to `dist/images/` unchanged.

## Deliberate omissions

- No database or CMS
- No Express or long-running Node server
- No live rental or availability claim
- No public SPGo API integration
- No direct SPgO network link because no approved public destination was found; contractor access routes through public SmashPro contact
- No Mzigo pronunciation because no approved source was found
- No spec-sheet download because no approved PDF exists
- No analytics because none was found in the current implementation
