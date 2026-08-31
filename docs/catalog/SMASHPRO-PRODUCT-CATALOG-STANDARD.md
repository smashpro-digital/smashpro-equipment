# SmashPro Product Catalog Standard

**Document:** SMASHPRO-PRODUCT-CATALOG-STANDARD  
**Owner:** SmashPro  
**Status:** Active foundation / evolving standard  
**Initial revision:** A  
**Established:** 2026-08-31

## 1. Purpose

This document establishes the canonical engineering catalog for SmashPro-designed, integrated, configured, or reproducible equipment and components.

The catalog exists so a successful one-off build can become a repeatable product without reverse-engineering the original unit. It is intended to support internal fabrication, future retail products, replacement parts, installation kits, service documentation, quality control, sourcing, warranty/service history, and eventual integration with SmashPro/SPgO digital systems.

The catalog is deliberately separate from the SmashPro Fleet registry.

- A **catalog ID** identifies a design/product definition.
- A **revision** identifies a controlled version of that design.
- A **serial number** identifies one physical unit produced from the design.
- A **fleet ID** identifies a particular SmashPro fleet asset.
- A **project name** identifies the project/program in which a part may be developed or installed.

A catalog product may exist without being a fleet asset. A fleet asset may contain multiple catalog products.

## 2. Canonical source of truth

The `smashpro-equipment` repository is the engineering/product source of truth for cataloged SmashPro equipment and components.

Project records, fleet passports, SPgO records, public product pages, QR records, and installation/service records should reference the canonical catalog ID rather than create competing part identities.

## 3. Catalog scope

Eligible catalog items include:

1. SmashPro-designed components and subassemblies.
2. SmashPro-integrated assemblies built from third-party components.
3. Vehicle/equipment installation kits.
4. Attachments and accessories developed to a repeatable specification.
5. SmashPro-configured OEM equipment intended to become a standardized product offering.
6. Replacement/service parts requiring controlled compatibility.
7. Electrical, hydraulic, mechanical, structural, control, and enclosure assemblies.

Examples include the SP-PCM-001 Power Control Module and a future SmashPro retail configuration derived from an OEM YF380 mini skid platform.

## 4. Identification hierarchy

### 4.1 Product/part ID

Format:

`SP-[FAMILY]-[NNN]`

Example:

`SP-PCM-001`

Where:

- `SP` = SmashPro catalog namespace.
- `FAMILY` = controlled functional family code.
- `NNN` = sequential design number within that family.

The part ID identifies the design and remains stable across compatible production units.

### 4.2 Revision

Use alphabetic engineering revisions beginning with `A`.

Examples: `Rev A`, `Rev B`, `Rev C`.

A revision changes when the controlled design changes in a way that affects fit, form, function, safety, manufacturing, service, wiring, BOM, or installation compatibility.

Minor documentation corrections that do not alter the product may be tracked in Git without necessarily advancing the product revision. The revision log must explain every product-revision change.

### 4.3 Prototype serials

Prototype physical units use:

`[PART-ID]-[REV]-P[NNN]`

Example:

`SP-PCM-001-A-P001`

`P001` is the first physical prototype of Rev A.

### 4.4 Production serials

Future production units use:

`[PART-ID]-[REV]-[NNNN]`

Example:

`SP-PCM-001-A-0001`

Serial numbers are never reused, even if a unit is scrapped, returned, rebuilt, or replaced.

### 4.5 Fleet IDs remain separate

Fleet IDs such as `SP-ARDHI-26` identify individual SmashPro fleet assets and must not be repurposed as retail product/model IDs.

A future retail machine based on an OEM YF380 platform should receive a catalog/model identity separate from the fleet identity of SmashPro's own machine.

## 5. Product family codes

Family codes should be short, durable, and based on function rather than a temporary project name.

Initial family:

| Code | Family | Example |
| --- | --- | --- |
| PCM | Power Control Module | SP-PCM-001 |

New family codes should be added here before first use to prevent collisions and naming drift.

## 6. Required catalog record

Every catalog item must have a primary Markdown record containing, at minimum:

- Part ID
- Part name
- Builder/integrator
- Product family
- Current revision
- Lifecycle status
- Product purpose
- Intended application
- First known installation/application, when applicable
- Development project, when applicable
- Electrical/mechanical/hydraulic ratings as applicable
- Major component specifications
- Materials
- Dimensions and weight once verified
- Interface/connection specifications
- BOM status
- Drawing status
- Assembly procedure status
- QC/test requirements
- Safety notes
- Installation constraints
- Serviceability requirements
- Compatibility information
- Revision history
- Prototype/serial records
- Open engineering items

Unknown values must be marked `TBD`, `To verify`, or `Not applicable`. Do not convert estimates into verified specifications.

## 7. Recommended catalog directory

```text
docs/catalog/
├── SMASHPRO-PRODUCT-CATALOG-STANDARD.md
├── README.md                         # optional future catalog index
├── electrical/
│   └── SP-PCM-001/
│       ├── SP-PCM-001.md             # master product record
│       ├── BOM.md                    # controlled bill of materials
│       ├── ASSEMBLY.md               # reproducible assembly procedure
│       ├── QC.md                     # acceptance/test procedure
│       ├── REVISION.md               # detailed engineering changes
│       ├── drawings/
│       ├── wiring/
│       ├── installation-kits/
│       └── evidence/
├── machines/
├── attachments/
└── installation-kits/
```

A product may begin with only the master record. Supporting documents should be split out as the prototype matures.

## 8. Product lifecycle

Recommended lifecycle values:

- `Concept`
- `Prototype / In Construction`
- `Prototype / Testing`
- `Engineering Validation`
- `Pre-Production`
- `Production`
- `Service Only`
- `Retired`

