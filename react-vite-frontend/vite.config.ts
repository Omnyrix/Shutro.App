import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
  root: ".",
  publicDir: "public",
  base: "./",

  server: {
    watch: { usePolling: true },
    port: 3000,
  },

  resolve: {
    alias: [{ find: "@", replacement: "/app" }],
  },

  build: {
    outDir: "build",
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "utils-vendor": ["lodash", "axios", "gsap"],
        },
      },
    },
  },

  plugins: [
    react(),
    tsconfigPaths(),
    viteImagemin({
      // disable other optimizers
      gifsicle: false,
      optipng: false,
      pngquant: false,
      mozjpeg: false,
      svgo: false,
      // enable WebP conversion
      webp: {
        quality: 75,       // adjust between 0–100
        method: 4,         // 0 (fastest) to 6 (slowest/best)
        alphaQuality: 80,  // quality for alpha channel if present
      },
    }),
  ],
});
