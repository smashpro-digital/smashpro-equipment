# SP-ARDHI-26 QR/NFC key tag — v1 prototype

Status: archived mesh; not print-approved or assembly-validated. Recorded
2026-10-11. The `v1` name identifies this archived prototype, not a production
release or a claim that earlier designs did not exist.

- Asset: **SP-ARDHI-26**.
- [Equipment passport documentation](../../../../docs/fleet/SP-ARDHI-26-PASSPORT.md).
- Intended QR/NFC destination:
  <https://smashpro.app/equipment/sp-ardhi-26.html#check-in>.
- [Shared check-in implementation tracking — Digital HQ #217](https://github.com/smashpro-digital/digital-hq/issues/217).
- **Check-in deployment is unverified.** The issue was open when inspected;
  an issue or URL fragment is not proof of deployed behavior. The STL's encoded
  QR destination and any physical NFC programming have not been verified.
- Intended material: **PETG**. Intended printer: **FlashForge AD5X**.
  Installed nozzle size and slicer profile are unverified.

## File inventory and provenance

The owner identified one STL in Downloads. It was moved without changing its
bytes. No existing repository references to the original filename were found.

| Original filename | Archived file | Status |
| --- | --- | --- |
| `combined-1791693852650.stl` | [print/sp-ardhi-26-key-tag-v1.stl](print/sp-ardhi-26-key-tag-v1.stl) | Supplied binary STL; 1,076,084 bytes; 21,520 triangles |

SHA-256:
`63cb88dddeacbe2a2f4411e537ac14cceb666e94b0378576458d08907497f5eb`.

Required but not supplied/identified:

| Expected artifact | Intended location | Missing evidence |
| --- | --- | --- |
| `sp-ardhi-26-key-tag-v1-settings.json` | `source/` | Original generator settings, including units and Hidden setting |
| `sp-ardhi-26-key-tag-v1-ad5x.3mf` | `print/` | Actual AD5X project, nozzle/profile, orientation, and sliced preview |
| `sp-ardhi-26-key-tag-v1-<photo-description>.<original-extension>` | `photos/` | Latest 80 mm screenshot and identified prototype/assembly photos |
| Separate 50 mm keychain design | `source/` and/or `print/` | Actual model/export; no confirmed 50 mm artifact located |

The repository and Downloads were searched for relevant filenames and design
extensions. Nearby `combined-1791680122659.stl`, `QR.stl`, and
`BusinesCard05.3mf` were excluded following the owner's clarification that they
are not part of this task. `combined-1791694528858.stl` also appeared during
inspection but is not owner-confirmed; it remains untouched. Older ARDHI QR
artwork was not assumed to belong to this prototype. No inaccessible file
location was supplied for the missing artifacts; their locations are unknown.

## Dimensions and geometry inspection

Method: read the binary STL triangle count and all vertex coordinates; compute
axis-aligned bounds and connected coplanar triangle surfaces at Z = 0, 1, 2.5,
3.1, 4, and 5. These are mesh observations, not slicer, watertightness, or
physical fit certification. **STL stores no units.** Values below are model
units, corresponding to millimetres only if imported at 1 unit = 1 mm without
scaling. Confirm this in the actual AD5X project.

| Feature | Observed geometry / interpretation |
| --- | --- |
| Whole exported mesh | X: -64.6 to 40; Y: -40 to 40; Z: approximately 0 to 5; total **104.6 × 80 × 5** |
| Main body surfaces | X: -54.1 to 40; Y: -40 to 40; Z: 0 to 4; includes side geometry beyond the 80-wide central region |
| Additional side/loop geometry | Extends total X bound to -64.6; retained together in the original combined STL |
| Raised surface geometry | Z: 4 to 5; total height is 5, not just the proposed 4-unit base |
| Four candidate magnet pocket floors | Z: 3.1; each planar footprint spans 10.2 × 10.2; centers approximately (-39, -24.9), (24.9, -24.9), (-39, 24.9), (24.9, 24.9) |
| Candidate hidden NFC cavity surfaces | X: -19.8 to 5.7; Y: -12.75 to 12.75; planes at Z: 1 and 2.5; **25.5 × 25.5** footprint and **1.5** separation |

The observed planes are consistent with a 4-unit base, 3.1-deep pockets opened
from the Z=0 face, and an internal 1.5-deep NFC cavity. Exact circular wall
geometry, solid integrity, opening direction, and slicer interpretation remain
to be verified with cross-sections. The observed cavity footprint and four
pocket footprints do not overlap in XY; this limited check does not certify
the entire mesh or remaining wall strength. If the base is 4 and pocket depth
is 3.1, nominal remaining material is 0.9; confirm actual geometry and strength.

The owner reports the latest screenshot shows **80 mm width**; the screenshot
itself was not supplied. The mesh has an 80-unit Y span, but its overall X span
is 104.6, so do not label its full external envelope as 80 × 80 mm. The proposed
**50 mm keychain width** is a separate, unverified variant. No rescaling was
performed. If both variants are supplied, keep them separately named and
revalidate pockets rather than shrinking magnets and NFC cavities with the tag.

## Hardware and proposed settings

| Item | Owner-provided specification | Verification still needed |
| --- | --- | --- |
| Purchased magnets | Nominal **10 mm diameter × 3 mm thick** | Measure delivered parts; verify fit and retention |
| Open magnet glue pockets | Proposed **10.2 mm diameter × 3.1 mm depth**, with a **4 mm base** | Mesh observations above are consistent; confirm exact geometry and printed fit |
| Purchased NFC tags | Nominal **25 mm NTAG215 adhesive coins** | Thickness is unknown and must be measured, including installed adhesive/backing configuration |
| Latest proposed hidden NFC cavity | Round, **25.5 mm diameter × 1.5 mm depth**, **Hidden enabled** | Mesh contains matching surface bounds/separation; original settings file is missing, so the toggle itself is unverified |

Final NFC cavity depth must follow **measured tag thickness plus clearance**,
not the untested nominal 1.5 mm proposal. Hidden NFC insertion requires a
slicer pause **before the first layer closing the cavity**. Determine that
point from the actual sliced preview after confirming orientation, layer
heights, and cavity geometry; no pause layer number has been established.

The current magnet design uses **open glue pockets**. Hidden magnet cavities
are a future variant, not an implemented feature of this design.

The owner prefers a **single-part clear adhesive with no two-part mixing**.
Adhesive selection, PETG/magnet bond testing, and cure validation remain pending.
No adhesive product or verified retention performance is claimed here.

## Assembly and validation checklist

All items remain open unless supported by a dated result and evidence.

- [ ] Obtain the original settings, AD5X project, and latest design screenshot.
- [ ] Confirm imported units, full external dimensions, orientation, and whether
      this is the intended 80 mm variant; identify any separate 50 mm variant.
- [ ] Confirm the installed nozzle size matches the slicer profile and PETG setup.
- [ ] Inspect mesh/cross-sections and sliced preview: pocket diameter/depth,
      base thickness, remaining walls, closed NFC roof, and no cavity overlap.
- [ ] Measure actual magnets and NFC coin thickness; adjust clearance based on
      measurements and a printed fit sample before committing to assembly.
- [ ] Program NFC with the intended URL and test it **before embedding**.
- [ ] Decode the printed QR and verify its exact destination, contrast, and size.
- [ ] Determine and record the pause from the first cavity-closing layer in the
      actual sliced preview; confirm insertion clearance before resuming.
- [ ] Select a single-part clear adhesive, test PETG/magnet bonding, confirm
      magnet orientation, and complete the required cure before loading.
- [ ] Test QR and NFC after assembly **and on the intended mounting surface**;
      record any surface-related read failures and the tested phone/readers.
- [ ] Verify magnet retention with the **full key set** and intended handling.
- [ ] Verify shared check-in deployment and explicit operator flow separately;
      a scan/tap opens a workflow and must **never automatically start a job**.
- [ ] Record prototype revision, measurements, print/profile settings, pause
      evidence, assembly photos, results, and unresolved issues before release.

Keep prototype photos in `photos/`. Only separately approved public photos may
be copied to public `images/` with fleet-prefixed names; source and print files
must remain outside that public media tree. See the [accessory guide](../../README.md).
