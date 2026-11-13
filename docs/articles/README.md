# SmashPro Stories — import-ready article drafts

This folder is the editorial staging area for WordPress articles prepared inside the
equipment repository. No WordPress API credentials exist in this workspace (theme
changes ship by the FTP theme-patch workflow only), so stories are prepared here as
**complete, import-ready drafts** and imported manually by an editor.

## Import workflow

1. In WordPress, create a new **draft** post with the Title, Slug and Excerpt from the
   draft's front-matter block.
2. Paste the HTML body (everything below the `<!-- BODY -->` marker) into the code
   editor view of the post.
3. Set the featured image to the URL named in `hero` (media is already hosted at
   production URLs under `https://smashpro.app/equipment/images/`; no re-upload is
   required unless WordPress-local copies are preferred).
4. Keep the post in **draft** until editorial review approves publication.
5. After publishing, update `src/data/ardhiMediaCollection.ts` story entries and the
   media collection's featured-story cards to link the live article URLs.

## Current drafts

| Draft | Purpose | Status |
| --- | --- | --- |
| `ardhi-from-factory-floor-to-first-dirt.md` | Full journey: factory → shipping → uncrating → first field work | Ready for import (draft) |
| `ardhi-dirt-day-first-field-work.md` | October 31 field session, lessons and follow-ups | Ready for import (draft) |
| `ardhi-early-ownership-log.md` | Documented issues, owner-reported repairs, open verification | Ready for import (draft) |

`ardhi-media-asset-map.md` records which assets each destination uses.

## Factual boundaries carried into every draft

ARDHI (SP-ARDHI-26, factory model YF380, he/him) is delivered and field-evaluated but
not commissioned. Operating durations are operator-reported, not verified meter
readings. The engine label identifies a Runtong 739 cc twin-cylinder gasoline engine;
the exact model is unconfirmed. The quick-change pin repair is owner-reported with
verification pending. The throttle travel restriction is open; a replacement cable is
ordered, not installed. No hydraulic float capability is claimed. No track warranty
claim is confirmed. Private costs, contacts, supplier conversations and HQ records
stay out of article bodies.
