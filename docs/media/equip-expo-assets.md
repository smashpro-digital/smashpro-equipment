# Equip Expo visual asset manifest

Selected October 18, 2026. Images are organizer-supplied editorial press resources used to illustrate independent SmashPro coverage of Equip Exposition. No exhibitor, sponsor or official-partner status is implied.

## Source and usage basis

The official [Top 15 Things to See and Do at Equip Expo 2026](https://www.equipexposition.com/equip-magazine/Top15ThingsEquipExpo2026) article explicitly provides **Photos for download** through this [organizer-linked collection](https://www.dropbox.com/scl/fo/qdergx0q4t1jge94pc6s2/ABAug7YuoyW9r2c47OnFUHM?dl=0&rlkey=f3cl1u24pjwxl6koyuet605an). The normal shared-folder download returned a ZIP without authentication or access-control bypass. The file URL is this collection download; individual file names below identify the exact members. Original ZIP retained privately for provenance. No CDN-only permission inference, third-party advertisements, or website screenshots used.

The [Media & Press page](https://www.equipexposition.com/media-info) provides **Logos for Equip**, describing the area as for trade press and exhibitors. Its supplied [2026 logo ZIP](https://page.equipexposition.com/hubfs/Marketing%20Files/2023%20Marketing%20Assets/Image%20Folder/Resources%20-%20Do%20Not%20Delete/EquipLogoFile_2026.zip) is the logo source. Use is limited to identifying the event in this editorial campaign. No broader license or official affiliation is claimed. No separate license text or required credit syntax was included in the downloaded archives; embedded photographer attribution is reproduced below and on the page.

## Selected originals

| Original member | Description | Capture evidence | Supplied credit | Use |
| --- | --- | --- | --- | --- |
| `Equip Exposition ⏐ Photo 43.jpg` (separator is ASCII pipe in ZIP) | Compact excavator digging outdoors | EXIF DateTimeOriginal and IPTC: 2023-10-19 | Copyright `COLE_GIORDANO` | Event hero |
| `Equip Exposition Photo 47.jpg` | Ride-on mower being tested outdoors | EXIF/IPTC: 2023-10-20 | Copyright `COLE_GIORDANO` | Both banners and equipment-in-action card |
| `Equip Exposition Photo 7.jpg` | Exhibitor demonstrates an outdoor-space visualization on a tablet | EXIF/IPTC: 2023-10-19 | Creator `ALLIE FILLEY`; copyright `alliefilley.com` | Technology card |
| `EQP04274.jpg` | Four panelists and an audience | EXIF/IPTC: 2023-10-20 | No photographer credit supplied; label `Provided by Equip Exposition` | People/ideas card |
| `EquipLogoFile_2026/equip_White.png` | Supplied white Equip wordmark | Supplied 2026 logo package; no photo year | Equip Exposition | Hero desktop and both banners |

All photographs are visibly labeled **2023 archive**, based on capture metadata, not the 2026 article date. Original photo dimensions: 2048 × 1365 (demo, mower, panel), 2048 × 1366 (tablet). Logo original: 1973 × 831. No product identity, software capability, panelist identity or sponsor relationship is inferred from the imagery.

## Optimized deployed files

Web location: `/wp-content/themes/smashpro/assets/images/equip-expo/`. Equipment copies the identical mower variants and logo into `/equipment/images/equip-expo/`; no runtime cross-origin photo dependency. WebP variants preserve full compositions; Equipment's compact mobile banner uses a checked 16:9 crop centered at 50%/68%. Hero uses 3:2 with subject and bucket visible. Logo resized proportionally, without recoloring; PNG avoids SVG active content.

| Filename | Dimensions | Bytes |
| --- | --- | ---: |
| `expo-2023-demo-640.webp` | 640 × 427 | 39934 |
| `expo-2023-demo-960.webp` | 960 × 640 | 78074 |
| `expo-2023-demo-1440.webp` | 1440 × 960 | 152656 |
| `expo-2023-mower-480.webp` | 480 × 320 | 36704 |
| `expo-2023-mower-960.webp` | 960 × 640 | 105806 |
| `expo-2023-technology-480.webp` | 480 × 320 | 27818 |
| `expo-2023-technology-960.webp` | 960 × 640 | 75504 |
| `expo-2023-people-480.webp` | 480 × 320 | 26646 |
| `expo-2023-people-960.webp` | 960 × 640 | 65162 |
| `equip-logo-white.png` | 480 × 202 | 12951 |

Hero is eager with high fetch priority and responsive 640/960/1440 sources. Cards/banners lazy-load responsive 480/960 sources. All images declare dimensions and descriptive alt text. Asset hashes are recorded in the release evidence JSON. Logo dimensions round to 480 × 202 (original ratio preserved to pixel precision).

## Editorial boundaries

`inc/equip-expo-content.php`, video approval filtering, the existing public banner projection and Equipment validation/fallback are unchanged. No organizer video was added: the optional preview is omitted without an empty player. Organizer imagery cannot activate coverage sections or Watch CTAs. Continue following [owner publishing instructions](equip-expo-2026.md).


Canonical release evidence: Digital HQ `docs/partnerships/equip-expo-2026-visual-release.md`.
