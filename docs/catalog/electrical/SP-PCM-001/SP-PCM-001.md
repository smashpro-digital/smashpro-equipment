# SP-PCM-001 — Power Control Module

**Catalog ID:** SP-PCM-001  
**Part Name:** Power Control Module  
**Builder / Integrator:** SmashPro  
**Product Family:** PCM — Power Control Module  
**Current Revision:** Rev A  
**Lifecycle:** Prototype / In Construction  
**Prototype Serial:** SP-PCM-001-A-P001  
**Installed On:** 2018 Ford F-150 3.5L EcoBoost  
**Development Project:** The Rebirth  
**System:** 12V battery isolation and primary positive power distribution  
**Catalog Standard:** `docs/catalog/SMASHPRO-PRODUCT-CATALOG-STANDARD.md`

> This document is the canonical engineering record for the SP-PCM-001 design. Values not physically verified or confirmed from manufacturer documentation remain marked TBD/To verify.

## 1. Product definition

SP-PCM-001 is a SmashPro-integrated 12V Power Control Module designed to combine remote/manual battery isolation, high-current positive distribution, local voltage monitoring, status indication, protected high-current cabling, and a serviceable vibration-isolated mounting platform.

Rev A is being developed first for a 2018 Ford F-150 3.5L EcoBoost under The Rebirth project. The design is being documented from the prototype forward so it can be reproduced, revised, serviced, or adapted into future vehicle-specific installation kits.

The initial prototype does **not** establish universal vehicle compatibility or a retail-ready product certification.

## 2. Design objectives

1. Provide a robust master battery isolation point.
2. Preserve manual operation at the disconnect device.
3. Provide remote electrical control capability.
4. Replace/relocate the positive distribution function required by the first vehicle installation.
5. Use high-current components appropriate to an automotive starting/power-distribution environment.
6. Maintain service access to the battery and module.
7. Protect positive conductors against accidental contact and abrasion.
8. Isolate the mounting panel from vehicle vibration.
9. Provide local voltage/status visibility.
10. Produce a documented assembly that can be reproduced without reverse-engineering Prototype P001.
11. Keep the core product identity separate from The Rebirth project and from any future vehicle-specific installation kit.

## 3. Electrical architecture

Planned Rev A high-current path:

```text
12V BATTERY POSITIVE
        |
        v
SAE POSITIVE TERMINAL ADAPTER
        |
        |  1/0 AWG OFC
        v
BLUE SEA ML-RBS 7700
REMOTE BATTERY SWITCH
        |
        |  1/0 AWG OFC
        v
600A POSITIVE BUS BAR
        |
        +---- OEM positive feed(s)
        +---- OEM main positive cable
        +---- reserved/future approved feed
```

Battery negative remains part of the vehicle's OEM negative/ground architecture for the initial installation.

Future accessory circuits should not be casually stacked onto the primary bus. A dedicated, appropriately fused accessory distribution subsystem should be used when expansion is required.

## 4. Major component specification

### 4.1 Master battery disconnect

**Component:** Blue Sea Systems ML-RBS 7700 Remote Battery Switch with Manual Control  
**Nominal control voltage:** 12V DC  
**Continuous rating:** 500A  
**Intermittent rating:** 700A  
**Cranking rating:** 2,500A for 10 seconds  
**Main terminal studs:** 3/8-16  
**Operation:** Magnetic-latching remote battery switch with manual control  
**Prototype status:** In hand / planned for Rev A

Manufacturer documentation remains authoritative for installation, terminal torque, control wiring, duty ratings, and operating limitations.

### 4.2 Positive distribution bus

**Component:** AMOMD high-current bus bar, prototype sourcing  
**Advertised continuous rating:** 600A  
**Nominal system range:** 12–48V DC, supplier-stated  
**Bus material:** Nickel-plated red copper, supplier-stated  
**Terminals:** 4 × 3/8-inch studs, supplier-stated  
**Cover:** Clear protective cover  
**Approximate listed dimensions:** 4.02 × 1.97 in  
**Prototype status:** Ordered for Rev A  
**Verification required:** Confirm markings, stud diameter/thread, construction, dimensions, and fit on receipt.

The 600A value is a component rating. It must not be represented as the completed module's certified current capacity.

### 4.3 Primary interconnect cable

