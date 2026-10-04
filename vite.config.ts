import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// User GitHub Pages site (vamshigarega.github.io) is served from the domain root,
// so the base path stays "/".
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Libraries change far less often than site copy. Keeping them in their
        // own files means a content edit does not make returning visitors
        // download React and the animation runtime again.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // the 3D engine is only ever reached through a dynamic import, so it
          // stays out of the first load entirely
          if (id.includes("/three/")) return "three";
          if (id.includes("react-icons") || id.includes("lucide-react")) return "icons";
          return "vendor";
        },
      },
    },
  },
});
