export type EquipmentStatus = "fleet-build" | "shipping" | "planned" | "request-only";
export type RecordVisibility = "public" | "private";
export type TimelineKind = "factory-build" | "purchase" | "delivery" | "upgrade" | "maintenance" | "attachment" | "media" | "rental" | "revenue" | "hours" | "state" | "status";

export interface EquipmentSpecification { label: string; value: string; confirmed: boolean; group?: string; source?: string; sortOrder?: number; }
export interface GalleryImage { id?: string; src: string; alt: string; caption: string; kind?: "image" | "video"; poster?: string; capturedAt?: string; width?: number; height?: number; group?: "shipping"; }
export interface FactoryUpdateStep { label: string; status: "completed" | "current" | "upcoming"; }
export interface FactoryUpdate {
  date: string;
  heading: string;
  description: string[];
  images: GalleryImage[];
  video: GalleryImage;
  timeline: FactoryUpdateStep[];
}
export interface RentalRequirement { title: string; detail: string; }
export interface FactoryFinish { paintColor: string; colorStandard: string; coatingProcess: string; factoryCure: string; summary: string; }
export interface FactoryOption { id: string; name: string; description: string; publicDisplay: boolean; installationSource: "factory"; evidenceMediaId?: string; evidenceObjectPosition?: string; }
export interface EquipmentUpgrade {
  id: string; name: string; category: string; description: string; installDate?: string; installedBy?: string; vendor?: string;
  estimatedAddedValue?: number; youtubeUrl?: string; imageUrls: string[]; vendorUrl?: string; warranty?: string;
  status: "planned" | "ordered" | "in-transit" | "installed" | "removed"; notes?: string; tags: string[];
}
export interface PackageRule { id: string; packageName: string; description: string; requiredTags: string[]; }
export interface CalculatedPackage { id: string; name: string; description: string; qualifyingUpgradeIds: string[]; }
export interface EquipmentAttachment { id: string; name: string; category: string; status: "installed" | "available" | "planned" | "removed"; addedAt?: string; description?: string; }
export interface IncludedItem { id: string; name: string; category: "accessory" | "spare-part"; }
export interface EquipmentDocument { id: string; title: string; kind: "manual" | "brochure" | "spec-sheet" | "warranty" | "invoice" | "receipt" | "other"; description?: string; source?: string; downloadName?: string; url?: string; publicDisplay: boolean; }
export interface ServiceRecord { id: string; performedAt: string; serviceType: string; summary: string; provider?: string; operatingHours?: number; status: "completed" | "scheduled"; }
export interface TimelineEvent { id: string; occurredAt?: string; kind: TimelineKind; title: string; detail?: string; publicDisplay: boolean; milestone?: "first-machine" | "first-rental" | "first-100-hours" | "first-revenue" | "first-state" | "first-youtube" | "first-major-upgrade" | "completed-build" | "500-hours" | "1000-hours"; }
export interface MediaRecord { id: string; title: string; kind: "image" | "video" | "youtube"; role?: "installation" | "walkaround" | "review" | "maintenance" | "short" | "build"; url: string; publishedAt?: string; description?: string; upgradeId?: string; }
export interface PassportScores { documentation: number; maintenance: number; }
export interface PublicValuation { amount?: number; currency: "USD"; calculatedAt?: string; status: "current" | "pending"; }
export interface EquipmentIdentity { passportId: string; model: string; factoryModel?: string; edition: string; finish?: string; serialNumberPublic?: string; assetClass: string; powertrain?: string; modelYear?: number; fleetEntryDate?: string; operatingHours?: number; }

export interface Equipment {
  slug: string; publicPath: string; fleetId: string; name: string; category: string; pronunciation?: string; meaning: string; slogan: string;
  overview: string; capabilityStatement: string; heroImage: string; status: EquipmentStatus; statusLabel: string; statusDetail?: string; identity: EquipmentIdentity;
  specifications: EquipmentSpecification[]; factoryFinish?: FactoryFinish; factoryUpdate?: FactoryUpdate; factoryOptions: FactoryOption[]; upgrades: EquipmentUpgrade[];
  packageRules: PackageRule[]; attachments: EquipmentAttachment[]; includedItems: IncludedItem[]; documents: EquipmentDocument[]; serviceHistory: ServiceRecord[];
  timeline: TimelineEvent[]; media: MediaRecord[]; scores: PassportScores; valuation: PublicValuation;
  capabilities: string[]; capabilityIds?: string[]; attachmentIds?: string[]; idealUses: string[]; restrictions: string[]; gallery: GalleryImage[]; requirements: RentalRequirement[];
}

export interface Attachment { name: string; category: string; status: "included" | "planned"; compatibleFleetIds: string[]; }
