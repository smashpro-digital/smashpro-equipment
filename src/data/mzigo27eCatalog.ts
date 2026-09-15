import { equipmentImage } from "../lib/equipmentAssets";

export const mzigo27eCatalog = {
  id: "SP-MZIGO-27E",
  name: "Electric Material Carrier",
  status: "Future catalog concept",
  hero: {
    src: equipmentImage("sp-mzigo-27e-catalog-hero-concept-2026-09-15.png"),
    alt: "SmashPro SP-MZIGO-27E Electric Material Carrier",
    classification: "future-catalog-concept",
    approvedChannel: "sp-mzigo-27e-catalog",
    sha256: "5da1d47f0ea1a51ab6ae25aa5d3ad5747549315186008f2fd8de390d7c272b7c",
  },
} as const;
