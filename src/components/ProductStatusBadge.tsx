import type { CatalogStatus } from "../types/catalog";

export const catalogStatusLabels: Record<CatalogStatus, string> = {
  concept: "Concept",
  "in-development": "In Progress",
  prototype: "Prototype",
  "field-testing": "Field Testing",
  "production-candidate": "Production Candidate",
  available: "Available",
  archived: "Archived",
};

export function ProductStatusBadge({ status }: { status: CatalogStatus }) {
  return <span className={`product-status product-status--${status}`}>{catalogStatusLabels[status]}</span>;
}
