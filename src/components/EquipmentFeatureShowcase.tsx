import { createElement, useEffect } from "react";

export type EquipmentFeatureAction = {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "outline";
  external?: boolean;
  sponsored?: boolean;
};

export type EquipmentFeatureFeed = {
  url: string;
  placement: string;
  product: string;
  advertiserId: string;
  publisherId: string;
  destination: string;
  creativeId: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
};

export interface EquipmentFeatureShowcaseProps {
  id?: string;
  eyebrow?: string;
  manufacturer: string;
  model: string;
  status: string;
  headline: string;
  description: string;
  image: {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  };
  features?: string[];
  actions?: EquipmentFeatureAction[];
  disclosure?: string;
  layout?: "image-left" | "image-right";
  theme?: "green" | "purple";
  statusDetail?: string;
  feed?: EquipmentFeatureFeed;
  feedActionIndex?: number;
  requireFeed?: boolean;
}

function loadEquipmentFeatureShowcaseAssets() {
  const stylesheetUrl = new URL("/equipment/equipment-feature-showcase.css", window.location.origin).href;
  const hasStylesheet = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .some(link => link.href === stylesheetUrl);
  if (!hasStylesheet) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = stylesheetUrl;
    stylesheet.addEventListener("error", () => console.error("Equipment feature showcase styles could not be loaded."), { once: true });
    document.head.append(stylesheet);
  }

  if (customElements.get("equipment-feature-showcase")) return;
  const scriptUrl = new URL("/equipment/equipment-feature-showcase.js", window.location.origin).href;
  const hasScript = Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="module"]'))
    .some(script => script.src === scriptUrl);
  if (hasScript) return;

  const script = document.createElement("script");
  script.type = "module";
  script.src = scriptUrl;
  script.addEventListener("error", () => console.error("Equipment feature showcase component could not be loaded."), { once: true });
  document.head.append(script);
}

export function EquipmentFeatureShowcase(props: EquipmentFeatureShowcaseProps) {
  useEffect(loadEquipmentFeatureShowcaseAssets, []);
  const config = JSON.stringify(props);
  return createElement("equipment-feature-showcase", {
    key: config,
    "data-config": config,
  });
}
