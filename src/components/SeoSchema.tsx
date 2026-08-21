import { useEffect } from "react";
import type { Equipment } from "../types/equipment";

export function SeoSchema({ item }: { item: Equipment }) {
  useEffect(() => {
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.equipmentSchema = "true";
    schema.text = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: item.fleetId, description: item.overview,
      image: `https://smashpro.app${item.heroImage}`, brand: { "@type": "Brand", name: "SmashPro" },
      model: item.specifications.find((spec) => spec.label === "Model reference")?.value,
      additionalProperty: [{ "@type": "PropertyValue", name: "Current status", value: item.statusLabel }],
    });
    document.head.append(schema);
    return () => schema.remove();
  }, [item]);
  return null;
}