**Planned conductor:** 1/0 AWG OFC copper battery/welding cable  
**Color:** Red preferred for positive conductors  
**Prototype cable ends:** Pre-terminated 3/8-inch ring lugs on purchased interconnects  
**Protection:** Heat shrink at terminations and protective loom where routing requires it  
**Final lengths:** TBD after physical mock-up

Any black-insulated conductor used in a positive circuit must be permanently identified as positive at both ends and at accessible intermediate points as appropriate.

### 4.4 Battery interface

**Type:** Replacement SAE positive top-post terminal adapter  
**Prototype source:** Recoil-style positive battery terminal adapter  
**Cable capability:** Supplier listing supports 1/0-class cable connection  
**Material:** Brass, supplier-stated  
**Final connection method:** To verify during physical assembly.

### 4.5 Mounting panel

**Material:** Black HDPE  
**Thickness:** 1/4 in  
**Prototype blank:** 8 × 12 in  
**Finished dimensions:** TBD after mock-up  
**Purpose:** Electrically insulating, corrosion-resistant mounting substrate for module components.

### 4.6 Vibration isolation

**Method:** Rubber vibration isolator mounts / standoffs  
**Quantity:** TBD based on final plate geometry  
**Final height and thread:** To verify from purchased hardware  
**Design intent:** Raise the panel from the vehicle mounting surface, reduce vibration transmission, allow airflow/drainage, and prevent panel rattle.

### 4.7 Voltage monitoring

**Component:** Panel-mount digital DC voltmeter  
**Display:** Local digital voltage indication  
**Planned sensing point:** Switched/load side of ML-RBS so display state corresponds with module output availability  
**Range/accuracy:** To verify from received component documentation/test  
**Final wiring/fusing:** TBD.

### 4.8 Status indication

**Component:** Green panel LED indicator  
**Planned function:** POWER CONNECTED / switched-output indication  
**Quantity installed:** One planned; extras retained as spares unless design changes  
**Electrical specification:** To verify before connection.

## 5. Prototype Rev A physical layout

Initial packaging concept:

```text
+------------------------------------------------+
| POWER CONTROL MODULE                           |
| SP-PCM-001                                     |
|                                                |
| [ ML-RBS 7700 ]          [ VOLTMETER ] [LED]  |
|                                                |
| [ 600A POSITIVE DISTRIBUTION BUS ]             |
|                                                |
+------------------------------------------------+
   O                                          O
 vibration-isolated mounting points / standoffs
```

Final component orientation must be established from the actual F-150 engine-bay mock-up. Cable bend radius and OEM harness reach take priority over visual symmetry.

The ML-RBS manual control must remain accessible after installation.

## 6. Initial vehicle installation

**Vehicle:** 2018 Ford F-150  
**Engine:** 3.5L EcoBoost  
**Project:** The Rebirth

Initial installation strategy:

1. Mount SP-PCM-001 adjacent to the battery on a removable HDPE panel.
2. Use existing vehicle structural/threaded mounting points wherever practical.
3. Avoid drilling until the area beneath any proposed hole is positively identified.
4. Maintain battery removal/service clearance.
5. Route the battery-positive feed through the ML-RBS before the new positive distribution bus.
6. Reconnect removable OEM positive eyelet feeds to the new bus where mechanically/electrically appropriate.
7. The one OEM positive cable presently integrated into the factory battery-terminal assembly may require cutting and a new heavy-duty ring lug.
8. Confirm the actual conductor gauge of that OEM cable before selecting/crimping its replacement lug.
9. Preserve maximum OEM cable length when modification becomes necessary.

No factory cable is to be cut until the module and bus are physically mocked in final position.

## 7. Control wiring

The ML-RBS low-current control circuit is separate from the primary high-current path.

Rev A control documentation must eventually define:

- Remote switch model and location
- Harness wire functions
- Control-circuit protection/fusing
- Ground/reference requirements
- Status/feedback circuit
- LED connection
- Voltmeter connection
- Firewall pass-through
- Loom and abrasion protection
- Connector/service disconnect strategy

**Status:** TBD pending final control design and verification against Blue Sea documentation.

## 8. Safety and operating constraints

