export const ardhiVerifiedVoyage = {
  checkedAt: "2026-10-01T14:19:00Z",
  vesselName: "EVER MAX",
  voyageReference: "1374-016E",
  summary: "Verified vessel progress through Colón, Panama. Savannah is the next scheduled vessel call. This is voyage context only and does not prove cargo discharge, customs clearance, release, or delivery.",
  stages: [
    "Factory / export history",
    "Yantian departure · vessel observed",
    "Trans-Pacific leg · completed",
    "Panama Pacific anchorage · departed",
    "Colón, Panama · vessel arrival observed",
    "Savannah call · vessel schedule context",
    "Inland delivery · cargo status pending",
  ],
  currentCheckpoint: "Colón, Panama",
  nextCheckpoint: "Savannah, Georgia",
  sources: [
    { label: "VesselFinder", url: "https://www.vesselfinder.com/vessels/details/9935208" },
    { label: "Flexport Atlas", url: "https://atlas.flexport.com/vessel/imo%3A9935208/mmsi%3A563190500/name%3Aever-max" },
  ],
} as const;
