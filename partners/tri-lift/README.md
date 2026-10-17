# Tri-Lift Industries local partner record

Local Partners preserve the working relationship separately from any one
machine, transaction or completed job. `partner-tri-lift` is the reusable
identity for many asset projects. Do not create another partner for each
rental or delivery.

## Records and evidence

- **Partner:** company identity, service categories and relationship context.
- **Procurement:** inquiries, proposals, forms, insurance requirements and
  decisions. A received document does not imply approval.
- **Rental:** a specifically accepted equipment rental, with agreed scope,
  dates, price and responsibilities. The current quote is not a booking.
- **Completed Service:** dated evidence of work actually performed. Only then
  can a pending asset association be reviewed for public Passport display.

Keep all quote revisions. Append a new quote object with a unique archive ID
and `supersedes` reference; never replace an earlier quote or original file.
Unknown dates and terms stay `null`. Keep received/imported dates separate
from the dates of business events. Do not infer insurance verification from
the COI request or operator inclusion from a forklift rental.

`company-profile/`, `quotes/`, `forms/`, `insurance/`, `communications/`,
`photos/`, `service-records/` and `archive/` organize source material.
Payment instructions are retained under `archive/payment-references/`.
Original filenames and bytes are preserved. `documents.json` maps each file
to its SHA-256 and original source-relative path. No existing fleet
procurement documents are replaced.

## Privacy and preview

This GitHub repository is public. Original PDFs, their thumbnails, private
quote values and pending asset-project associations are git-ignored. They
must not be force-added, put in `public/`, or published as build artifacts.
The committed JSON and screenshots are sanitized. Local originals are not
backed up by Git: retain the Downloads source until a private archive is
chosen. The README/manifest is not a substitute for that backup.

The page is an internal-workspace prototype, excluded from the public Vite
entry points. It is not an authenticated Digital HQ deployment. A robots
directive is not access control. Do not upload this directory to production.
Real Digital HQ integration requires authenticated document delivery and
canonical procurement ownership in that repository.

From this repository, run `python scripts/preview-local-partners.py`, then
open `http://127.0.0.1:4179/partners/tri-lift/`. The default preview shows
sanitized records. `?internal=1` enables local document and pending-project
review; this mode is restricted to loopback and is never used for PR images.
Imported originals and first-page previews are linked only in that mode.

## One partner, many projects

Project records reference `partner_id`, `asset_id`, `purpose`, `status`,
`completed_at`, evidence and `public_display`. Pending asset associations
live in `projects.private.json`. `projects.json` is the reviewed, publishable
subset and starts empty. A completed timestamp alone is not publication
approval: require completion evidence and an explicit public-display review.
The existing public ARDHI Passport remains unchanged.

Add genuine emails, notes or phone-call records to `communications.json`
(or a private companion for sensitive content), with date, summary and
document IDs. No email or call files were present in this import.

## Import and checks

`python scripts/import-tri-lift.py "C:\path\to\Tri-Lift Industries"`
imports every source file recursively, refuses conflicting overwrites,
and renders local PDF thumbnails with Poppler (`pdftoppm`). An identical
repeat import is safe. Changed bytes with the same destination filename
require a new revision subfolder and manifest entry; never overwrite.

Run `node --test tests/local-partners.test.mjs` for schema, privacy and
reference checks. Run `python scripts/import-tri-lift.py --verify` locally
to verify every original and thumbnail against the manifest. Public CI
cannot verify private bytes; it verifies the sanitized contract instead.
