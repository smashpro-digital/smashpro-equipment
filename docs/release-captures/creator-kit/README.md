# Creator Kit visual verification

Local production build, 2026-10-17. Widths: 390px, 768px and 1440px.
Before uses the prior hero-restoration build. After uses the current approved-data
fixture: existing Awin camera image only; accessory photos remain hidden.
Approved preview explicitly simulates future photo permission. It is NOT production
or evidence of authorization. Pouch and SanDisk images remain unavailable.

| Width | Before | Current permissions | Preview if four accessory photos are approved |
| --- | --- | --- | --- |
| 390px | [Before](before-390.png) | [After](after-390.png) | [Preview](approved-preview-390.png) |
| 768px | [Before](before-768.png) | [After](after-768.png) | [Preview](approved-preview-768.png) |
| 1440px | [Before](before-1440.png) | [After](after-1440.png) | [Preview](approved-preview-1440.png) |

Hero screenshots before/after are byte-identical at all three widths:
[comparison hashes](hero-comparison.json). Existing Shorts consent/playback and
attribution tests pass. Section captures use a taller viewport after normal-height
responsive testing to avoid fixed-layer artifacts in Chromium's tall element capture.

[Implementation, records, verification and release status](../../sprints/akaso-creator-kit-20261017.md).
