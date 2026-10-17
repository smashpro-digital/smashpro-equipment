# AKASO passport hero restoration

Scope: /equipment/sp-med-cam-001.html. Restores the hero presentation from
4f027ac without reverting the visual/video feature.

- Original 1.35:1 desktop columns, headline scale, spacing, lead copy and CTA order.
- Official product artwork restored to its 4:5 area without the 480px cap.
- Removed the secondary thumbnail and field-journal panel from the hero.
- Retained the dedicated unboxing section below the hero, both approved video
  records, affiliate instrumentation/disclosure, MicroFab and field-kit sections.
- No backend, database, navigation or heavy-equipment source changes.

## Visual evidence

Captured at 390px and 1440px viewport widths on 2026-10-17.
Before captures show current production. After captures show the local production
build with approved test projection data (not a production deployment).
Screenshots crop to the hero, so the surrounding page gutter is outside the crop.

| Width | Before | After |
| --- | --- | --- |
| 390 | [Production](before-390.png) | [Restored local](after-390.png) |
| 1440 | [Production](before-1440.png) | [Restored local](after-1440.png) |

Compared with the original production layout in
[the original reference](../akaso-passport-showcase/before-1440.png) and its
390px companion. The original reference captured an unloaded image; restored
captures verify the official image actually loads. This is a layout comparison,
not a pixel-identical content comparison: current status, disclosure and video
CTA remain data-driven/current.

## Validation

- npm run validate: 156 unit tests, TypeScript, production build, public index,
  media and passport artifact checks passed.
- Protected ARDHI artifact check passed.
- Browser suite checks responsive layouts at 390, 768, 1024 and 1440px,
  hero image ratio/headline size, absence of nested media, unboxing below hero,
  affiliate URLs/disclosure, video consent/attribution, failure/withdrawal and
  broken-image behavior.
- Visual inspection: restored large typography, full product image, original
  mobile stacking and no horizontal overflow.
- Deployment: not performed as part of this targeted restoration.
- Browser suite: all 9 tests passed; git diff --check passed.
