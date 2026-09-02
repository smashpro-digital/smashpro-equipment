export type CatalogStatus =
  | "concept"
  | "in-development"
  | "prototype"
  | "field-testing"
  | "production-candidate"
  | "available"
  | "archived";

export type CatalogProductKind = "universal-product" | "installation-kit" | "accessory" | "module" | "machine" | "attachment";

export type CatalogVerificationStatus = "documented" | "measured" | "supplier-stated" | "planned" | "tbd";
export type CatalogDesignStatus = "draft" | "design-review" | "released" | "superseded";
export type CatalogDesignFileFormat = "pdf" | "svg" | "png";

export interface CatalogSpecification {
  id: string; group: string; label: string; value: string; verification: CatalogVerificationStatus; source: string; revision?: string;
}

export interface CatalogDesignFile {
  format: CatalogDesignFileFormat; label: string; url: string; downloadName: string;
}

export interface CatalogDesignPackage {
  id: string; title: string; kind: "nameplate" | "drawing" | "wiring" | "installation" | "template"; revision: string;
  status: CatalogDesignStatus; scope: string; description: string; previewImage?: string; previewAlt?: string; files: CatalogDesignFile[];
}

export interface CatalogCustomizationOption {
  id: string; title: string; category: "nameplate" | "finish" | "labeling" | "hardware";
  buildType: "battery-box"; availability: "planned" | "design-review" | "available";
  description: string; configurableFields: string[]; designPackageIds?: string[];
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: CatalogStatus;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  productKind: CatalogProductKind;
  featured?: boolean;
  revision?: string;
  platform?: string;
  application?: string;
  developmentProject?: string;
  availability?: "not-for-sale" | "request-quote" | "available";
  capabilities: string[];
  specifications?: CatalogSpecification[];
  designPackages?: CatalogDesignPackage[];
  customizationOptions?: CatalogCustomizationOption[];
  priceCents?: number;
  inventoryStatus?: string;
  serialFormat?: string;
  compatibility?: string[];
}
