import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: "views", // ← important : dit à Vite de partir du dossier views
  build: {
    rollupOptions: {
      input: resolve(__dirname, "views/index.html"),
    },
  },
});
