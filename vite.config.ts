import path from "path";
import { fileURLToPath } from "url";
import { copyFileSync, mkdirSync } from "node:fs";
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
        mkdirSync(serverDirectory, { recursive: true });
        copyFileSync(
          path.resolve(__dirname, "worker/index.js"),
          path.resolve(serverDirectory, "index.js"),
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
