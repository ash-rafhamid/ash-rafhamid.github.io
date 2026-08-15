import path from "path";
import { fileURLToPath } from "url";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    {
      name: "sites-worker-entry",
      apply: "build",
      closeBundle() {
        const serverDirectory = path.resolve(__dirname, "dist/server");
        const clientDirectory = path.resolve(__dirname, "dist/client");
        mkdirSync(serverDirectory, { recursive: true });
        mkdirSync(clientDirectory, { recursive: true });
        copyFileSync(
          path.resolve(__dirname, "worker/index.js"),
          path.resolve(serverDirectory, "index.js"),
        );
        copyFileSync(
          path.resolve(__dirname, "dist/index.html"),
          path.resolve(clientDirectory, "index.html"),
        );

        ["og.png", "og-gallery.png"].forEach((filename) => {
          const socialCard = path.resolve(__dirname, `dist/${filename}`);
          if (existsSync(socialCard)) {
            copyFileSync(socialCard, path.resolve(clientDirectory, filename));
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
