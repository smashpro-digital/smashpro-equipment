# NYASI public Passport and identity integration audit

Date: 2026-10-14. Branch: feat/nyasi-passport-experience-20261014.
Scope: public React/Vite presentation plus identity design. No database, authentication, WordPress, SPGo or Digital HQ changes. No merge/deployment authorized.

## Public experience and canonical sources

- The physical `/equipment/sp-nyasi-26.html` route remains public, now composed by `NyasiPassportPage`, `NyasiPassport` and reusable Passport experience components. ARDHI/MZIGO protected pages, data and fixtures remain unchanged.
- Equipment identity/specifications/status: `nyasiEquipment.ts`, a sanitized projection of Digital HQ procurement record `docs/equipment-procurement/SP-NYASI-26-lm500.md`. The full financial authority stays in HQ.
- Factory photos/provenance/rotation: `nyasiFactoryMedia.ts` and the existing gallery. Three photos, native accessible dialogs, no original-file links. The portrait supplier video stays archived and is never rendered.
- Lifecycle: `nyasiLifecycle`; the ten-stage public overview derives statuses and dated history from existing records. All other evidence remains in expandable records. Future dates are not invented.
- Editorial/capability/inquiry/commissioning content: `nyasiExperience.ts`. Purchased configuration, supplier-stated functions and pending commissioning are distinct. No field validation or availability is inferred.
- Existing approved promotional hero and showroom artwork preserved. These are identity artwork, not factory evidence.
- Related ARDHI/MZIGO cards reuse `FleetEquipmentCard` and canonical collection destinations. UMBA is not field fleet.

## Pricing duplication resolved at source

Previously the hero status, lifecycle counters, work-package prices, payment cards, evidence slots and timeline repeated commercial amounts. Those panels have been removed; currency amounts have also been removed from NYASI's public equipment data. The amendment supersedes the earlier proposal to show a collapsed public acquisition-price section. No hidden financial DOM or client-side authorization is used. Private procurement must be supplied only by a future authorized HQ endpoint; this sprint adds none. Internal records are untouched. Historical repository documents are not treated as public API payloads.

## Video and media behavior

`EquipmentWatch` accepts equipment-specific public YouTube entries with publication and verification dates. It rejects invalid IDs, other equipment, private and future/unverified entries. It has one selected video, thumbnail selection, direct YouTube fallback and a click-to-load `youtube-nocookie.com` iframe. No autoplay, no initial iframe and no extra API dependency. Thumbnails are lazy. Categories appear only as metadata on actual entries.

The current public SmashPro Media inventory was inspected; its published entries were Garage and other projects, not verified NYASI footage. No NYASI ID was invented. `nyasiVideos` is intentionally empty and Watch NYASI links to the existing official `@SmashProHQ` channel. Supplier portrait footage remains off the page. Actual YouTube playback of NYASI requires a real verified publication and is not claimed tested.

## Customer and partnership conversion

Live GET checks: `/book/`, `/request-quote/`, `/contact/`, `/media/` return 200 anonymously. The existing estimate builder carries only equipment attribution (`equipment_source`, `equipment_required`), `utm_content=nyasi-passport` and the originating public page. No customer ID or personal information goes in a URL.

The public catalog currently exposes Lawn Care but no verified NYASI-specific service. Do not invent a service slug or promise automatic equipment selection: the canonical intake reconciles equipment against the selected service. Visible instructions ask the visitor to mention SP-NYASI-26 and remote mowing/property maintenance, property size, vegetation, terrain, access and timing. The existing workflow supports photos, contact/location and project description; video upload is not supported. Inquiry-only status is explicit. The anonymous visitor can begin without login; the existing submission flow may require contact verification. No new lead database or fake submissions were created.

The Media page has an existing brand partnership form. NYASI is not a project option yet, so the CTA opens that workflow and asks visitors to include the equipment and source in the message. No unsupported prefill parameters, partnership approval, guaranteed reach or private supplier contacts are introduced.

## Identity integration map (source audit, not universal SSO proof)

| Surface | Inspected implementation | Identity and boundary |
| --- | --- | --- |
| Public Equipment | Vite static HTML + React | No session needed; no private API dependency. Public experience survives API failure. |
| WordPress website accounts | WordPress login; local identity reconciliation documentation | WP accounts remain website identities. Login alone must not imply an operational customer, tech or administrator entitlement. |
| Website quote/intake | WordPress `inc/customer-intake.php`, `assets/js/intake.js`, platform SDK auth provider | Existing same-origin BFF uses sealed `__Host-smashpro_intake_session`, HttpOnly session mediation, CSRF/origin checks and backend customer verification. Backend resolves identity; selected service constrains equipment context. |
| SmashPro Home/customer services | Existing platform SDK and intake bridge | Operational customer identity is canonical in application records; browser never receives the bridged bearer token. Saved customer context belongs in the existing intake, not a public URL. |
| Customer portal | WP `partials/customer-portal.php`, `inc/platform-sdk/auth-service.php` | Provider abstraction defaults to unauthenticated. Portal source still describes shared handoff as pending. A functioning intake session is not proof every portal module is connected. |
| SPGo | `api/includes/smashpro_auth.php`, `smashpro_identity.php` | Hashed access/refresh platform sessions, canonical `spd_users`, explicit linked profiles, capability grants/denials and scoped contractor context. This is not a WordPress cookie session. |
| Digital HQ | remote-main `dashboard/api/auth.php`, `_customer_job_portal.php` | Separate dashboard session and explicit customer-safe projection. No evidence that WP login alone authorizes HQ procurement. Do not reuse dashboard auth as a public SSO broker. |

