export type CatalogStatus =
  | "concept"
  | "in-development"
  | "prototype"
  | "field-testing"
  | "production-candidate"
  | "available"
  | "archived";

export type CatalogProductKind = "universal-product" | "installation-kit" | "accessory" | "module" | "machine" | "attachment";

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
  priceCents?: number;
  inventoryStatus?: string;
  documentationUrl?: string;
  manualUrl?: string;
  cadDownloads?: string[];
  serialFormat?: string;
  compatibility?: string[];
}