1. Treat all exposed positive studs as battery-positive whenever connected upstream of an open isolation point.
2. Install protective covers/boots wherever required to prevent accidental short circuits.
3. Use properly rated cable, lugs, crimping tooling, and insulation.
4. Do not substitute CCA cable for the specified OFC primary interconnect without an engineering revision/review.
5. Verify polarity before energizing.
6. Do not switch the battery off with the engine running unless the completed charging-system architecture has been specifically validated for that operation. The initial operating rule is **engine OFF before disconnecting**.
7. Preserve access to the ML-RBS manual control.
8. Protect wiring from heat, sharp edges, moving components, and abrasion.
9. Do not publish an assembly-level amperage certification based only on individual component ratings.
10. Manufacturer installation requirements supersede assumptions in prototype notes.

## 9. Preliminary BOM

| Item | Qty | Component | Key specification | Rev A status |
| --- | ---: | --- | --- | --- |
| 1 | 1 | Blue Sea ML-RBS 7700 | 12V, 500A continuous, manual + remote | In hand |
| 2 | 1 | Positive bus bar | 600A advertised, 4 × 3/8 studs, covered | Ordered |
| 3 | 1 | Positive SAE battery terminal adapter | Brass, 1/0-capable | Ordered |
| 4 | 2 | Primary battery cables | 1/0 AWG OFC, 3/8 ring terminals | Ordered |
| 5 | 1 | HDPE mounting panel blank | Black, 1/4 in, 8 × 12 in | Ordered/planned |
| 6 | TBD | Rubber vibration isolators | Stand-off mounting | Ordered/planned |
| 7 | 1 | Digital voltmeter | Panel mount, DC | Ordered/planned |
| 8 | 1 | Green status LED | Panel mount | Ordered/planned |
| 9 | AR | Protective loom | Engine-bay wiring protection | Ordered/planned |
| 10 | AR | 1/0 copper ring lugs | 1/0 × 3/8 in | Planned/spares |
| 11 | AR | Adhesive-lined heat shrink | Sized to terminations | Planned |
| 12 | AR | Stainless mounting hardware | Final sizes TBD | Planned |
| 13 | TBD | Remote/control wiring hardware | Per final wiring design | TBD |

`AR` = as required.

A controlled BOM should be split into `BOM.md` after receipt inspection confirms manufacturer/model information and final quantities.

## 10. Fabrication plan — Prototype P001

### Stage 1 — Bench mock-up

- Receive and inspect all components.
- Confirm dimensions and terminal sizes.
- Lay out components on cardboard before cutting HDPE.
- Establish high-current cable routing and minimum practical bends.
- Confirm service access to ML-RBS manual control, voltmeter, LED, and bus cover.

### Stage 2 — Vehicle mock-up

- Place cardboard/uncut panel in proposed F-150 location.
- Verify hood, battery, airbox/fuse-area, harness, and service clearances.
- Verify OEM positive cable reach.
- Identify existing Ford mounting points.
- Determine isolator/standoff locations.

### Stage 3 — Panel fabrication

- Transfer approved template to 1/4-in HDPE.
- Cut finished outline.
- Drill component and vehicle-interface mounting holes.
- Deburr/finish edges.
- Add cable pass-through protection where applicable.
- Fit vibration isolators.

### Stage 4 — Electrical assembly

- Mount ML-RBS and bus.
- Install high-current interconnects.
- Protect/identify positive conductors.
- Modify the OEM cable only after its conductor size and final termination are confirmed.
- Complete low-current control/indicator wiring to the verified diagram.

### Stage 5 — Inspection and test

- Perform continuity/polarity checks before battery connection.
- Inspect all covers, terminations, cable routing, and fasteners.
- Establish baseline battery voltage.
- Energize and verify switched output.
- Verify manual ML-RBS operation.
- Verify remote operation.
- Verify voltmeter/status indication.
- Verify vehicle crank/start behavior when appropriate to The Rebirth repair status.
- Measure voltage drop across the completed high-current path during a meaningful load test when safely possible.
- Inspect for abnormal heating after load testing.

## 11. Prototype acceptance criteria

Prototype P001 should not advance beyond `Prototype / Testing` until the following are documented:

