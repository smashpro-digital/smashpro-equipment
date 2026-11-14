# Fleet Passport sensitive-identity protection

Canonical cross-repository audit: Digital HQ [`docs/security/fleet-passport-rbac-audit.md`](https://github.com/smashpro-digital/digital-hq/blob/security/fleet-passport-sensitive-identity/docs/security/fleet-passport-rbac-audit.md). Its implementation matrix distinguishes source, enforcement, assignment and production proof. HQ owns scoped ecosystem grants and canonical private identity; SPGo owns execution/holds; Equipment is the public projection; WordPress public uploads are not a private evidence store.

## This Stage A patch

- Remove Loflin manufacturer serial/job fields from public data and types, renderers and captions; remove acquisition detail and operational checklist contents from the Loflin public configuration. Preserve public manufacturer/model/specification identity, delivery history, hero/showroom, and **Delivered · Fitment Review Required**. Commissioning/field-test milestones and verified-host state are unchanged.
- Remove MZIGO manufacturer serial from the identity/specifications/renderer, rather than masking a rendered field. Withhold the nameplate, certificate, toolkit/QR and control-panel originals from gallery data and static output. Originals remain unchanged in source history and are additionally preserved outside Git; they are not made private merely by this patch.
- Hold Loflin technical inspection, plate and acquisition-evidence images from public gallery references. Preserve approved general delivery/mounting photography. The plate remains omitted pending a separately verified redacted derivative; no recreated or CSS-redacted evidence.
- Build-time checks reject known identifier fingerprints, forbidden identity fields, restricted original references and original files. Fingerprints are tooling-only; no raw identifiers or private input are injected into frontend variables or runtime environment. Existing public-index/artifact checks remain enabled.
- Generate Apache containment rules for held MZIGO image paths and historical main bundles. The current sanitized bundle hash is resolved at build time; no broad exception for older identity-bearing bundles. Public HTML/JSON gets no-store headers. The rules do not prove host/CDN enforcement: independently test direct old URLs, cache invalidation and normal public navigation after release. Cached old HTML must be invalidated before revoking its bundle URLs to avoid stale-page failures.
- Link to the existing Digital HQ authenticated surface; no new public login/provider, sensitive client state or unauthenticated identity fetch.

## Evidence and limits

Confirmed prior exposure: current public source/bundles include manufacturer identity; the original WordPress Loflin plate is anonymously downloadable; MZIGO local nameplate/control-panel pixels include identity and QR data. Previous Git commits, published screenshots, original uploads and cached copies remain exposure records. This patch does not rewrite history, delete originals, retract downloads or claim the data is secret again.

The trailer candidate contains VIN-pending descriptions rather than an assigned VIN. Current static ARDHI identity has no manufacturer serial field populated; existing engine/plate summaries do not establish that every frame of every photo/video is sanitized. Other technical media and generated-document pixels require continued evidence review. Public specifications/status and private procurement are distinct; historical acquisition prose outside this Loflin patch is listed as a follow-up classification gap in the owning audit.

Stage B code is in the Digital HQ permission-scoped identity/media API and existing dashboard route. SPGo receives field allowlists and private-file/cache hardening. WordPress receives a scoped original/variant containment proposal and migration procedure. Actual HQ grants, private-root configuration, original import, host/CDN revocation and positive production authorization tests are release gates, not inferred from source code.

Local validation: TypeScript, 219 tests, production build, public index, media/artifact/identity checks; existing Loflin desktop/mobile browser checks at 1440/390 pixels. Production protection is **not claimed** by this source report.

Owner approved deterministic solid masks on November 13. The separate lossless public Loflin plate derivative covers the serial value, manufacturer job value and QR code; all other decoded pixels remain identical. It has no metadata and is hash-pinned in the redaction recipe/test. Original WordPress bytes remain preserved privately; public URL containment is still a release gate. Gallery now contains six approved public photographs.

Release packaging includes the generated `.htaccess` in the build artifact explicitly; production Apache enforcement and historical bundle/HTML cache invalidation still require live proof.
