import type { CatalogProduct } from "../types/catalog";

export const catalogProducts: CatalogProduct[] = [
  {
    id: "SP-PCM-001",
    slug: "sp-pcm-001",
    name: "Power Control Module",
    category: "Power & Electrical",
    status: "in-development",
    description: "A documented 12V power-management prototype combining battery isolation, voltage monitoring, high-current distribution, and serviceable packaging.",
    image: "/equipment/images/sp-pcm-001/sp-pcm-001-feature-hero.jpg",
    imageAlt: "Glamorous concept artwork for the SP-PCM-001 Power Control Module developed for Project Rebirth",
    href: "/equipment/catalog/sp-pcm-001/",
    productKind: "module",
    featured: true,
    revision: "Rev A",
    platform: "Modular 12V vehicle power-management platform",
    application: "Initial development: Project Rebirth · 2018 Ford F-150 3.5L EcoBoost",
    developmentProject: "Project Rebirth",
    availability: "not-for-sale",
    capabilities: [
      "Master battery isolation",
      "Organized high-current distribution",
      "Local voltage monitoring",
      "Serviceable electrical architecture",
      "Documented installation and revision history",
      "Future platform-specific installation kits",
    ],
  },
];
