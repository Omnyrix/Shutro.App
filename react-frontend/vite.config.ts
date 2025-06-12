import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    host: true,              // bind to all IPs
    allowedHosts: ['3314-103-111-120-249.ngrok-free.app', 'localhost:3001'], // allow ngrok and localhost
}});

