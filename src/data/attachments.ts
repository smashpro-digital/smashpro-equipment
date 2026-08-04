import type { Attachment } from "../types/equipment";

export const attachments: Attachment[] = [
  { name: "General-purpose bucket", category: "Earthmoving", status: "included", compatibleFleetIds: ["SP-ARDHI-26"] },
  { name: "Pallet forks", category: "Material handling", status: "included", compatibleFleetIds: ["SP-ARDHI-26"] },
  { name: "Brush cutter", category: "Land management", status: "planned", compatibleFleetIds: [] },
  { name: "Grapple", category: "Material handling", status: "planned", compatibleFleetIds: [] },
  { name: "Landscape rake", category: "Site finishing", status: "planned", compatibleFleetIds: [] },
  { name: "Recovery and towing accessories", category: "Fleet support", status: "planned", compatibleFleetIds: [] },
];
