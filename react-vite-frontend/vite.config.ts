import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: ".",
  publicDir: "public",
  base: "./",

  server: {
    watch: { usePolling: true },
    port: 3000, // Set dev server to run on port 3000
  },

  resolve: {
    alias: [{ find: "@", replacement: "/app" }],
  },

  build: {
    outDir: "build",
    emptyOutDir: true,
    // Raise warning limit to 1MB if you want
    chunkSizeWarningLimit: 500, // in kB

    rollupOptions: {
      output: {
        manualChunks: {
          // Bundle React/X libs into one chunk
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Bundle utility libraries
          "utils-vendor": ["lodash", "axios", "gsap"],
          // You can add per‐page chunks too, e.g.:
          // "settings-page": ["./src/pages/SettingsPage.tsx"]
        }
      }
    }
  },

  plugins: [
    // Official Vite React plugin
    react(),
    // TSConfig path alias support (@ → app/)
    tsconfigPaths(),
  ],
});
