import { publicEquipmentIndexRow } from "./src/domain/publicEquipmentIndex";
import { canonicalPassports } from "./src/data/passportRecords";
import { projectPassportPublicRecord } from "./src/domain/passportAutomation";
import { validatePassportIdentities } from "./src/domain/passportIdentity";
import { cpSync, createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { equipment } from "./src/data/equipment";
import { mzigoStatusLabel, mzigoStatusDetail } from "./src/data/mzigoPassport";
import { attachments } from "./src/data/attachments";
import { passportPublicPlugin } from "./scripts/passport-public-plugin";

validatePassportIdentities(equipment);

const projectDirectory = dirname(fileURLToPath(import.meta.url));

function preserveEquipmentMedia(): Plugin {
  let isBuild = false;
  return {
    name: "preserve-equipment-media",
    configResolved(config) { isBuild = config.command === "build"; },
    transformIndexHtml(html) {
      return html.replaceAll("__MZIGO_STATUS_DESCRIPTION__", `${mzigoStatusLabel}. ${mzigoStatusDetail}`);
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const prefix = "/equipment/images/";
        if (!request.url?.startsWith(prefix)) return next();
        const filename = decodeURIComponent(request.url.slice(prefix.length).split("?")[0]);
        const imagesDirectory = resolve(projectDirectory, "images");
        const candidate = resolve(imagesDirectory, filename);
        if (dirname(candidate) !== imagesDirectory || !existsSync(candidate)) return next();
        const contentTypes: Record<string, string> = { ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".mp4": "video/mp4" };
        response.setHeader("Content-Type", contentTypes[extname(candidate).toLowerCase()] ?? "application/octet-stream");
        createReadStream(candidate).pipe(response);
      });
    },
    closeBundle() {
      if (!isBuild) return;
      const output = resolve(projectDirectory, "dist/images");
      mkdirSync(output, { recursive: true });
      cpSync(resolve(projectDirectory, "images"), output, { recursive: true });
      cpSync(
        resolve(projectDirectory, "public/equipment/images/sp-pcm-001"),
        resolve(output, "sp-pcm-001"),
        { recursive: true },
      );
      cpSync(
        resolve(projectDirectory, "public/equipment/images/sp-gari-26e-concept.png"),
        resolve(output, "sp-gari-26e-concept.png"),
      );

      // Production is a static Apache host without an SPA catch-all. Emit a
      // physical index for every public attachment passport URL so direct loads,
      // refreshes, QR scans, and crawlers reach React before route matching.
      const shellIndex = resolve(projectDirectory, "dist/index.html");
      if (existsSync(shellIndex)) {
        for (const attachment of attachments) {
          const attachmentRoute = resolve(projectDirectory, "dist/attachments", attachment.slug);
          mkdirSync(attachmentRoute, { recursive: true });
          cpSync(shellIndex, resolve(attachmentRoute, "index.html"));
        }
      }

      const publicIndex = {
        version: 1,
        generated_at: new Date().toISOString(),
        equipment: equipment.map(item => {
          const canonical = canonicalPassports.find(p => p.asset.id === item.fleetId && p.build.renderer === 'generic');
          return publicEquipmentIndexRow(item, canonical ? projectPassportPublicRecord(canonical) : undefined);
        }),
      };
      writeFileSync(resolve(projectDirectory, "dist/equipment-index.json"), `${JSON.stringify(publicIndex, null, 2)}\n`, "utf8");
    },
  };
}

export default defineConfig(({ mode }) => {
  // Opt-in local preview: only the public shipment route is proxied.
  const env = loadEnv(mode, projectDirectory, "");
  const upstream = mode === "shipment-preview" ? env.SHIPMENT_PREVIEW_UPSTREAM : undefined;
  if (upstream && (new URL(upstream).protocol !== "https:" || new URL(upstream).origin !== upstream)) throw Error("Preview upstream must be an HTTPS origin");
  const proxy = upstream ? { "^/api/fleet/shipment/SP-ARDHI-26$": { target: upstream, changeOrigin: true } } : undefined;
  return {
  server: { proxy },
  preview: { proxy },
  base: "/equipment/",
  plugins: [react(), passportPublicPlugin(), preserveEquipmentMedia()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        catalog: resolve(projectDirectory, "index.html"),
        ardhi: resolve(projectDirectory, "sp-ardhi-26.html"),
        mzigo: resolve(projectDirectory, "sp-mzigo-26.html"),
        umba: resolve(projectDirectory, "sp-umba-26.html"),
        liftmate: resolve(projectDirectory, "sp-liftmate-27.html"),
        nyasi: resolve(projectDirectory, "sp-nyasi-26.html"),
        golfCartTechBuild: resolve(projectDirectory, "golf-cart-tech-build.html"),
        productCatalog: resolve(projectDirectory, "catalog/index.html"),
        powerControlModuleCatalog: resolve(projectDirectory, "catalog/sp-pcm-001/index.html"),
        mzigo27eCatalog: resolve(projectDirectory, "catalog/sp-mzigo-27e/index.html"),
        powerControlModuleLegacyRedirect: resolve(projectDirectory, "sp-pcm-001.html"),
        admin: resolve(projectDirectory, "admin.html"),
      },
    },
  },
};
});
