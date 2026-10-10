# Tri-Lift partner record validation

Validated October 9, 2026, against base `1a50b88`.

- All four source files copied without changing filenames or bytes; SHA-256
  and byte lengths match `partners/tri-lift/documents.json`.
- Quote, application, COI request and payment reference are classified in
  their respective folders. Downloads originals remain intact.
- Four first-page PDF thumbnails generated locally. Quote, application and
  COI request visually inspected; the application is blank and the COI file
  is a request, not verified insurance.
- Repeat import preserves the same manifest and refuses conflicting copies.
- Four local-partner tests pass, covering references, pending states,
  commercial-data exclusion and Git privacy boundaries.
- Browser checks pass at 320, 390, 768 and 1440 px: no horizontal overflow,
  section anchors resolve, and timeline details expand/collapse.
- In local private mode, all four PDF links return HTTP 200 with source SHA-256
  matches; all four PNG previews return HTTP 200. Pending project and private
  quote values render. Default mode requests none of those private resources.
- Public build and typecheck pass. Equipment index, MZIGO media and Passport
  artifact validation pass. The generated public build contains no partner
  workspace, partner records, private PDFs or private project association.
- No public Passport source or production deployment workflow changed.

The screenshots are sanitized. They intentionally omit private document
previews, commercial values and pending asset associations.

| Desktop | Mobile |
| --- | --- |
| [Overview](screenshots/tri-lift-1440-overview.png) | [Overview](screenshots/tri-lift-390-overview.png) |
| [Full page](screenshots/tri-lift-1440.png) | [Full page](screenshots/tri-lift-390.png) |

## Storage boundary

The GitHub repository is public. The four originals, previews and private
companion JSON files are retained locally and excluded from Git. A fresh
clone contains the sanitized record and import tool, not the originals.
Private archival storage and authenticated Digital HQ publication remain
separate decisions; no production page has been deployed.
