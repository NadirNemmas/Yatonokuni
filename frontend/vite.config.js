import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "frontend",
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"],
      },
    },
  },
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      "/api": "http://localhost:8000",
      "/auth": "http://localhost:8000",
      "/projets": "http://localhost:8000",
      "/characters": "http://localhost:8000",
      "/lostark": {
        target: "http://localhost:8000",
        bypass(req) {
          if (req.headers.accept?.includes("text/html")) return "/index.html";
        },
      },
    },
  },
});
