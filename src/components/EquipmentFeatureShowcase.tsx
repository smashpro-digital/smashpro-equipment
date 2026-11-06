import { createElement } from "react";

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

export function EquipmentFeatureShowcase(props: EquipmentFeatureShowcaseProps) {
  return createElement("equipment-feature-showcase", {
    "data-config": JSON.stringify(props),
  });
}
