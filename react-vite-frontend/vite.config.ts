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
      // only match .png files
      filter: /\.(webp)$/i,

      // disable all other optimizers
      optipng: false,
      gifsicle: false,
      mozjpeg: false,
      svgo: false,

      // PNG compression
      pngquant: {
        quality: [0.7, 0.9],
        speed: 4,
      },

      // then convert those optimized PNGs to WebP
      webp: {
        quality: 75,       // 0–100
        method: 4,         // 0 (fast) to 6 (best)
        alphaQuality: 80,  // for transparency
      },
    }),
  ],
});
