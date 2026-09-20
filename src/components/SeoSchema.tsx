import { useEffect } from "react";
import type { Equipment } from "../types/equipment";

export function SeoSchema({ item }: { item: Equipment }) {
  useEffect(() => {
    const originalTitle = document.title;
    const title = `${item.fleetId} Equipment Passport | SmashPro Fleet`;
    const url = `https://smashpro.app/equipment${item.publicPath}`;
    const restore: Array<() => void> = [];
    const setHead = (selector: string, tag: string, identity: Record<string, string>, attribute: string, value: string) => {
      const existing = document.head.querySelector(selector);
      const element = existing ?? document.createElement(tag);
      const previous = element.getAttribute(attribute);
      Object.entries(identity).forEach(([key, val]) => element.setAttribute(key, val));
      element.setAttribute(attribute, value);
      if (!existing) document.head.append(element);
      restore.push(() => { if (!existing) element.remove(); else if (previous === null) element.removeAttribute(attribute); else element.setAttribute(attribute, previous); });
    };
    document.title = title;
    setHead('link[rel="canonical"]', "link", { rel: "canonical" }, "href", url);
    setHead('meta[name="description"]', "meta", { name: "description" }, "content", item.overview);
    for (const [property, content] of Object.entries({ "og:title": title, "og:url": url, "og:description": item.overview, "og:image": `https://smashpro.app${item.heroImage}` })) {
      setHead(`meta[property="${property}"]`, "meta", { property }, "content", content);
    }
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.equipmentSchema = "true";
    schema.text = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: item.fleetId, description: item.overview,
      image: `https://smashpro.app${item.heroImage}`, brand: { "@type": "Brand", name: item.manufacturer ?? "SmashPro" },
      model: item.identity.factoryModel ?? item.specifications.find((spec) => spec.label === "Model reference")?.value,
      additionalProperty: [{ "@type": "PropertyValue", name: "Current status", value: item.statusLabel }],
    });
    document.head.append(schema);
    return () => { schema.remove(); restore.forEach(reset => reset()); document.title = originalTitle; };
  }, [item]);
  return null;
}
