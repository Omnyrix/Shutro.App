import { reactRouter } from "@react-router/dev/vite"; // Or @vitejs/plugin-react, depending on your choice
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  server: {
    watch: {
      usePolling: true, // <-- Add this line
    },
  },
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./server/app.ts",
        }
      : undefined,
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()], // Keep your current plugins
}));