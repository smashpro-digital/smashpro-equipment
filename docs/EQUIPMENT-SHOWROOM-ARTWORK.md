# Custom showroom artwork - October 14, 2026

## Analysis and decision

The fleet layout separated content from imagery successfully, but its factory/OEM image choices mixed portrait factory photography, yellow OEM equipment and poster artwork. That weakened the custom SmashPro identity. The earlier ARDHI and NYASI posters established the black/green visual language but included headlines and miniature feature strips unsuitable for small cards. MZIGO already had a cleaner custom-machine composition. LiftMate's official custom concept communicates its truck-loading workflow; its yellow OEM photograph belongs in the technical reference context.

Use a dedicated, coordinated showroom set through the existing `cardMedia` field. Keep the Passport hero assets independent and unchanged. This makes card framing consistent without imposing a card crop on the larger Passport headers. UMBA already uses the supplied custom workshop image and remains unchanged.

## Assets and provenance

Generated using the built-in imagegen tool from the repository's existing promotional/concept images. All four outputs are 1586 x 992 PNGs, retained non-destructively as version 1 assets. Original source artwork and documentary photos are preserved. These are AI-generated promotional concepts, not evidence of build completion, installed features, capacity, field operation, or availability. Existing card status and verified specifications remain authoritative.

| Asset | Source reference | Saved image |
| --- | --- | --- |
| ARDHI | `sp-ardhi-26-hero.png` | [Custom card](../images/sp-ardhi-26-showroom-custom-v1.png) |
| MZIGO | `sp-mzigo-26e-hero-artwork-2026-09-09.png` | [Custom card](../images/sp-mzigo-26e-showroom-custom-v1.png) |
| NYASI | `sp-nyasi-26-showroom-hero.png` | [Custom card](../images/sp-nyasi-26-showroom-custom-v1.png) |
| LiftMate | `sp-liftmate-27-official-concept.png` | [Custom card](../images/sp-liftmate-27-showroom-custom-v1.png) |

Every card displays the same "Custom concept artwork" caption. Metadata marks the images as promotional artwork / concept identity art, with factory, production and field evidence flags false. Alt text explicitly identifies AI-generated artwork. No database or Passport rendering changes.

## Prompt set

Mode: built-in imagegen, precise-object-edit. ARDHI established the shared style; the other three calls used their original artwork as the machine reference and the generated ARDHI image only as the lighting/background/framing reference.

Shared direction: one premium SmashPro equipment showroom card image; preserve the referenced machine design and custom green/black finish faithfully. Dark charcoal industrial workshop, subtle vertical green practical rim lights, restrained satin concrete reflections, clear neutral-white key light. Landscape 16:10; full machine centered, roughly 80 percent frame width, safe margins and no clipped structural parts. High-end commercial product photography/render. No poster typography, feature icons, specification strips, floating logos, wall text, people, border or collage. This is promotional concept artwork, not documentary evidence.

- ARDHI: preserve tracked compact loader, black bucket, loader arms, hoses, lights, machine-applied SmashPro branding and YF380 identity.
- MZIGO: preserve four-wheel electric carrier, raised dump bed, black chassis, rugged wheels, red hydraulic ram and SP-MZIGO-26E identity. Remove the separate remote-control foreground prop.
- NYASI: preserve low tracked mower, exposed black engine, orange beacon, twin front lights, black front blade, tracks, SmashPro branding and LM500 identity.
- LiftMate: preserve the official concept's green/black scissor platform, rail extension, rectangular ground base, side control box and mulch stack loading into the black pickup. Keep the pickup rear as workflow context; do not substitute a forklift, pallet jack or wheeled mast design.

## Validation

Passed: 138 Node tests, TypeScript, production build, public-index/media/Passport validation, ARDHI artifact/evidence checks, five responsive browser cases and git diff --check. Images decode successfully, equal row heights and aligned links remain intact, and no horizontal overflow was observed. Protected data hashes were refreshed only for the reviewed card-media metadata changes. Responsive captures: [375px](release-captures/showroom-artwork/after-375.png), [768px](release-captures/showroom-artwork/after-768.png), [1024px](release-captures/showroom-artwork/after-1024.png), [1440px](release-captures/showroom-artwork/after-1440.png), [1920px](release-captures/showroom-artwork/after-1920.png).

## Adding future cards

Use the same landscape composition, dark workshop lighting and full-machine safe margins. Supply card-specific media through the existing collection record; keep the Passport hero independent. Label generated promotional artwork accurately and never advance evidence or lifecycle flags based on an image.
