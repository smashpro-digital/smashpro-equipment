# Magnetic QR/NFC equipment key tags

Reusable magnetic equipment identification tags connect a physical fleet asset
to its existing machine passport. QR scanning and NFC tapping are intended to
open the same asset-specific destination and, when implemented and verified,
the shared check-in workflow. A scan or tap opens a workflow; it must never
automatically start a job or bypass operator, assignment, or readiness checks.

Status: prototype design archive. This directory does not establish production
readiness, deployed check-in functionality, or a released accessory product.

## Designs and layout

- [SP-ARDHI-26 prototype](designs/sp-ardhi-26/README.md)
- [ARDHI equipment passport record](../../docs/fleet/SP-ARDHI-26-PASSPORT.md)
- [Shared check-in implementation tracking](https://github.com/smashpro-digital/digital-hq/issues/217)

Each asset directory contains a README plus:

| Directory | Purpose |
| --- | --- |
| `source/` | Editable design files and original generator settings JSON, when available |
| `print/` | Exported STL parts and actual printer/slicer projects such as AD5X `.3mf` files |
| `photos/` | Identified prototype photographs and design/slicer screenshots with recorded provenance |

Use `.gitkeep` only while a required directory is empty. Do not fabricate a
settings file or rename an unrelated print project to fill a missing slot.
Preserve original extensions, separate parts, revisions, and dimensional
variants. Never overwrite differing bytes under the same filename.

## Expo demonstration and marketing variants

Customized branding, colors, or sponsor demonstration versions could introduce
the passport and planned shared workflow at Expo. These are potential variants,
not approved production designs or evidence of a working check-in deployment.
Record each customization and its review status; retain the canonical fleet
identity and distinguish demonstrations from real operational records.

## Add another fleet asset

1. Create `designs/<lowercase-fleet-id>/` with its own README and the same
   `source/`, `print/`, and `photos/` structure.
2. Record the canonical asset ID, intended passport/check-in URL, provenance,
   actual dimensions, hardware, material, printer profile, and open questions.
3. Name files `<fleet-id>-key-tag-v<revision>-<part-or-variant>.<extension>`;
   omit the suffix only when there is one unambiguous artifact. For example,
   keep `-50mm` and `-80mm` variants separate when both actually exist.
4. Test the encoded destination and physical assembly for that asset. Do not
   scale an existing model without rechecking magnet/NFC dimensions and fit.
5. Add a link here and in that asset's fleet documentation. Record assembly
   results before changing prototype status.

## Media and publication

Source designs and print projects stay here, outside public `images/` and
`public/`. Repository membership is not a promise of confidentiality; review
all files before committing. Only approved public photos may be copied into
`images/`, using flat, lowercase, fleet-prefixed names such as
`sp-ardhi-26-key-tag-v1-assembled-front.jpg` with the original extension.
Record approval and update any consuming references. No public photos are
included in this initial archive.

This follows the existing [media convention](../../docs/migration-notes.md)
and [engineering-source separation](../../docs/catalog/electrical/SP-PCM-001/drawings/nameplates/rev-a/README.md).