- [ ] All received component identities/specs verified.
- [ ] Final HDPE dimensions recorded.
- [ ] Mounting-hole pattern recorded.
- [ ] Final cable lengths recorded.
- [ ] OEM cable conductor size verified.
- [ ] All lug sizes recorded.
- [ ] Final wiring diagram completed.
- [ ] Control circuit protection documented.
- [ ] Manual disconnect test passed.
- [ ] Remote disconnect/connect test passed.
- [ ] Voltage indication verified against a trusted meter.
- [ ] Polarity verified.
- [ ] Vehicle starting/current-path test completed when vehicle condition permits.
- [ ] Voltage-drop test recorded.
- [ ] Post-load thermal inspection completed.
- [ ] Battery remains serviceable/removable.
- [ ] Protective covers/boots installed.
- [ ] As-built photographs captured.
- [ ] Physical data plate installed.
- [ ] Prototype serial permanently associated with the unit.

## 12. Physical identity / data plate

Preferred prototype plate content:

```text
POWER CONTROL MODULE
SP-PCM-001 • REV A
SERIAL: SP-PCM-001-A-P001
12V DC
BUILDER: SMASHPRO
```

`2018 FORD F-150` may appear on an installation label or prototype plate, but the core product identity should remain portable to future validated applications.

The Rev A `SMASH_F150xLT / POWER CONTROL MODULE` acrylic artwork is controlled as the **custom battery box plate for the 2018 F-150 Project Rebirth build** under `drawings/nameplates/rev-a/`. It remains in Design Review and is not the canonical SP-PCM-001 product data plate because it does not carry the required catalog ID, revision, serial, voltage, builder, and applicable safety markings.

Custom plates are planned to become a configurable option for other compatible battery box builds. Personalization is limited to approved application text, branding text, and accent treatments; required product identity, electrical, safety, and regulatory markings remain controlled separately. The current F-150 XLT artwork belongs specifically to the 2018 F-150 build and is not a universal template.

A future QR code may resolve to a stable SmashPro product/serial record.

## 13. Reproducibility record

Before a second unit is built, record the following from P001:

| Attribute | As-built value |
| --- | --- |
| Panel overall length | TBD |
| Panel overall width | TBD |
| Panel thickness | 1/4 in |
| Panel material | Black HDPE |
| ML-RBS mounting-hole coordinates | TBD |
| Bus mounting-hole coordinates | TBD |
| Voltmeter cutout | TBD |
| LED cutout | TBD |
| Vehicle mounting coordinates | TBD |
| Standoff height | TBD |
| Battery-to-ML-RBS cable length | TBD |
| ML-RBS-to-bus cable length | TBD |
| OEM modified cable gauge | TBD |
| OEM replacement lug | TBD |
| Primary cable lug hole | 3/8 in planned |
| Finished module weight | TBD |

This table becomes the seed for production drawings and assembly fixtures/templates.

## 14. Vehicle-specific installation-kit opportunity

If the Rev A module proves successful, the 2018 F-150 interface should be evaluated as a separate installation kit rather than permanently embedding all F-150 geometry into SP-PCM-001.

A future kit could include:

- Vehicle-specific mounting bracket/plate geometry
- Standoffs and hardware
- Pre-cut cable lengths
- Required OEM-cable termination
- Harness/loom lengths
- Firewall routing instructions
- Installation label
- Vehicle-specific QC checklist

A separate installation-kit ID should be assigned only after the interface is validated and the catalog naming standard is extended for installation kits.

## 15. Future product evolution

Potential later revisions/options may include:

- Dedicated fused accessory distribution
- Standardized remote-switch panel
- Weather-resistant connectors for control harness
- NOCO/maintenance charging connection
- External service/jump posts
- Current sensing
- SPgO telemetry/service integration
- QR-linked digital service record
- CNC/laser-cut production mounting plate
- Purpose-built enclosure

These are roadmap concepts, not Rev A requirements.

## 16. Retail/manufacturing readiness gate

SP-PCM-001 is currently a prototype integration. Before offering reproduced units for sale, SmashPro should review at minimum:

- Application-specific electrical safety
- Automotive environmental suitability of all components
- Cable ampacity and temperature assumptions
- Short-circuit protection strategy
- Installation instructions and warnings
- Product liability implications
- Required labels
- Applicable regulatory/compliance requirements
- Repeatable crimp/assembly tooling and process
- Supplier consistency and
