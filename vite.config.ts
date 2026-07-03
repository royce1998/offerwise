import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project site is served from /offerwise/
export default defineConfig({
  base: "/offerwise/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
