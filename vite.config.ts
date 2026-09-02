import { cpSync, createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { equipment } from "./src/data/equipment";

const projectDirectory = dirname(fileURLToPath(import.meta.url));

function preserveEquipmentMedia(): Plugin {
  return {
    name: "preserve-equipment-media",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const prefix = "/equipment/images/";
        if (!request.url?.startsWith(prefix)) return next();
        const filename = decodeURIComponent(request.url.slice(prefix.length).split("?")[0]);
        const imagesDirectory = resolve(projectDirectory, "images");
        const candidate = resolve(imagesDirectory, filename);
        if (dirname(candidate) !== imagesDirectory || !existsSync(candidate)) return next();
        const contentTypes: Record<string, string> = { ".jpg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4" };
        response.setHeader("Content-Type", contentTypes[extname(candidate).toLowerCase()] ?? "application/octet-stream");
        createReadStream(candidate).pipe(response);
      });
    },
    closeBundle() {
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
      const publicIndex = {
        version: 1,
        generated_at: new Date().toISOString(),
        equipment: equipment.map((item) => ({
          fleet_id: item.fleetId,
          name: item.name,
          category: item.category,
          capability: item.capabilityStatement,
          capability_badges: item.capabilities.slice(0, 6),
          capability_ids: item.capabilityIds ?? [],
          attachment_ids: item.attachmentIds ?? [],
          discovery_state: "discoverable",
          status_label: item.statusLabel,
          public_path: `/equipment${item.publicPath}`,
          hero_image: item.heroImage,
          hero_alt: `${item.fleetId} ${item.category}`,
          quick_specs: item.specifications.filter((spec) => spec.confirmed).slice(0, 4).map((spec) => `${spec.label}: ${spec.value}`),
        })),
      };
      writeFileSync(resolve(projectDirectory, "dist/equipment-index.json"), `${JSON.stringify(publicIndex, null, 2)}\n`, "utf8");
    },
  };
}

export default defineConfig({
  base: "/equipment/",
  plugins: [react(), preserveEquipmentMedia()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        catalog: resolve(projectDirectory, "index.html"),
        ardhi: resolve(projectDirectory, "sp-ardhi-26.html"),
        mzigo: resolve(projectDirectory, "sp-mzigo-26.html"),
        golfCartTechBuild: resolve(projectDirectory, "golf-cart-tech-build.html"),
        productCatalog: resolve(projectDirectory, "catalog/index.html"),
        powerControlModuleCatalog: resolve(projectDirectory, "catalog/sp-pcm-001/index.html"),
        powerControlModuleLegacyRedirect: resolve(projectDirectory, "sp-pcm-001.html"),
        admin: resolve(projectDirectory, "admin.html"),
      },
    },
  },
});
