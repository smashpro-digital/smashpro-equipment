import type { Plugin } from "vite";
import { canonicalPassports } from "../src/data/passportRecords";
import {
  projectPassportPublicRecord,
  type CanonicalPassport,
} from "../src/domain/passportAutomation";
export function passportPublicPlugin(
  records: CanonicalPassport[] = canonicalPassports,
): Plugin {
  return {
    name: "passport-public-projection",
    resolveId(id) {
      if (id === "virtual:passport-public") return "\0virtual:passport-public";
    },
    load(id) {
      if (id === "\0virtual:passport-public")
        return `export const publicPassports = ${JSON.stringify(records.filter((p) => p.build.renderer === "generic").map(projectPassportPublicRecord))};`;
    },
  };
}
