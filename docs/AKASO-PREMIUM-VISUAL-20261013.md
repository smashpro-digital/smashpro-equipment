# AKASO premium visual integration

Branch: `feat/akaso-premium-visual-20261013`, based on main `bb705a9`.

## Scope and design

The existing Field Technology section remains after rental process and before contractors. Only its component, scoped styles, catalog parser and image-aware validation change. Equipment typography, dark surfaces, green accents, existing button component, fleet sections and Railway-independent deployment remain intact.

The feature pairs official AKASO 360 imagery with “Capture Every Angle,” exploration-stage copy, the existing HQ-provided affiliate URL, the Equipment YouTube channel and visible commission disclosure. Desktop/tablet use two columns and mobile stacks the image and copy. Explicit dimensions preserve the portrait aspect ratio; `object-fit: contain` prevents cropping. No animation, invented product specifications, ownership or field-test claims are added. Failed image loads show a reserved-space fallback while retaining the approved actions. Invalid or revoked catalog approval still hides the section.

## Official asset review

All five owner-supplied Awin creatives were fetched again on October 13 and visually inspected. The fresh image hashes match the earlier inventory; see [inspection metadata](release-captures/akaso-premium/asset-inspection.json).

| Creative | Dimensions | Content and decision |
| --- | --- | --- |
| **4587303** | **2160 × 2700** | **Selected.** AKASO 360 front/rear product image with original “Your First 360 Action Cam” wording; no dated sale or pricing. Clear portrait composition works on mobile. |
| 4158631 | 800 × 800 | Brave-series camera; not the AKASO 360. Excluded. |
| 4597556 | 5120 × 1600 | Black Friday Nov 20–Dec 1, 2025; expired. Wide banner also unsuitable for mobile editorial use. Excluded. |
| 4597662 | 1125 × 1440 | Black Friday savings/free gifts, no verified validity dates. Excluded. |
| 4587311 | 2832 × 1920 | Advertiser beach demonstration of an invisible selfie stick; not SmashPro field evidence. Excluded. |

Selected source: `https://www.awin1.com/cshow.php?s=4587303&v=69454&q=542867&r=3121518`. Served directly as the original 251631-byte JPEG, without cropping, editing, re-encoding or local redistribution. Access and use are based on the owner's supplied official affiliate assets and explicit Equipment-only authorization. No configured product feed exists; no additional merchant images were scraped. No secondary promotional banner is needed.

## HQ contract and permissions

Digital HQ remains the source of truth. Its public catalog optionally returns `image: { id, creative_id, url, width, height, alt }` from the existing registry. The frontend validates the reviewed image identity; it never constructs or substitutes an affiliate CTA URL. Creative registry record **1**, Awin creative **4587303**, uses Equipment promotional-assets permission **3**, relationship/property **1**, and campaign **3**. Existing product/link **1** and website placement **3** remain unchanged. No schema migration is required.

Initial live readback found the creative unpublished and permission planned. The owner then explicitly authorized activation of this Equipment-only creative and permission. All other creatives and Garage permissions remain unchanged. HQ requires the existing program/editorial/affiliate/placement gates plus the creative's publication state and promotional-assets permission before projecting the image. The Equipment-only projection does not grant Gear or Garage access. Withdrawal remains controlled through authenticated HQ review actions.

## Evidence

Actual pre-change production captures: [390px](release-captures/akaso-premium/before-390.png), [768px](release-captures/akaso-premium/before-768.png), [1440px](release-captures/akaso-premium/before-1440.png).

Local fixture captures are explicitly named `local-fixture-*`; they test a proposed approved image contract and are not evidence of production approval. Production acceptance and deployment receipts will be recorded after release.
