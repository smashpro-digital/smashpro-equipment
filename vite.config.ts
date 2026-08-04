import { cpSync, createReadStream, existsSync, mkdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

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
      },
    },
  },
});
