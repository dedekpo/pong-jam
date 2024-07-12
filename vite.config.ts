import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
  },
  base: "./",
  build: {
    target: "es6",
    assetsInlineLimit: 0, //disable inline assets
    cssTarget: "chrome61",
    assetsDir: "./assets",
  },
});
