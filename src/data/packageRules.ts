import type { PackageRule } from "../types/equipment";

export const standardPackageRules: PackageRule[] = [
  { id: "command", packageName: "Command Package", description: "Connected command, charging, and telemetry equipment.", requiredTags: ["gps", "solar", "fleet telemetry"] },
  { id: "night-ops", packageName: "Night Ops Package", description: "Documented lighting configuration for low-light work.", requiredTags: ["rock lights", "light bar", "work lights"] },
  { id: "recovery", packageName: "Recovery Package", description: "Integrated recovery and towing equipment.", requiredTags: ["winch", "recovery points", "receiver hitch"] },
  { id: "media", packageName: "Media Package", description: "On-machine production and field connectivity equipment.", requiredTags: ["camera mounts", "power station", "starlink", "creator lighting"] },
];
