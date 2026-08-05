export type EquipmentStatus = "fleet-build" | "planned" | "request-only";

export interface EquipmentSpecification { label: string; value: string; confirmed: boolean; }
export interface GalleryImage { src: string; alt: string; caption: string; kind?: "image" | "video"; }
export interface RentalRequirement { title: string; detail: string; }
export interface FactoryFinish {
  paintColor: string;
  colorStandard: string;
  coatingProcess: string;
  factoryCure: string;
  summary: string;
}
export interface Equipment {
  slug: string;
  publicPath: string;
  fleetId: string;
  name: string;
  category: string;
  pronunciation?: string;
  meaning: string;
  slogan: string;
  overview: string;
  capabilityStatement: string;
  heroImage: string;
  status: EquipmentStatus;
  statusLabel: string;
  specifications: EquipmentSpecification[];
  factoryFinish?: FactoryFinish;
  capabilities: string[];
  idealUses: string[];
  includedAttachments: string[];
  plannedAttachments: string[];
  restrictions: string[];
  gallery: GalleryImage[];
  requirements: RentalRequirement[];
}

export interface Attachment { name: string; category: string; status: "included" | "planned"; compatibleFleetIds: string[]; }
