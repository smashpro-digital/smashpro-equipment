# MZIGO shared passport composition

## Root cause audit before editing

Baseline: main at 3ba2df9. ARDHI's EquipmentPassportPage branch returns ArdhiPassportJourney, which owns the documentary hero, large headline, lifecycle line and four asset destinations. MZIGO still uses the generic page's long section composition. Its dedicated MzigoPassportHeader replaced the legacy hero with a compact identity/status block followed by a contained illustration; it does not use ARDHI's hero shell. Earlier CSS work aligned the summary and evidence records, but not this primary composition. That is the confirmed remaining visual divergence.

The new brief explicitly chooses real September 9 factory media for the hero, superseding the earlier request to place supplied artwork there. Keep that artwork file, all factory evidence, the five dated chapters and the canonical lifecycle data. Share the working ARDHI hero structure rather than duplicate its CSS or introduce DOM replacement.

## Implementation and acceptance

Both assets now render through PassportHero, retaining ARDHI's established DOM classes and CSS. MZIGO adds scoped typography, overlay and responsive crop rules, with the September 9 three-quarter photograph and an asset navigation strip. Passport, Journey, History and Service resolve to real sections. The service section consumes existing serviceHistory records and otherwise identifies the pre-commissioning state without inventing service events.

MZIGO retains its K600 identity, three-field summary, pre-shipment verification status, five evidence chapters, all original media and inline walkaround video. ARDHI retains its existing headline, image, navigation, lifecycle and history.

Local validation: npm ci, typecheck, 50 tests, build, validate:index and git diff --check passed. Browser checks passed at 360, 390, 412, 430 and 1600 px, including image completion, overflow, three summary columns, all four navigation targets, evidence expansion and video metadata. Playback advanced at 390 px. Canonical and featured-fleet UTM content matched. ARDHI was checked at 390 and 1600 px with all 55 history records retained.

Visual acceptance: yes, MZIGO now belongs to the same passport design system. Desktop uses the documentary image and large industrial headline; mobile separates the visible machine crop from readable copy with a gradient and compact four-column navigation. ARDHI's presentation remains visually consistent with its original composition.
