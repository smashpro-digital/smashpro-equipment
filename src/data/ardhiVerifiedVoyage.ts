export const ardhiVerifiedVoyage = {
  checkedAt: "2026-10-06T13:43:00Z",
  vesselName: "EVER MAX",
  voyageReference: "1374-016E",
  summary: "Verified vessel progress through Savannah anchorage. This is vessel context only and does not prove SP-ARDHI-26 cargo discharge, U.S. customs clearance, release, or delivery.",
  stages: [
    "Factory / export history",
    "Yantian departure · vessel observed",
    "Trans-Pacific leg · completed",
    "Panama Pacific anchorage · departed",
    "Colón, Panama · vessel arrival observed",
    "Colón, Panama · vessel departed",
    "Savannah anchorage · vessel arrival observed",
    "Cargo discharge / customs / inland delivery · pending",
  ],
  currentCheckpoint: "Savannah anchorage",
  nextCheckpoint: "Cargo discharge / customs / inland delivery",
  sources: [
    { label: "VesselFinder", url: "https://www.vesselfinder.com/vessels/details/9935208" },
    { label: "Flexport Atlas", url: "https://atlas.flexport.com/vessel/imo%3A9935208/mmsi%3A563190500/name%3Aever-max" },
  ],
} as const;