Evidence qualification: WordPress and SPGo checkouts contain work outside this sprint; source observations are not deployment claims. WordPress intake session/no-store behavior was cross-checked against tracked HEAD and a live anonymous bootstrap. Older shared-auth readiness docs say the cookie provider was unimplemented; current source contains it, so those docs are stale for intake. The broader shared-identity architecture remains unproven. No account credentials, customer records or private invoices were accessed.

Live anonymous `/wp-json/smashpro/v1/intake/bootstrap` returned `authenticated:false`, `customer:null`, `session_status:anonymous` and `Cache-Control: no-store, private`. `/wp-login.php` returned 200. A guessed `/dashboard/api/auth.php` public path returned 404, which is not authentication-denial evidence. No live cross-user authorization result is claimed.

## Proposed capability and private API boundary (follow-up, not enabled)

Reuse platform capability resolution rather than adding a competing WordPress role-name system. Source defines `equipment.manage`, `fleet.manage`, `jobs.view.self`, `jobs.view.all`, `customer.view`, `customer.edit` and `admin.portal`; explicit per-user denies override grants. The customer role itself grants no blanket private access. Contractor documentation references `spgo_contractor` and immutable contractor UUID linkage; production grants were not audited.

| Audience | Proposed enforcement |
| --- | --- |
| Anonymous | Public allowlisted projection; no public-view login requirement or redundant capability. |
| Customer | Existing verified customer session + ownership for every quote, property, document, invoice and job. Never trust a client customer ID. |
| Tech | Existing `jobs.view.self` plus actual assignment and equipment scope; no procurement through technician access. |
| Partner | Explicit project membership/grant, deny by default; partnership inquiry does not create an entitlement. |
| Admin/fleet manager | Reuse `equipment.manage` where applicable. A distinct least-privilege procurement-read policy requires backend review; `admin.portal` or a WP role name alone is insufficient. |

Extend an established customer/equipment backend only after confirming deployed endpoint ownership and capability registry. Server derives actor from its validated session; each request checks capability AND object scope. Private responses must use `Cache-Control: private, no-store` and bypass shared caches; cookies Secure/HttpOnly, correct SameSite; mutations need CSRF/origin checks and sensitive operations need audit logging. Do not serialize private records into static JS, HTML, JSON, source maps or client stores.

A future optional context request should return only allowlisted action availability/authorized routes, without tokens or arbitrary customer IDs. On 401/403, expired session, timeout or outage, show the normal public CTAs. Do not replace the public page. Customer-specific records require separate ownership-scoped calls. No such private enhancement is advertised as implemented here.

## Phased implementation plan

1. This PR: public experience, no public NYASI pricing, existing safe inquiry links, evidence galleries, commissioning pending state, identity map and tests.
2. Reconcile canonical identity and deployed capabilities with the platform owners. Confirm explicit WP-to-application links and resolve conflicts; no email-only automatic quote claiming. Audit the HQ auth source's localhost-origin bypass before selecting any broker path; do not deploy or extend it as an SSO mechanism.
3. Reuse approved server-mediated identity where possible; if a broker is needed, design OAuth/OIDC authorization code + PKCE, audience/issuer checks, one-time replay protection, expiry/revocation and audited explicit account linking. No shared-cookie invention or token URLs.
4. Implement minimal optional customer context on top of the existing session boundary. Support saved property context/quote continuity only after verified ownership or an authenticated claim process; preserve original attribution and history.
5. Add scoped tech/partner/admin panels separately. Procurements stay canonical in HQ and require an approved procurement permission. Prepare two-customer, tech, partner, admin, expired/revoked and anonymous fixtures; test object-level denial, CSRF, cache isolation and outage behavior before rollout.

## Validation and limitations

All 146 automated tests passed after the final compact-journey refinement. TypeScript, production build, public index/privacy checks and protected ARDHI artifact checks passed. Browser gallery checks passed at 360/375/390/412/430/1440 and ARDHI at 360/390/1440. Final experience coverage passed at all six widths for compact journey links, accordion behavior, anonymous API failure and existing routes. The YouTube player passed isolated mocked-provider browser tests for click-to-load, selection reset, one iframe, privacy host and mobile sizing; this is not real NYASI playback verification.

No authentication migration or capability creation was performed. Cross-customer denial, authenticated quote restoration, customer portal records and private procurement rejection require authorized fixtures and the correct deployed API contract; they are not established by a 200 page response. Live WordPress login rendering is verified, not a credential login. Quote submission/OTP and partnership sending were not exercised. Existing public site may still contain historical pricing until an approved release replaces those assets and cache handling is verified.

## Local review captures

- [Desktop hero](nyasi-experience-2026-10-14/hero-1440.png)
- [Mobile hero](nyasi-experience-2026-10-14/hero-390.png)
- [Desktop factory evidence](nyasi-experience-2026-10-14/evidence-1440.png)
- [Mobile technical record](nyasi-experience-2026-10-14/technical-390.png)
- [Browser results](nyasi-experience-2026-10-14/validation.json)

These are local production-build captures, not a deployed release. Earlier before-captures remain local because they display the superseded commercial panels.
