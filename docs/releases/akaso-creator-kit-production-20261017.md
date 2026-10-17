# AKASO Creator Kit production release - 2026-10-17

Status: release validation in progress; live success not yet claimed.

Owner authorized production release on 2026-10-17. Deploy the scoped HQ API first,
read back its contract, then merge and dispatch Equipment deploy.yml with
shipment_release=false and akaso_release=true. No Railway prerequisite.

Source commits: Equipment 722350c, 6a55b29, a59fdee, 509d50d;
Digital HQ 356c797, af38d9c. All are ancestors of their release branches.

The release also adds the owner-supplied case retailer destination
https://a.co/d/01Lk7JHj (B0G1C14LPK), explicitly non-affiliate, using a separately
verified association in passport 4. Product 6 and its manufacturer details remain
intact. No new product or schema. Existing Awin URLs remain byte-for-byte intact.

Recovery: previous frontend artifact from Actions run 39012026636 at c1d545b
matches production passport HTML and referenced assets. A private copy is retained
under creator-kit-production-20261017/frontend-rollback in the local release
workspace. Previous dashboard/api/_media_equipment.php retained beside it;
SHA-256 c649d33dbee64406f949ba30112722f41f0b0276e34498b63a01a0b9f4528b7a.
Restore that single PHP file through the existing authenticated FTP transport if
needed. For frontend rollback, restore the retained dist with the same incremental
FTP destination /public_html/smashpro.app/equipment/ and no clean-slate deletion,
or revert this scoped release through PR and dispatch the established workflow.
The additive kit associations are compatible with the preceding API renderer.

Current validation: PHP 7.4 lint; media projection, kit rights/privacy/URL/lease,
retailer integrity, affiliate policy/catalog/Equipment projection/guards passed.
Frontend typecheck, unit suite, Vite build and public index/passport checks passed.
Final browser, workflow, live API and screenshot evidence will be appended below.

Approved accessory photos are scoped to products 3-6 in Equipment, authorization
2026-10-17-akaso-accessory-photo-reuse. Pouch and SanDisk images remain unavailable.
No Garage grants, private inventory projection or proposed product sale claims.
