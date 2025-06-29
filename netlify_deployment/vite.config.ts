import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: ".",
  publicDir: "public",
  base: "./",

  server: {
    watch: { usePolling: true },
  },

  resolve: {
    alias: [{ find: "@", replacement: "/app" }],
  },

  build: {
    outDir: "build",
    emptyOutDir: true,
  },

  plugins: [
    // Official Vite React plugin
    react(),

    // TSConfig path alias support (@ → app/)
    tsconfigPaths(),
  ],
});