Moving a design toward retail/production requires more than changing the status label. Safety, regulatory, liability, manufacturing consistency, labeling, instructions, sourcing, QC, and warranty/service requirements must be reviewed for the applicable product class.

## 9. BOM requirements

The controlled BOM should eventually record:

- Item number
- Quantity
- Manufacturer
- Manufacturer part/model number
- SmashPro part number where applicable
- Description
- Critical specification
- Approved substitute(s)
- Supplier/source
- Unit cost and date when useful
- Lead time when useful
- Revision applicability
- Safety/critical-item flag
- Verification status

Retail links may be retained as sourcing evidence but should not be the sole component identity. Seller listings can disappear; manufacturer/model/specification data should be preserved.

## 10. Drawings and dimensions

A reproducible design should eventually include:

- Overall dimensions
- Mounting-hole centers
- Hole diameters
- Material thickness
- Bend/clearance requirements
- Cable/hose lengths
- Connector/lug sizes
- Fastener specifications
- Orientation
- Required service clearances
- Vehicle/equipment interface dimensions

Prototype dimensions should be measured from the completed physical unit and marked as-built before being promoted to production drawings.

## 11. Assembly documentation

Assembly documentation should allow a competent builder to reproduce the unit without relying on memory or build photographs alone.

Capture:

1. Required tools.
2. Preparation and fabrication sequence.
3. Component orientation.
4. Fasteners and locking methods.
5. Manufacturer torque specifications where available.
6. Cable/hose preparation and termination methods.
7. Routing and abrasion protection.
8. Labeling.
9. Inspection points.
10. Final functional test.

Never invent torque values. If no verified torque specification exists, mark it for engineering verification.

## 12. Quality control

Each reproducible product should have a QC/acceptance procedure appropriate to its risk.

Typical checks include:

- Part/revision identity verified.
- Correct BOM components installed.
- Fasteners secured.
- Cable/hose routing inspected.
- No exposed energized conductors where protection is required.
- Polarity/continuity checks.
- Voltage-drop or pressure/leak testing where applicable.
- Functional operation.
- Manual/emergency operation.
- Label and serial verification.
- Installation clearance.
- Photographic as-built record.

QC results should be associated with the individual serial number, not only the product design.

## 13. Installation kits

Vehicle/equipment-specific interfaces should be separated from the universal product whenever practical.

Example:

- `SP-PCM-001` = Power Control Module design.
- A future F-150-specific installation kit = brackets, cable lengths, mounting pattern, hardware, and instructions required to install that design on the supported F-150 application.

This prevents a product from being called universal merely because its core function is broadly applicable.

## 14. Labels and data plates

A physical cataloged product should eventually carry a durable label/data plate appropriate to its environment.

Minimum preferred identity:

```text
POWER CONTROL MODULE
SP-PCM-001 • REV A
SERIAL: SP-PCM-001-A-P001
BUILDER: SMASHPRO
```

Add voltage, ratings, warnings, compatibility, certification information, and other required markings only when accurate and applicable.

Do not imply third-party certification or regulatory approval that has not been obtained.

## 15. QR/digital identity

The serial/data plate may eventually include a QR code resolving to the product or serialized unit record.

Potential digital record contents:

- Current product specification
- Serial number
- Revision
- BOM
- Wiring/drawings
- Installation instructions
- Installed-on asset
- Build/QC date
- Service history
- Safety notices
- Superseding revisions

QR destinations should use stable SmashPro-controlled URLs.

## 16. Product vs. installation record

The master catalog describes what the product **is**.

An installation record describes where a particular serialized unit **is installed**.

Example:

- Product: `SP-PCM-001`, Power Control Module.
- Serial: `SP-PCM-001-A-P001`.
- Installed on: `2018 Ford F-150 3.5L EcoBoost`.
- Development project: `The Rebirth`.

The Rebirth project should reference the product/serial record instead of becoming the canonical owner of the product design.

## 17. OEM-platform retail products

SmashPro may later define standardized retail configurations based on OEM machines such as the YF380 platform.

For such products, preserve the distinction between:

- OEM manufacturer/platform/model
- SmashPro configuration/model
- SmashPro-installed components/upgrades
- Regulatory manufacturer-of-record information
- Individual serial number
- Fleet ownership, if SmashPro owns one example

A SmashPro retail identity must never erase or misrepresent legally required OEM/manufacturer identification.

## 18. Evidence and verification

Every important specification should be traceable to one of:

- Manufacturer documentation
- Supplier documentation
- Purchase record
- Physical measurement
- Engineering calculation
- Test result
- As-built inspection

Use explicit labels such as `Verified`, `Supplier-stated`, `Measured`, `Planned`, and `TBD` where useful.

## 19. Change control

Before changing a production-capable catalog item, determine whether the change affects:

- Safety
- Fit
- Form
- Function
- Compatibility
- BOM
- Installation
- Service procedure
- QC/test procedure
- Required labeling

If yes, evaluate a revision increment and document the reason, effective serial range, and compatibility with earlier units.

Never silently rewrite historical as-built records to match a newer design.

## 20. Future system integration

The catalog should be designed so structured metadata can later feed SmashPro/SPgO systems without replacing the human-readable engineering record.

Likely future entities:

- Product definitions
- Revisions
- BOMs
- Serial units
- Fleet assets
- Installations
- QC inspections
- Service events
- Attachments/accessories
- Supplier/OEM records

Git remains the revision-controlled engineering source; operational applications can consume or reference it.

## 21. First catalog item

`SP-PCM-001 — Power Control Module` is the first item established under this standard.

Its initial Rev A prototype is being developed for installation on a 2018 Ford F-150 3.5L EcoBoost as part of The Rebirth project.
